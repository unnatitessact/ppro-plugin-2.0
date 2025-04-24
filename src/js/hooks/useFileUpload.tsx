import type {
  PresignedUrlsResponse,
  UploadCompleteResponse,
  UploadIdResponse,
} from "../api-integration/types/upload";

import { useRef } from "react";

// import { usePathname } from "next/navigation";

// import * as Sentry from "@sentry/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { ToastFallback } from "../components/ui/ToastContent";

import { useActionsToasts } from "./useActionsToasts";
import { useApi } from "./useApi";
import { useWorkspace } from "./useWorkspace";

import { getUsageLimitQueryKey } from "../api-integration/queries/globals";
import {
  getLibraryContentsQueryKey,
  getTreeQueryKey,
} from "../api-integration/queries/library";

import { useUploadsStore } from "../stores/uploads-store";

import { getFileTypeFromMimeType } from "../utils/upload";

// Constants
const PART_SIZE = 10 * 1024 * 1024; // 10MB chunks
const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Assuming minimum 100KB/s total bandwidth shared between 3 concurrent uploads
// Each upload gets roughly 33KB/s
// 10MB / (33KB/s) = 300 seconds
const UPLOAD_TIMEOUT = 240000; // 240 seconds (4 minutes) - capped by browser limitations

interface UploadPart {
  index: number;
  url: string;
  blob: Blob;
  partNumber: number;
}

interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  message?: string;
  code?: string;
}

