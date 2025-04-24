// "use client";

// import React, { useMemo } from "react";

// import { useComments } from "../../context/comments";
// // import { useComments } from '@/context/comments';
// import { useMediaQuery } from "@mantine/hooks";
// import { AnimatePresence } from "framer-motion";

// import { MagnifyingGlass } from "@tessact/icons";

// // import { Button } from "../../ui/Button";

// import { Button } from "../ui/Button";

// import Comments from "../review/comments/Comments";
// import CommentsSearchbar from "../review/CommentsSearchbar";
// import ReviewFilterDropdown from "../review/ReviewFilterDropdown/ReviewFilterDropdown";
// import SortDropdown from "../review/sort-dropdown/SortDropdown";

// import { useReviewCommentsQuery } from "../../api-integration/queries/review";

// import { MOBILE_MEDIA_QUERY } from "../../utils/responsiveUtils";

// const CommentPanel = () => {
//   const { fileId, isSearchOpen, toggleIsSearchOpen } = useComments();

//   const {
//     data: commentsPaginated,
//     isLoading: isLoadingComments,
//     hasNextPage,
//     fetchNextPage,
//   } = useReviewCommentsQuery();

//   const comments = useMemo(
//     () => commentsPaginated?.pages.flatMap((page) => page.results) ?? [],
//     [commentsPaginated]
//   );

//   const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

//   return (
//     <div className="flex h-full w-full flex-col overflow-hidden">
//       {!isMobile && (
//         <div className="flex flex-col gap-2 px-3 pb-4">
//           <div className="flex justify-between gap-2">
//             <SortDropdown />
//             <div className="flex gap-2">
//               <Button
//                 color="secondary"
//                 isIconOnly
//                 onPress={toggleIsSearchOpen}
//                 aria-label="Search comments"
//               >
//                 <MagnifyingGlass size={20} />
//               </Button>

//               <ReviewFilterDropdown />
//             </div>
//           </div>
//           <AnimatePresence>
//             {isSearchOpen && <CommentsSearchbar />}
//           </AnimatePresence>
//           {/* <TypingIndicator /> */}
//         </div>
//       )}
//       <Comments
//         fileId={fileId}
//         comments={comments}
//         isLoadingComments={isLoadingComments}
//         {...{ hasNextPage, fetchNextPage }}
//       />
//     </div>
//   );
// };

// export default CommentPanel;
