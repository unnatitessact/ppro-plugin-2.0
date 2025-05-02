import React, { useCallback, useEffect, useMemo, useRef } from "react";

// import { useAuth } from '@/context/auth';
import useAuth from "@/hooks/useAuth";
import { useComments } from "@/context/comments";
import { useClickOutside, useInViewport, useMergedRef } from "@mantine/hooks";
import { cn, Spinner, useDisclosure } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { AnimatePresence } from "framer-motion";

import {
  ArrowShareLeft,
  CircleCheck,
  CircleCheckFilled,
  SparklesThree,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Listbox, ListboxItem, ListboxSection } from "@/components/ui/Listbox";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";

import CommentBody from "./CommentBody";
import CommentHeader from "./CommentHeader";
import Reply from "./Reply";
import ReplyInput from "./ReplyInput";

// import { useAIEdit } from "@/hooks/useAIEdit";

import {
  useDeleteReviewComment,
  useMarkReviewCommentDone,
} from "@/api-integration/mutations/review";
import { ReviewComment } from "@/api-integration/types/review";

import { useReviewStore } from "@/stores/review-store";

import { getCommentCreator } from "@/utils/reviewUtils";

export const CommentLiteScrollPlaceholder = ({
  comment,
}: {
  comment: ReviewComment;
}) => {
  const creator = getCommentCreator(comment.created_by, comment.external_user);
  return (
    <div className="flex flex-col">
      <CommentHeader
        isEditing={false}
        setIsEditing={() => {}}
        createdBy={creator}
        type="comment"
        commentActions={[]}
        isMenuOpen={false}
        isSelfComment={false}
        isTessactAIComment={false}
        setIsMenuOpen={() => {}}
        showDeleteConfirmation={() => {}}
        key={comment.id}
        isExternalComment={
          comment.is_external && comment.external_user?.user_type === "external"
        }
        isGuestComment={
          comment.is_external && comment.external_user?.user_type === "guest"
        }
        isTaskShareComment={
          comment.is_external &&
          comment.external_user?.user_type === "task_share"
        }
      />
      {/* Placeholder for the body */}
      <div className="relative flex h-28 flex-col rounded-2xl bg-ds-comment-input-bg" />
    </div>
  );
};

