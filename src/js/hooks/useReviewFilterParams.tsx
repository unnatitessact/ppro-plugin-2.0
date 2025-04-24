// 'use client';

// import { parseAsBoolean, parseAsString, useQueryStates } from 'nuqs';

// import { ReviewCommentSort } from '@/api-integration/types/review';

// export interface FilterParams {
//   attachments: boolean;
//   unread: boolean;
//   markedDone: boolean;
//   tags: string;
//   mentions: string;
//   commenter: string;
//   createdDate: string;
//   sort: ReviewCommentSort | '';
// }

// export function useReviewFilterParams() {
//   return useQueryStates({
//     attachments: parseAsBoolean.withDefault(false),
//     unread: parseAsBoolean.withDefault(false),
//     markedDone: parseAsBoolean.withDefault(false),
//     tags: parseAsString.withDefault(''),
//     mentions: parseAsString.withDefault(''),
//     commenter: parseAsString.withDefault(''),
//     createdDate: parseAsString.withDefault(''),
//     sort: parseAsString.withDefault('')
//   });
// }
