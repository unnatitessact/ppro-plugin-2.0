// import { useComments } from "../../context/comments";
// import { useBroadcastEvent } from "../../../../liveblocks.config";
// // import { useBroadcastEvent } from "../../liveblocks.config";
// import {
//   InfiniteData,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import FileDownload from "js-file-download";

// // import {
// //   hashtagRegex,
// //   tagMentionMarkup,
// // } from "../../components/mentions/Mentions";
// import { showToast } from "../../components/ui/ToastContent";

// import { useApi } from "../../hooks/useApi";
// import { useWorkspace } from "../../hooks/useWorkspace";

// import {
//   createUrlParams,
//   reviewCommentsFiltersQueryKey,
//   reviewCommentsHashtagsQueryKey,
//   // useReviewCommentsQueryKey,
// } from "../../api-integration/queries/review";
// import { useShareCommentsQueryKey } from "../../api-integration/queries/share";
// import {
//   CommentDownloadFileExtension,
//   CommentDownloadFileType,
//   CreateAddReviewCommentReplyRequest,
//   CreateAddReviewCommentReplyResponse,
//   CreateAddReviewCommentRequest,
//   CreateAddReviewCommentResponse,
//   GetReviewCommentResponse,
//   UpdateReviewCommentRequest,
// } from "../../api-integration/types/review";

// import { useReviewStore } from "../../stores/review-store";

// // export const useAddReviewComment = () => {
// //   const api = useApi();
// //   const queryClient = useQueryClient();
// //   const queryKey = useReviewCommentsQueryKey();
// //   const { workspace } = useWorkspace();

// //   const broadcast = useBroadcastEvent();

// //   const { setCommentToAutoscrollTo } = useReviewStore();

// //   return useMutation({
// //     mutationFn: async (payload: CreateAddReviewCommentRequest) => {
// //       setCommentToAutoscrollTo(null);

// //       // Newly created hashtags in the text are in the format #hashtags
// //       // They need to be converted to the react-mentions markup format for hashtags
// //       const textWithHashtagsMarkup = payload.text.replaceAll(
// //         hashtagRegex,
// //         (match) => {
// //           // the match will have a # at the beginning, so we remove it
// //           return tagMentionMarkup.replace("__id__", match.slice(1));
// //         }
// //       );

// //       // Don't send out_time if it's the same as in_time
// //       const { out_time, in_time, ...rest } = payload;
// //       const newPayload = {
// //         ...rest,
// //         text: textWithHashtagsMarkup,
// //         in_time,
// //         ...(in_time !== out_time && { out_time }),
// //       };

// //       const data = await api.post<CreateAddReviewCommentResponse>(
// //         `/api/v1/review_comments/`,
// //         newPayload
// //       );

// //       return data;
// //     },
// //     onSuccess: async (response, payload) => {
// //       await queryClient.invalidateQueries({
// //         queryKey,
// //       });
// //       queryClient.invalidateQueries({
// //         queryKey: reviewCommentsFiltersQueryKey(payload.file_id),
// //       });
// //       queryClient.invalidateQueries({
// //         queryKey: reviewCommentsHashtagsQueryKey(workspace.id),
// //       });
// //       response?.data?.id && setCommentToAutoscrollTo(response?.data?.id);
// //       broadcast({
// //         type: "COMMENTS_UPDATED",
// //       });
// //     },
// //     onError: () => {
// //       showToast({
// //         state: "error",
// //         title: "Failed to add a new comment",
// //       });
// //     },
// //   });
// // };

// export const useUpdateReviewComment = (id: string) => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();
//   const { fileId } = useComments();

//   const broadcast = useBroadcastEvent();

//   return useMutation({
//     mutationFn: async (payload: UpdateReviewCommentRequest) => {
//       const data = await api.patch(`/api/v1/review_comments/${id}/`, payload);

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKey,
//       });
//       queryClient.invalidateQueries({
//         queryKey: reviewCommentsFiltersQueryKey(fileId),
//       });

//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: () => {
//       showToast({
//         state: "error",
//         title: "Failed to update comment",
//       });
//     },
//   });
// };

// export const useMarkReviewCommentDone = (id: string) => {
//   // Optimistically mark review comment as done
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();

//   const broadcast = useBroadcastEvent();

//   return useMutation({
//     mutationFn: async () => {
//       const data = await api.post(
//         `/api/v1/review_comments/${id}/update_mark_as_done/`
//       );
//       return data;
//     },
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousComments: GetReviewCommentResponse["data"] | undefined =
//         queryClient.getQueryData(queryKey);
//       if (!previousComments) return;
//       queryClient.setQueryData(
//         queryKey,
//         (
//           old:
//             | InfiniteData<GetReviewCommentResponse["data"], unknown>
//             | undefined
//         ) => {
//           if (!old) return old;
//           const newData = { ...old };
//           for (const page of newData.pages) {
//             for (const comment of page.results) {
//               if (comment.id === id) {
//                 comment.marked_as_done = !comment.marked_as_done;
//               }
//             }
//           }
//           return { ...newData, mutated: true };
//         }
//       );
//       return { previousComments };
//     },
//     onSuccess: () => {
//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: (_, __, context) => {
//       queryClient.setQueryData(queryKey, context?.previousComments);
//       showToast({
//         state: "error",
//         title: "Failed to mark comment as read ",
//       });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//     },
//   });
// };

