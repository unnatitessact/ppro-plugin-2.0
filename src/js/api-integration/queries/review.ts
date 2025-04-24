// import { useSearchParams } from 'next/navigation';

import { useComments } from "../../context/comments";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DateValue, parseDate } from "@internationalized/date";

export type DateFilter = DateValue | null;

// import { DateFilter } from "../../components/review/ReviewFilterDropdown/ReviewFilterDropdown";

import { useApi } from "../../hooks/useApi";
// import { useReviewFilterParams } from "../../hooks/useReviewFilterParams";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  GetFileReviewFiltersResponse,
  GetHashtagsResponse,
  GetReviewCommentResponse,
  ReviewCommentSort,
} from "../types/review";

// Helper function to create URL params
export const createUrlParams = (
  params: Record<string, string | boolean | string[] | undefined>
) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        urlParams.append(key, value.join(","));
      } else {
        urlParams.append(key, value.toString());
      }
    }
  });
  return urlParams;
};

// Query keys
export const reviewCommentsQueryKey = ({
  file_id,
  ...restParams
}: {
  file_id: string;
  mentioned_users?: string[];
  tags?: string[];
  created_by?: string[];
  marked_as_done?: boolean;
  has_attachments?: boolean;
  search?: string;
  sort_by?: ReviewCommentSort;
  unread_by_user?: boolean;
  created_date?: DateFilter;
}) => ["review_comments", file_id, restParams];

export const reviewCommentsFiltersQueryKey = (file_id: string) => [
  "review_filters",
  file_id,
];

export const reviewCommentsHashtagsQueryKey = (workspace_id: string) => [
  "review_hashtags",
  workspace_id,
];

// Custom hooks
// export const useReviewCommentsQueryKey = () => {
//   // const searchParams = useSearchParams();
//   const searchParams = "";
//   const { fileId } = useComments();
//   const [filters] = useReviewFilterParams();

//   return reviewCommentsQueryKey({
//     file_id: fileId,
//     mentioned_users: filters.mentions ? filters.mentions.split(",") : undefined,
//     tags: filters.tags ? filters.tags.split(",") : undefined,
//     created_by: filters.commenter ? filters.commenter.split(",") : undefined,
//     marked_as_done: filters.markedDone,
//     has_attachments: filters.attachments,
//     // search: searchParams.get("query")?.toString(),
//     search: "",
//     sort_by: filters.sort as ReviewCommentSort,
//     unread_by_user: filters.unread,
//     created_date: filters.createdDate
//       ? parseDate(filters.createdDate)
//       : undefined,
//   });
// };

// export const useReviewCommentsQuery = () => {
//   const api = useApi();
//   const queryKey = useReviewCommentsQueryKey();
//   const { fileId } = useComments();
//   const [filters] = useReviewFilterParams();
//   const search = "";
//   // const search = useSearchParams().get("query")?.toString() ?? "";

//   // Create URL params for the API call
//   const urlParams = createUrlParams({
//     sort_by: filters.sort,
//     search: search.trim(),
//     has_attachments: filters.attachments ? true : undefined,
//     marked_as_done: filters.markedDone ? true : undefined,
//     created_by: filters.commenter,
//     tag: filters.tags,
//     mentioned_user: filters.mentions,
//     file_id: fileId,
//     unread_by_user: filters.unread ? true : undefined,
//     page_size: "20",
//     created_on: filters.createdDate,
//   });

//   return useInfiniteQuery({
//     queryKey,
//     queryFn: async ({ pageParam = 1 }) => {
//       urlParams.append("page", pageParam.toString());
//       const { data } = await api.get<GetReviewCommentResponse>(
//         `/api/v1/review_comments/?${urlParams.toString()}`
//       );
//       return data.data;
//     },
//     enabled: !!fileId,
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) =>
//       lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
//     getPreviousPageParam: (lastPage) =>
//       lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
//   });
// };

export const useReviewGetFiltersQuery = (file_id: string) => {
  const api = useApi();
  return useQuery({
    queryKey: reviewCommentsFiltersQueryKey(file_id),
    queryFn: async () => {
      const { data } = await api.get<GetFileReviewFiltersResponse>(
        `/api/v1/review_comments/file_review_filters/?file_id=${file_id}`
      );
      return data;
    },
    enabled: !!file_id,
  });
};

export const useReviewHashtagsQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  return useQuery({
    queryKey: reviewCommentsHashtagsQueryKey(workspace.id),
    queryFn: async () => {
      const { data } = await api.get<GetHashtagsResponse>(
        `api/v1/review_comments/tags/?workspace=${workspace.id}`
      );
      return data;
    },
    enabled: !!workspace.id,
  });
};
