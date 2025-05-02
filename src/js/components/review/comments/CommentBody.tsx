import React, { useEffect, useRef, useState } from "react";

import { cn } from "@nextui-org/react";

import { PaperPlaneTopRight } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { MentionData } from "@/components/ui/mentions/Mentions";
import {
  AvatarCommentPill,
  MarkerCommentPill,
  TagCommentPill,
  TimerangeCommentPill,
  TimestampCommentPill,
} from "@/components/pill/TagsPill";

import AddCommentButtons from "@/components/review/add-comment/AddCommentButtons";
import { ReviewMentions } from "@/components/review/review-mentions/ReviewMentions";

import {
  useUpdateReviewComment,
  useUpdateReviewCommentReply,
} from "@/api-integration/mutations/review";
import { User } from "@/api-integration/types/auth";
import { Tag } from "@/api-integration/types/review";

import { useReviewStore } from "@/stores/review-store";

import { bringTextToNextLine } from "@/utils/reviewUtils";

type CommentBodyProps = {
  content: string;
  isReply?: boolean;
  isEditing: boolean;
  tags: Tag[];
  mentions: User[];
  setIsEditing: (isEditing: boolean) => void;
  timeIn?: number | null;
  timeOut?: number | null;
  replyId?: string | null;
  commentId: string | null;
  areMarkersPresent?: boolean;
  isScrolling?: boolean;
  handleCommentClick?: () => void;
};

const CommentBody = ({
  content,
  isReply,
  isEditing,
  setIsEditing,
  mentions,
  tags,
  timeIn,
  timeOut,
  replyId,
  commentId,
  areMarkersPresent,
  isScrolling = false,
  handleCommentClick,
}: CommentBodyProps) => {
  const mentionsInputRef = useRef<HTMLInputElement>(null);

  const [comment, setComment] = useState(content);
  const [commentPlainText, setCommentPlainText] = useState("");
  const [mentionData, setMentionData] = useState<MentionData>({
    users: mentions.map((user) => ({
      id: user.id,
      display: user?.profile?.display_name ?? user.email,
    })),
    tags: tags.map((tag) => ({
      id: tag.name,
      display: tag?.name ?? "",
    })),
  });

  const { setDrawnShapes, selectedComment } = useReviewStore();

  const { mutate: updateReviewComment, isPending: isPendingCommentUpdate } =
    useUpdateReviewComment(commentId ?? "");
  const { mutate: updateReviewCommentReply, isPending: isPendingReplyUpdate } =
    useUpdateReviewCommentReply(replyId ?? "");

  // edit comment
  const handleCommentEdit = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!comment) return;

      submitCommentEdit();
      setDrawnShapes([]);
    } else if (event.key === "Enter" && event.shiftKey) {
      // Insert a new line

      bringTextToNextLine({
        text: comment,
        setText: setComment,
        inputElement: event.target as HTMLTextAreaElement,
      });

      event.preventDefault();
    }
  };

  const submitCommentEdit = () => {
    updateReviewComment(
      {
        plain_text: commentPlainText,
        text: comment,
        mentions: mentionData.users.map((user) => user.id),
        tags: mentionData.tags.map((tag) => tag.id),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const submitReplyEdit = () => {
    updateReviewCommentReply(
      {
        text: comment,
        plain_text: commentPlainText,
        mentions: mentionData.users.map((user) => user.id),
        tags: mentionData.tags.map((tag) => tag.id),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // edit reply
  const handleReplyEdit = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!comment) return;

      submitReplyEdit();
    } else if (event.key === "Enter" && event.shiftKey) {
      // Insert a new line
      bringTextToNextLine({
        text: comment,
        setText: setComment,
        inputElement: event.target as HTMLTextAreaElement,
      });
      event.preventDefault();
    }
  };

  const showPills =
    timeIn !== null ||
    areMarkersPresent ||
    tags.length > 0 ||
    mentions.length > 0;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isEditing && mentionsInputRef.current) {
      timeout = setTimeout(() => {
        if (mentionsInputRef.current) {
          mentionsInputRef.current.focus();
          mentionsInputRef.current.setSelectionRange(10000, 10000);
        }
      }, 10); // timeout
    }

    // let timeout: NodeJS.Timeout;
    // console.log(isEditing, mentionsInputRef.current);
    // if (isEditing && mentionsInputRef.current) {
    //   console.log('setting');
    //   timeout = setTimeout(() => {
    //     if (mentionsInputRef.current) {
    //       console.log('focusing on input', mentionsInputRef.current);
    //       mentionsInputRef.current.focus();
    //     }
    //   }, 100);
    // }

    return () => {
      clearTimeout(timeout);
    };
  }, [isEditing]);

  useEffect(() => {
    // When data changes, update comment
    setComment(content);
  }, [content]);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl  bg-ds-comment-input-bg transition-colors",
        !isEditing &&
          !isReply &&
          timeIn !== null &&
          "group-hover:bg-ds-menu-bg-hover" // comment needs to be in view state; only timed comments are clickable
      )}
    >
      {selectedComment?.id === commentId && !isEditing && !isReply && (
        <div className="absolute left-2 top-1/2 h-[70%] rounded-sm border-1  border-primary-400 transition-all duration-300 ease-in-out -translate-y-1/2" />
      )}

      <div className={cn("flex p-2 px-3")}>
        <div className="flex min-h-8 w-full flex-1 items-center">
          {!isScrolling ? (
            <ReviewMentions
              inputRef={mentionsInputRef}
              text={comment}
              setText={setComment}
              setMentionData={setMentionData}
              onPlainTextChange={setCommentPlainText}
              disabled={!isEditing}
              handleKeyDown={isReply ? handleReplyEdit : handleCommentEdit}
              handleClick={handleCommentClick}
              placeholder="Add a comment, #tags & @mentions…"
            />
          ) : (
            <div>{comment}</div>
          )}
        </div>

        {isReply && isEditing && (
          <Button
            size="sm"
            radius="md"
            color="primary"
            className="self-end"
            isDisabled={!comment || isPendingReplyUpdate} // disable button if comment is empty or pending
            isLoading={isPendingReplyUpdate}
            onPress={submitReplyEdit}
            isIconOnly
            aria-label="Submit reply"
          >
            <PaperPlaneTopRight size={16} />
          </Button>
        )}
      </div>

      {!isReply ? (
        <>
          {isEditing ? (
            <>
              <AddCommentButtons
                isComment={true}
                timeIn={timeIn}
                timeOut={timeOut}
                disabled={!comment || isPendingCommentUpdate}
                addComment={submitCommentEdit}
                isLoading={isPendingCommentUpdate}
                onValueChange={setComment}
              />
            </>
          ) : showPills ? (
            <div className="flex flex-wrap gap-2 p-3 pt-0">
              {timeIn !== null && timeOut !== null ? (
                <TimerangeCommentPill
                  startTime={timeIn ?? 0}
                  endTime={timeOut ?? 0}
                />
              ) : null}

              {timeIn !== null && timeOut === null ? (
                <TimestampCommentPill timestamp={timeIn ?? 0} />
              ) : null}

              {areMarkersPresent ? <MarkerCommentPill /> : null}

              {mentions?.map((user) => {
                return (
                  <AvatarCommentPill
                    key={user.id}
                    displayName={user.profile.display_name}
                    src={user.profile.profile_picture}
                    color={user.profile.color}
                    firstName={user.profile.first_name}
                    lastName={user.profile.last_name}
                    email={user.email}
                  />
                );
              })}

              {tags?.map((tag) => {
                return <TagCommentPill key={tag.id} tag={tag.name} />;
              })}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default CommentBody;