export const useFileUpload = (
  category: "library" | "project" | "attachment",
  parent: string | null = null,
  projectId?: string,
  onSuccess?: (uploadedFile: UploadCompleteResponse) => void
) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  // const pathname = usePathname();
  const pathname = "library";
  const queryClient = useQueryClient();
  const { showToast } = useActionsToasts();
  const { addToUploads, updateProgress, removeFromUploads } = useUploadsStore();

  // Map of each part and its abort controllers
  const activeUploadsRef = useRef<Map<string, AbortController[]>>(new Map());

  // Gets the part of the file to upload
  const getPartBlob = (file: File, index: number, partSize: number): Blob => {
    const start = index * partSize;
    const end = Math.min(start + partSize, file.size);
    return file.slice(start, end);
  };

  const uploadPartWithRetry = async (
    part: UploadPart,
    onProgress: (loaded: number) => void
  ): Promise<{ ETag: string; PartNumber: number }> => {
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      const controller = new AbortController();

      try {
        if (!activeUploadsRef.current.has(part.url)) {
          activeUploadsRef.current.set(part.url, []);
        }
        activeUploadsRef.current.get(part.url)?.push(controller);

        const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

        const response = await axios.put(part.url, part.blob, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
          onUploadProgress: (progressEvent) => {
            onProgress(progressEvent.loaded);
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.headers.etag) {
          throw new Error("No ETag received");
        }

        return {
          ETag: JSON.parse(response.headers.etag),
          PartNumber: part.partNumber,
        };
      } catch (error) {
        if (attempt === MAX_RETRIES) throw error;

        await new Promise((resolve) =>
          setTimeout(resolve, INITIAL_RETRY_DELAY * 2 ** attempt)
        );
        attempt++;
      } finally {
        const controllers = activeUploadsRef.current.get(part.url) || [];
        const index = controllers.indexOf(controller);
        if (index > -1) controllers.splice(index, 1);
      }
    }

    throw new Error("Max retries exceeded");
  };

  const uploadQueue = async (
    file: File,
    presignedUrls: string[],
    uploadId: string
  ): Promise<Array<{ ETag: string; PartNumber: number }>> => {
    const results: Array<{ ETag: string; PartNumber: number }> = [];
    const pending = new Set<Promise<{ ETag: string; PartNumber: number }>>();
    const completedSize = new Map<number, number>();

    const updateTotalProgress = () => {
      const totalUploaded = Array.from(completedSize.values()).reduce(
        (a, b) => a + b,
        0
      );
      updateProgress(uploadId, totalUploaded);
      return totalUploaded;
    };

    for (let i = 0; i < presignedUrls.length; i++) {
      if (pending.size >= MAX_CONCURRENT_UPLOADS) {
        await Promise.race(pending);
      }

      // Create blob on-demand for each part
      const part: UploadPart = {
        index: i,
        url: presignedUrls[i],
        blob: getPartBlob(file, i, PART_SIZE),
        partNumber: i + 1,
      };

      const uploadPromise = uploadPartWithRetry(part, (loaded: number) => {
        completedSize.set(part.index, loaded);
        updateTotalProgress();
      }).then((result) => {
        pending.delete(uploadPromise);
        results[part.index] = result;
        return result;
      });

      pending.add(uploadPromise);
    }

    await Promise.all(pending);
    return results.filter(Boolean);
  };

  const uploadFile = async (
    file: File,
    customParentId: string | null = null,
    versionStackId?: string | null,
    versionStackFileId?: string | null,
    taskShareId?: string | null,
    token?: string | null,
    customPayload?: Record<string, unknown>
  ) => {
    let uploadIdDetails: UploadIdResponse | undefined;

    const uploadIdURL = getUploadIdURL(taskShareId);
    const presignedURL = getPresignedURL(taskShareId);
    const completeURL = getCompleteURL(taskShareId);

    try {
      const fileName = file.name;
      const fileType = getFileTypeFromMimeType(file.type);
      const fileSize = file.size;

      if (fileSize === 0) {
        toast(
          <ToastFallback
            title={`Cannot upload empty file ${fileName}`}
            description="File size cannot be 0 bytes"
          />
        );
        return;
      }

      const payload = {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        ...(workspace ? { workspace: workspace.id } : {}),
        parent: customParentId || parent || undefined,
        category,
        ...(category === "project" && projectId ? { project: projectId } : {}),
        ...(taskShareId ? { project: projectId } : {}),
        version_stack_file_id: versionStackFileId || undefined,
        ...(token ? { token } : {}),
        ...(customPayload ? customPayload : {}),
      };

      const { data: uploadIdResponse } = await api.post<UploadIdResponse>(
        uploadIdURL,
        payload
      );

      uploadIdDetails = uploadIdResponse;

      addToUploads({
        uploadId: uploadIdDetails.upload_id,
        fileName,
        fileType,
        sizeUploaded: 0,
        totalSize: fileSize,
        uploadPath: pathname,
        fileId: uploadIdDetails.data.id,
        ...(versionStackId && { versionStackId }),
        ...(versionStackFileId && { versionStackFileId }),
        parent: customParentId || parent || null,
      });

      const parts = Math.ceil(file.size / PART_SIZE);
      const { data: presignedUrls } = await api.post<PresignedUrlsResponse>(
        presignedURL,
        {
          file: uploadIdDetails.data.id,
          upload_id: uploadIdDetails.upload_id,
          parts,
          ...(token ? { token } : {}),
        }
      );

      // Use the new uploadQueue implementation
      const uploadedParts = await uploadQueue(
        file,
        presignedUrls.data,
        uploadIdDetails.upload_id
      );

      const { data: completeResponse } = await api.post<UploadCompleteResponse>(
        completeURL,
        {
          file: uploadIdDetails.data.id,
          upload_id: uploadIdDetails.upload_id,
          parts: uploadedParts,
          version_stack_file_id: versionStackFileId || undefined,
          ...(token ? { token } : {}),
        }
      );

      const libraryQueryKey = getLibraryContentsQueryKey(
        workspace.id,
        customParentId || parent
      );
      if (category === "library") {
        await queryClient.invalidateQueries({
          queryKey: libraryQueryKey,
        });
      }

      if (category === "project") {
        await queryClient.invalidateQueries({
          queryKey: [
            "projectLibrary",
            projectId,
            customParentId || parent || null,
            "",
          ],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, customParentId || parent),
      });

      await queryClient.invalidateQueries({
        queryKey: getUsageLimitQueryKey(),
      });

      // await Promise.all([
      //   queryClient.invalidateQueries({
      //     queryKey: getLibraryContentsQueryKey(workspace.id, customParentId || parent)
      //   }),
      //   queryClient.invalidateQueries({
      //     queryKey: getTreeQueryKey(workspace.id, customParentId || parent)
      //   }),
      //   queryClient.invalidateQueries({
      //     queryKey: getUsageLimitQueryKey()
      //   }),
      //   category === 'project' &&
      //     queryClient.invalidateQueries({
      //       queryKey: ['projectLibrary', projectId, customParentId || parent || null, '']
      //     })
      // ]);

      if (category === "library") {
        showToast(
          versionStackFileId ? "on_file_version_creation" : "on_file_creation",
          customParentId || parent || null
        );
      }

      removeFromUploads(uploadIdDetails.upload_id);
      onSuccess?.(completeResponse);
      return completeResponse;
    } catch (error: unknown) {
      console.log(`[UPLOAD ERROR]`, error);

      if (uploadIdDetails?.upload_id) {
        removeFromUploads(uploadIdDetails.upload_id);
      }

      const apiError = error as ApiError;

      // Sentry.setContext("upload_details", {
      //   fileName: file.name,
      //   fileSize: file.size,
      //   fileType: file.type,
      //   category,
      //   workspace: workspace.id,
      //   parent: customParentId || parent,
      //   projectId,
      // });

      if (apiError.response?.status === 402) {
        toast.error("Storage limit exceeded", {
          description:
            "This file cannot be uploaded as it exceeds your remaining storage space.",
          duration: 10000,
        });
        // Sentry.captureException(error, {
        //   level: "warning",
        //   tags: { errorType: "storage_limit_exceeded" },
        // });
        return;
      }

      if (error instanceof TypeError) {
        toast.error("Connection issue", {
          description: "Please check your internet connection and try again.",
          duration: 5000,
        });
        // Sentry.captureException(error, {
        //   level: "error",
        //   tags: { errorType: "network_error" },
        // });
        return;
      }

      if (apiError.response?.status === 403) {
        toast.error("Upload failed", {
          description: "The upload link has expired. Please try again.",
          duration: 5000,
        });
        // Sentry.captureException(error, {
        //   level: "error",
        //   tags: { errorType: "presigned_url_expired" },
        // });
        return;
      }

      if (apiError.response?.status === 500) {
        toast.error("Server error", {
          description:
            "We encountered an issue processing your upload. Please try again.",
          duration: 5000,
        });
        // Sentry.captureException(error, {
        //   level: "error",
        //   tags: { errorType: "server_error" },
        // });
        return;
      }

      toast.error("Upload failed", {
        description: "Something went wrong while uploading. Please try again.",
        duration: 5000,
      });

      // Sentry.captureException(error, {
      //   level: "error",
      //   tags: {
      //     errorType: "unhandled_upload_error",
      //     statusCode: apiError.response?.status,
      //   },
      //   extra: {
      //     response: apiError.response,
      //     message: apiError.message,
      //   },
      // });
    }
  };

  return { uploadFile };
};

const getUploadIdURL = (taskShareId?: string | null) => {
  if (taskShareId) {
    return `/api/v1/task_shares/${taskShareId}/upload_id/`;
  }
  return `/api/v1/aws/upload_id/`;
};

const getPresignedURL = (taskShareId?: string | null) => {
  if (taskShareId) {
    return `/api/v1/task_shares/${taskShareId}/presigned_url/`;
  }
  return `/api/v1/aws/presigned_url/`;
};

const getCompleteURL = (taskShareId?: string | null) => {
  if (taskShareId) {
    return `/api/v1/task_shares/${taskShareId}/aws_complete/`;
  }
  return `/api/v1/aws/aws_complete/`;
};
