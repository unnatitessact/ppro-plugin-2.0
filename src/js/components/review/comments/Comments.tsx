import { UIEvent, useCallback, useEffect, useRef, useState } from "react";

import { useComments } from "@/context/comments";
import { usePlayerContext } from "@/context/player";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { MentionData } from "@/components/ui/mentions/Mentions";

import AddComment from "@/components/review/add-comment/AddComment";
import Comment from "./Comment";
import CommentsEmptyState from "./CommentEmptyState";
import CommentSkeleton from "./CommentSkeleton";

// import { useAIEdit } from "@/api-integration/mutations/editor";
import { useAddReviewComment } from "@/api-integration/mutations/review";
import { ReviewComment } from "@/api-integration/types/review";

import { useReviewStore } from "@/stores/review-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { TESSACT_AI_USER } from "@/utils/reviewUtils";

const Comments = ({
  fileId,
  comments,
  isLoadingComments,
  hasNextPage,
  fetchNextPage,
}: {
  fileId: string;
  comments: ReviewComment[];
  isLoadingComments: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    drawnShapes,
    setDrawnShapes,
    shouldPlayAfterCommenting,
    setShouldPlayAfterCommenting,
    commentToAutoscrollTo,
    setCommentToAutoscrollTo,
    clearState,
  } = useReviewStore();

  const {
    player,
    playerState: { timeSelection, resetTimeSelectionStates },
  } = usePlayerContext();

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);
  const { ref: inputContainerRef, height } = useElementSize();

  const [value, setValue] = useState<string>("");
  const [parsedValue, setParsedValue] = useState<string>("");
  const [mentions, setMentions] = useState<MentionData>({
    users: [],
    tags: [],
  });

  const {
    mutateAsync: addReviewComment,
    isPending: isPendingAddReviewComment,
  } = useAddReviewComment();

  //   const { mutateAsync: aiEdit, isPending: isPendingAIEdit } = useAIEdit();

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    // Handle autoscrolling to newly added comment
    if (!commentToAutoscrollTo || !virtuosoRef?.current) return;

    const index = comments.findIndex(
      (comment) => comment.id === commentToAutoscrollTo
    );

    if (index !== -1) {
      virtuosoRef.current.scrollToIndex({
        index,
        behavior: "smooth",
        align: "start",
      });
    }

    setCommentToAutoscrollTo(null);
  }, [commentToAutoscrollTo, comments, setCommentToAutoscrollTo]);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      resetTimeSelectionStates();
      clearState();
    };
  }, [resetTimeSelectionStates, clearState]);

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col",
        comments.length === 0 &&
          !isLoadingComments &&
          "items-center justify-center"
      )}
    >
      {!isLoadingComments ? (
        comments && comments?.length > 0 ? (
          <Virtuoso
            ref={virtuosoRef}
            onScroll={handleScroll}
            style={{
              height: "100%",
              gap: "1rem",
            }}
            className={cn(
              "border-t border-transparent",
              scrolled && "border-default-200"
            )}
            data={comments}
            endReached={loadMore}
            increaseViewportBy={1000}
            itemContent={(index, comment) => (
              <Comment key={comment.id} comment={comment} />
            )}
            components={{
              TopItemList: ({ children }) => (
                <CommentTopScroller>{children}</CommentTopScroller>
              ),
              Footer: () => (
                <div
                  style={{
                    paddingBottom: isMobile
                      ? `${height + 64}px`
                      : `${height + 4}px`,
                  }}
                >
                  {hasNextPage && <CommentSkeleton />}
                </div>
              ),
            }}
          />
        ) : (
          <>
            <CommentsEmptyState />
          </>
        )
      ) : (
        <div className="flex h-full w-full flex-col gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      )}

      <div
        className="absolute bottom-2 left-1/2 z-100 w-[calc(100%-1.5rem)] -translate-x-1/2"
        ref={inputContainerRef}
      >
        <AddComment
          value={value}
          onValueChange={setValue}
          onParsedValueChange={setParsedValue}
          onMentionsChange={setMentions}
          isPending={isPendingAddReviewComment}
          onSubmit={async () => {
            const hasMentionedTessactAI = mentions.users.some(
              (user) => user.id === TESSACT_AI_USER.id
            );

            const { data } = await addReviewComment(
              {
                file_id: fileId,
                text: value,
                plain_text: parsedValue,
                mentions: mentions.users
                  .filter((user) => user.id !== TESSACT_AI_USER.id)
                  .map((user) => user.id),
                tags: mentions.tags.map((tag) => tag.display),
                in_time: timeSelection?.startTime ?? undefined,
                out_time: timeSelection?.endTime ?? undefined,
                markers: drawnShapes.map((shape) => ({
                  color: shape.color,
                  shape: shape.shape,
                  data: shape,
                })),
                is_ai_comment: hasMentionedTessactAI,
              },
              {
                onSuccess: () => {
                  setValue("");
                  setMentions({
                    users: [],
                    tags: [],
                  });
                  resetTimeSelectionStates();
                  setDrawnShapes([]);
                  if (
                    player &&
                    shouldPlayAfterCommenting &&
                    player?.state?.paused
                  ) {
                    player?.play();
                  }
                  setShouldPlayAfterCommenting(false);
                },
              }
            );

            // if (hasMentionedTessactAI) {
            //   await aiEdit({
            //     query: parsedValue.split("@Tessact AI")[1].trim(),
            //     isComment: true,
            //     itemId: data.id,
            //   });
            // }
          }}
        />
      </div>
    </div>
  );
};

export default Comments;

export const CommentTopScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // scrolls itself into view if appliedSort changes
  const { appliedSort } = useComments();
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [appliedSort]);
  return <div ref={divRef}>{children}</div>;
};
