import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import { AssetShareDetailsList, ShareCommentResponse } from "../types/share";
import { createUrlParams } from "../queries/review";
import { useComments } from "../../context/comments";
import { ReviewCommentSort } from "../types/review";
import { useShareStore } from "../../stores/share-store";

import { useAxios } from "../../hooks/useApi";

export const getAssetSharesQueryKey = (assetId: string) => ["share", assetId];

export const getShareDetailsQueryKey = (shareId: string) => [
  "share-details",
  shareId,
];

export const getShareCommentsQueryKey = (
  assetId: string,
  sort_by: ReviewCommentSort,
  token: string,
  isTaskShare?: boolean
) => [
  isTaskShare ? "task-share-comments" : "share-comments",
  assetId,
  sort_by,
  token,
];

export const useShareCommentsQueryKey = () => {
  const { fileId, appliedSort } = useComments();
  const { token: storeToken, shareId } = useShareStore();
  const localToken = sessionStorage.getItem(`share-${shareId}`);
  const token = localToken ?? storeToken ?? "";
  return getShareCommentsQueryKey(fileId, appliedSort, token, false);
};

export const useAssetShareList = (assetId: string, enabled = true) => {
  const api = useAxios();

  return useQuery({
    queryKey: getAssetSharesQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<AssetShareDetailsList>(
        `/api/v1/library/${assetId}/share_info`
      );

      return data;
    },
    enabled: !!assetId && enabled,
  });
};

export const useShareComments = (
  shareId: string,
  assetId: string,
  versionStackId?: string
) => {
  const api = useAxios();
  const { token: storeToken, shareData } = useShareStore();
  const localToken = sessionStorage.getItem(`share-${shareId}`);
  const token = localToken ?? storeToken ?? "";
  const { appliedSort } = useComments();
  const queryKey = useShareCommentsQueryKey();
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const urlParams = createUrlParams({
        sort_by: appliedSort,
        page: pageParam.toString(),
        item: assetId,
        ...(token ? { token } : {}),
        ...(versionStackId ? { version_stack_id: versionStackId } : {}),
      });
      const { data } = await api.get<ShareCommentResponse>(
        `/api/v1/share/${shareId}/comments/?${urlParams.toString()}`
      );
      return data.data;
    },
    enabled:
      !!shareId &&
      shareId?.length > 0 &&
      (shareData?.is_public || (!!token && token?.length > 0)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};
