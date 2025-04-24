import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import { GetSubtitleListResponse } from "../types/video";

export const getVideoSubtitlesQueryKey = (assetId: string) => [
  "video",
  "subtitles",
  assetId,
];

export const useSubtitlesQuery = (assetId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getVideoSubtitlesQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<GetSubtitleListResponse>(
        `/api/v1/subtitles/?video=${assetId}`
      );
      return data;
    },
    select: (data) =>
      data.filter(
        (subtitle) =>
          subtitle.url.endsWith(".srt") ||
          subtitle.process_status === "in_progress"
      ), // Only use SRT files
    enabled: !!assetId,
  });
};