export const Comment: React.FC<{ comment: ReviewComment }> = ({ comment }) => {
  // const { session } = useAuth();

  const { auth } = useAuth();

  const user = auth?.user;

  const heightRef = useRef<HTMLDivElement>(null);
  const lastReplyHeightRef = useRef<HTMLDivElement>(null);
  const { ref: commentInViewRef, inViewport } = useInViewport();

  const [isReplyOpen, setIsReplyOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState<
    "threedot" | "rightclick" | false
  >(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [differenceHeight, setDifferenceHeight] = React.useState(0);

  const [reply, setReply] = React.useState<string>("");

  const { addCommentToBeMarkedAsRead } = useComments();

  const {
    isOpen: isDeleteCommentOpen,
    onOpen: onDeleteCommentOpen,
    onOpenChange: onDeleteCommentOpenChange,
  } = useDisclosure();

  const { setSelectedComment, selectedComment } = useReviewStore();
  const { mutate: deleteReviewComment } = useDeleteReviewComment(comment.id);
  // const { mutate: updateReviewComment } = useUpdateReviewComment(comment.id);
  const { mutate: markReviewCommentDone } = useMarkReviewCommentDone(
    comment.id
  );

  const commentActions = useMemo(
    () => [
      {
        id: "reply",
        Icon: <ArrowShareLeft size={16} />,
        onPress: () => setIsReplyOpen((prev) => !prev),
        content: "Reply",
      },
      {
        id: "check",
        Icon: comment.marked_as_done ? (
          <CircleCheckFilled size={16} />
        ) : (
          <CircleCheck size={16} />
        ),
        onPress: () => markReviewCommentDone(),
        // updateReviewComment({ file_id: assetId, marked_as_done: !comment.marked_as_done }),
        content: "Mark as done",
      },
    ],
    [comment.marked_as_done, markReviewCommentDone]
  );

  const commentClickOutsideRef = useClickOutside(() => {
    if (selectedComment) {
      setSelectedComment(null);
    }
    if (reply.length === 0) {
      setIsReplyOpen(false);
    }
  });
  // const replyClickOutsideRef = useClickOutside(
  //   () => {
  //     if (reply.length === 0) {
  //       setIsReplyOpen(false);
  //     }
  //   },
  //   undefined,
  //   []
  // );
  const commentRef = useMergedRef(commentInViewRef, commentClickOutsideRef);

  const handleAction = useCallback(
    (action: string) => {
      if (action === "edit") {
        setIsEditing(true);
        setIsMenuOpen(false);
      } else if (action === "delete") {
        console.log("delete");
        onDeleteCommentOpen();
      }
    },
    [onDeleteCommentOpen]
  );

  const handleCommentClick = () => {
    setSelectedComment(comment);
  };

  useEffect(() => {
    const updateDifferenceHeight = () => {
      setDifferenceHeight(
        (heightRef.current?.scrollHeight ?? 0) -
          (lastReplyHeightRef.current?.scrollHeight ?? 0)
      );
    };

    const resizeObserver = new ResizeObserver(updateDifferenceHeight);
    if (heightRef.current && lastReplyHeightRef.current) {
      resizeObserver.observe(heightRef.current);
      resizeObserver.observe(lastReplyHeightRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      setDifferenceHeight(0);
    };
  }, [comment.replies?.length]);

  useEffect(() => {
    if (!comment.is_read && inViewport) {
      addCommentToBeMarkedAsRead(comment.id);
    }
  }, [inViewport, comment.is_read, comment.id, addCommentToBeMarkedAsRead]);

  // const commentWrapperRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (commentToAutoscrollTo === comment.id) {
  //       commentWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
  //       setCommentToAutoscrollTo(null);
  //     }
  //   }, 0);
  //   return () => clearTimeout(timeout);
  // }, [commentToAutoscrollTo, comment?.id, setCommentToAutoscrollTo]);

  // const { addToTimeline } = useAIEdit();

  if (!comment) return null;

  const isSelfComment = comment?.created_by?.id === auth?.user?.id;
  const isTessactAIComment = comment?.created_by?.email === "ai@tessact.com";
  const isTimedComment = comment?.in_time !== null;

  const creator = getCommentCreator(comment.created_by, comment.external_user);
  return (
    // <div ref={commentWrapperRef}>
    <div
      ref={commentRef}
      key={comment.id}
      className="relative mb-6 flex flex-col px-3"
    >
      <div
        className={cn("group", isTimedComment && "cursor-pointer")}
        onClick={isTimedComment ? handleCommentClick : () => {}}
      >
        <ContextMenu.Root
          onOpenChange={(open) => setIsMenuOpen(open ? "rightclick" : false)}
        >
          <ContextMenu.Trigger
            onContextMenu={(e) =>
              (isEditing || !isSelfComment) && e.preventDefault()
            }
          >
            <div className="flex flex-col">
              <CommentHeader
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                createdBy={creator}
                commentActions={commentActions}
                type="comment"
                showDeleteConfirmation={onDeleteCommentOpenChange}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isSelfComment={isSelfComment}
                // externalUser={comment.is_external ? comment.external_user : null}
                createdOn={comment.created_on}
                isTessactAIComment={isTessactAIComment}
                isExternalComment={
                  comment.is_external &&
                  comment.external_user?.user_type === "external"
                }
                isGuestComment={
                  comment.is_external &&
                  comment.external_user?.user_type === "guest"
                }
                isTaskShareComment={
                  comment.is_external &&
                  comment.external_user?.user_type === "task_share"
                }
              />

              <div className="relative">
                <CommentBody
                  content={comment.text ?? ""}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  tags={comment.tags ?? []}
                  mentions={comment.mentions ?? []}
                  timeIn={comment.in_time}
                  timeOut={comment.out_time}
                  commentId={comment.id}
                  areMarkersPresent={
                    comment.markers && comment.markers.length > 0
                  }
                  handleCommentClick={
                    isTimedComment && !isEditing
                      ? () => handleCommentClick()
                      : undefined
                  }
                />
                <div
                  style={{
                    height: `${differenceHeight}px`,
                  }}
                  className="absolute left-3 h-20 border-l-2 border-default-200"
                />
                {comment.is_ai_comment && comment.ai_editor === null && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-ds-button-default-bg p-3 text-ds-pills-tags-text">
                    <Spinner classNames={{ wrapper: "w-4 h-4" }} />
                    <p className="text-sm">Generating AI edits...</p>
                  </div>
                )}
                {comment.is_ai_comment && comment.ai_editor !== null && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-ds-button-default-bg px-3 py-2 text-ds-pills-tags-text">
                    <div className="flex items-center gap-2">
                      <SparklesThree size={16} />
                      <p className="text-sm">AI edit generated</p>
                    </div>
                    <Button
                      color="primary"
                      onPress={() => {
                        if (comment.ai_editor) {
                          // addToTimeline(comment.ai_editor.timeline_data);
                        }
                      }}
                      size="sm"
                      aria-label="Apply edits"
                    >
                      Apply edits
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className="z-50 data-[state=open]:animate-custom-in">
              <Listbox
                onAction={(key) => handleAction(key.toString())}
                classNames={{
                  base: "border border-ds-menu-border bg-ds-menu-bg p-2 rounded-2xl shadow-md",
                }}
              >
                <ListboxSection>
                  <ListboxItem key="edit" as={ContextMenu.Item}>
                    Edit
                  </ListboxItem>
                  <ListboxItem key="delete" as={ContextMenu.Item}>
                    Delete
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>

      <div className="flex flex-col gap-2" ref={heightRef}>
        <AnimatePresence>
          {comment.replies?.map((reply, index) => (
            <Reply
              key={reply.id}
              reply={reply}
              // reply={{
              //   id: reply.id,
              //   content: reply.text,
              //   mentions: reply.mentions ?? [],
              //   tags: reply.tags ?? [],
              //   user: reply.created_by,
              //   createdOn: reply.created_on,
              //   external_user: reply.external_user,
              //   isAIReply: reply.is_ai_reply,
              //   timelineData: reply.ai_editor?.timeline_data ?? null
              // }}
              isLastReply={index === comment.replies!.length - 1}
              lastReplyRef={lastReplyHeightRef}
              setIsReplyInputOpen={setIsReplyOpen}
              commentId={comment.id}
            />
          ))}
        </AnimatePresence>
      </div>

      <ConfirmationModal
        isOpen={isDeleteCommentOpen}
        onOpenChange={onDeleteCommentOpenChange}
        subtitle={`Do you really want to delete ${
          comment?.created_by?.profile?.display_name ?? ""
        }'s Comment? This will permanently remove this for all other users too.`}
        title="Remove comment"
        confirmText="Yes, Delete"
        confirmButtonColor="danger"
        confirmAction={() => {
          deleteReviewComment();
          onDeleteCommentOpenChange();
        }}
        isLoading={false}
      />
      <AnimatePresence>
        <ReplyInput
          reply={reply}
          setReply={setReply}
          commentId={comment.id}
          isOpen={isReplyOpen}
        />
      </AnimatePresence>
    </div>
    // </div>
  );
};

export default React.memo(Comment);
