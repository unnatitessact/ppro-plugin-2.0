import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";

// import { useParams } from "next/navigation";

import { useDndContext, useDroppable } from "@dnd-kit/core";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import {
  ToastFallback,
  ToastProcess,
  ToastSuccess,
} from "../../components/ui/ToastContent";

import { useParamsStateStore } from "../../stores/params-state-store";

// import { useFileUpload } from '@/hooks/useFileUpload';
import { useFileUpload } from "../../hooks/useFileUpload";

import { LibraryAsset } from "../../api-integration/types/library";

import { isValidLibraryDrop } from "../../utils/libraryUtils";
import { MOBILE_MEDIA_QUERY } from "../../utils/responsiveUtils";

interface LibraryDroppableProps {
  children: ReactNode;
  id: string;
  data: LibraryAsset;
  disabled?: boolean;
  dropzoneDisabled?: boolean;
  setIsDropzoneActive: Dispatch<SetStateAction<boolean>>;
}

export const LibraryDroppable = ({
  children,
  id,
  data,
  disabled,
  dropzoneDisabled,
  setIsDropzoneActive,
}: LibraryDroppableProps) => {
  const { active } = useDndContext();

  const { folderId } = useParamsStateStore();

  // const { folderId } = useParams();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const versionStackFileId =
    data?.resourcetype === "VersionStack"
      ? data?.versions?.[0]?.file.id
      : data?.id;

  const { uploadFile: uploadVersion } = useFileUpload(
    "library",
    folderId as string,
    undefined,
    undefined
    // id,
    // versionStackFileId
  );

  const { uploadFile: uploadFile } = useFileUpload(
    "library",
    null,
    undefined,
    undefined
  );

  const isSame = active ? (active?.id === id ? true : false) : false;

  const { setNodeRef, over } = useDroppable({
    id,
    data,
    disabled: isSame || disabled || isMobile,
  });

  // This uploads the files as new versions
  const uploadVersions = async (files: File[]) => {
    const promises = files.map((file) =>
      uploadVersion(file, null, id, versionStackFileId)
    );
    return Promise.all(promises);
  };

  // This uploads the files as new files when dropped on this folder
  const uploadFiles = async (files: File[]) => {
    if (data?.resourcetype === "Folder") {
      const promises = files.map((file) => uploadFile(file, data?.id));
      await Promise.all(promises);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (data?.resourcetype === "Folder") {
        toast.promise(uploadFiles(acceptedFiles), {
          loading: (
            <ToastProcess
              title={`Uploading new files in ${data?.name} folder.`}
            />
          ),
          success: (
            <ToastSuccess
              title={`Uploaded new files in ${data?.name} folder.`}
            />
          ),
          error: (
            <ToastFallback
              title={`Failed to upload new files in ${data?.name} folder.`}
            />
          ),
        });
      } else {
        toast.promise(uploadVersions(acceptedFiles), {
          loading: <ToastProcess title="Uploading file as new version" />,
          success: <ToastSuccess title="Uploaded new file as version" />,
          error: <ToastFallback title="Failed to upload new file as version" />,
        });
      }
    },
    multiple: true,
    disabled: dropzoneDisabled,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"],
      "video/*": [
        ".mp4",
        ".mov",
        ".avi",
        ".wmv",
        ".flv",
        ".mpeg",
        ".mpg",
        ".m4v",
      ],
      "audio/*": [
        ".mp3",
        ".wav",
        ".ogg",
        ".flac",
        ".aac",
        ".m4a",
        ".wma",
        ".aiff",
      ],
    },
    noClick: true,
    noKeyboard: true,
    noDragEventsBubbling: true,
  });

  const activeData = active?.data?.current as LibraryAsset;
  const overData = over?.data?.current as LibraryAsset;

  const isDropValid = isValidLibraryDrop({
    active: {
      id: activeData?.id,
      resourceType: activeData?.resourcetype,
    },
    asset: {
      id: id,
      resourceType: data?.resourcetype,
    },
    over: {
      id: overData?.id,
      resourceType: overData?.resourcetype,
    },
  });

  const showHighlight = isDropValid || isDragActive;

  useEffect(() => {
    isDragActive ? setIsDropzoneActive(true) : setIsDropzoneActive(false);
  }, [isDragActive, setIsDropzoneActive]);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        ref={setNodeRef}
        className={cn(
          showHighlight
            ? "rounded-5  border-primary-200 bg-primary-50 transition-colors"
            : " border-transparent",
          "h-full w-full border-2 [&>div]:h-full [&>div]:w-full"
        )}
        aria-label="Droppable region"
      >
        {children}
      </div>
    </div>
  );
};