// export const useDeleteReviewComment = (id: string) => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();

//   const broadcast = useBroadcastEvent();

//   const shareCommentQueryKey = useShareCommentsQueryKey();

//   return useMutation({
//     mutationFn: async () => {
//       const response = await api.delete(`/api/v1/review_comments/${id}/`);
//       const data = response.data; // Access the 'data' property of the AxiosResponse object

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//       queryClient.invalidateQueries({
//         queryKey: shareCommentQueryKey,
//       });
//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: () => {
//       showToast({
//         state: "error",
//         title: "Failed to delete a comment",
//       });
//     },
//   });
// };

// // Reply
// export const useAddReviewCommentReply = (id: string) => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();
//   const broadcast = useBroadcastEvent();

//   return useMutation({
//     mutationFn: async (payload: CreateAddReviewCommentReplyRequest) => {
//       const data = await api.post<CreateAddReviewCommentReplyResponse>(
//         `/api/v1/review_comments/${id}/add_reply/`,
//         payload
//       );

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: () => {
//       showToast({
//         state: "error",
//         title: "Failed to add a new reply",
//       });
//     },
//   });
// };

// export const useDeleteReviewCommentReply = (id: string) => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();
//   const shareCommentQueryKey = useShareCommentsQueryKey();
//   const broadcast = useBroadcastEvent();

//   return useMutation({
//     mutationFn: async () => {
//       const response = await api.delete(`/api/v1/comment_replies/${id}/`);
//       const data = response.data; // Access the 'data' property of the AxiosResponse object

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//       queryClient.invalidateQueries({
//         queryKey: shareCommentQueryKey,
//       });
//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: () => {
//       showToast({
//         state: "error",
//         title: "Failed to delete reply",
//       });
//     },
//   });
// };

// export const useUpdateReviewCommentReply = (id: string) => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const queryKey = useReviewCommentsQueryKey();

//   const broadcast = useBroadcastEvent();

//   return useMutation({
//     mutationFn: async (payload: CreateAddReviewCommentReplyRequest) => {
//       const data = await api.patch<CreateAddReviewCommentReplyResponse>(
//         `/api/v1/comment_replies/${id}/`,
//         payload
//       );

//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey,
//       });
//       broadcast({
//         type: "COMMENTS_UPDATED",
//       });
//     },
//     onError: () => {
//       showToast({
//         state: "error",
//         title: "Failed to update reply",
//       });
//     },
//   });
// };

// export const useUpdateReviewCommentsAsRead = () => {
//   const api = useApi();
//   const queryClient = useQueryClient();
//   const {
//     appliedFilters: { unread },
//   } = useComments();
//   const queryKey = useReviewCommentsQueryKey();

//   return useMutation({
//     mutationFn: async (payload: string[]) => {
//       const data = await api.post("/api/v1/review_comments/mark_as_read/", {
//         comment_ids: payload,
//       });

//       return data;
//     },
//     onSuccess: () => {
//       if (unread) {
//         // If user is viewing unread comments, don't invalidate
//         queryClient.invalidateQueries({
//           queryKey,
//         });
//       }
//     },
//     // This mutation does not need a invalidate here on purpose.
//     // We invalidate it on a condition where it is called.
//   });
// };

// interface useDownloadReviewCommentsParams {
//   fileId: string;
//   fileName: string;
//   shouldDownloadFiltered?: boolean;
//   type: CommentDownloadFileType;
//   fileExtension: CommentDownloadFileExtension;
// }

// export const useDownloadReviewComments = () => {
//   const api = useApi();
//   // const { fileId, fileName, appliedSort, appliedFilters } = useComments();
//   const { appliedFilters, appliedSort } = useReviewStore();

//   return useMutation({
//     mutationFn: async ({
//       fileId,
//       fileName,
//       shouldDownloadFiltered = false,
//       type,
//       fileExtension,
//     }: useDownloadReviewCommentsParams) => {
//       // NOTE: Search does not affect downloaded reviews. Only the applied fiters
//       const urlParams = createUrlParams({
//         file_id: fileId,
//         file_type: type,
//         ...(shouldDownloadFiltered && {
//           sort_by: appliedSort,
//           has_attachments: appliedFilters.attachments,
//           marked_as_done: appliedFilters.markedDone,
//           created_by: appliedFilters.commenter,
//           tag: appliedFilters.tags,
//           mentioned_user: appliedFilters.mentions,
//           unread_by_user: appliedFilters.unread,
//         }),
//       });
//       const response = await api.get(
//         `/api/v1/review_comments/download_review_comments/?${urlParams.toString()}`,
//         {
//           responseType: "blob",
//         }
//       );
//       FileDownload(
//         response.data,
//         `comments-${fileName ?? "file"}.${fileExtension}`
//       );
//     },
//   });
// };
