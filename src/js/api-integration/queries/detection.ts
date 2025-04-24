import { useDetection } from "../../context/detection";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import {
  DetectionCategory,
  GetDetectionCategoryMetadataResponse,
  GetDetectionMetadataResponse,
} from "../types/detection";

import { createUrlParams } from "./review";

export const detectionMetadataQueryKey = (fileId: string) => [
  "detection",
  fileId,
];

export const detectionMetadataSampleQueryKey = (fileId: string) => [
  "detection",
  fileId,
  "sample",
];
export const detectionCategoryMetadataQueryKey = (
  fileId: string,
  category: DetectionCategory,
  ...rest: string[]
) => ["detection", fileId, category, ...rest];

export const useDetectionMetadataSampleQuery = (
  refetchInterval?: number | false
) => {
  const api = useApi();
  const { fileId, fileType } = useDetection();
  const queryKey = detectionMetadataSampleQueryKey(fileId);

  const params = createUrlParams({
    video_id: fileId,
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<GetDetectionMetadataResponse>(
        `/api/v1/video_detection_metadata/get_sample_video_metadata/?${params.toString()}`
      );
      return data;
    },
    enabled:
      !!fileId && (fileType === "VideoFile" || fileType === "ProjectVideoFile"),
    refetchInterval,
  });
};

export const useDetectionCategoryMetadataQuery = (
  category: DetectionCategory,
  language_code?: string
) => {
  const api = useApi();
  const { fileId, fileType } = useDetection();
  const queryKey = language_code
    ? detectionCategoryMetadataQueryKey(fileId, category, language_code)
    : detectionCategoryMetadataQueryKey(fileId, category);

  const params = createUrlParams({
    video_id: fileId,
    category,
    ...(language_code ? { additional_data: `language:${language_code}` } : {}),
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<GetDetectionCategoryMetadataResponse>(
        `/api/v1/video_detection_metadata/get_video_metadata/?${params.toString()}`
      );
      return data;
    },
    enabled:
      !!fileId &&
      !!category &&
      (fileType === "VideoFile" || fileType === "ProjectVideoFile"),
  });
};
