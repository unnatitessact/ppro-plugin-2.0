import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useComments } from "@/context/comments";
import { usePlayerContext } from "@/context/player";
// import { useUpdateMyPresence } from "../../../../../liveblocks.config";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";

import { BubbleText6, CrossSmall } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { MentionData } from "@/components/ui/mentions/Mentions";

import AddCommentButtons from "@/components/review/add-comment/AddCommentButtons";
import { ReviewMentions } from "@/components/review/review-mentions/ReviewMentions";

import { useReviewStore } from "@/stores/review-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { bringTextToNextLine } from "@/utils/reviewUtils";

interface AddCommentProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
  onParsedValueChange: Dispatch<SetStateAction<string>>;
  onMentionsChange: Dispatch<SetStateAction<MentionData>>;
  onSubmit: () => void;
  isPending: boolean;
}

const AddComment = ({
  value,
  onValueChange,
  onMentionsChange,
  onParsedValueChange,
  onSubmit,
  isPending,
}: AddCommentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setDrawnShapes } = useReviewStore();

  const {
    setIsTimeInAndTimeOutSelectionEnabled,
    isTimeInAndTimeOutSelectionEnabled,
  } = useComments();

  const {
    player,
    playerState: { setTimeSelection, timeSelection },
  } = usePlayerContext();

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    return player?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [player]);

  // const updateMyPresence = useUpdateMyPresence();
  const {
    setIsMarkersVisible,
    isCommentInputFocused,
    setIsCommentInputFocusChange,
  } = useSearchActionsStore();

  // useEffect(() => {
  //   if (value.length > 0) {
  //     updateMyPresence({ isAddingReview: true });
  //   }
  //   const timeout = setTimeout(() => {
  //     updateMyPresence({ isAddingReview: false });
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [value, updateMyPresence]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!value) return;
      submitComment();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      // Insert a new line
      bringTextToNextLine({
        text: value,
        setText: onValueChange,
        inputElement: event.target as HTMLTextAreaElement,
      });
    }
  };

  const submitComment = () => {
    onSubmit();
    onValueChange("");
    setDrawnShapes([]);
    setIsMarkersVisible(false);
    setTimeSelection(null);
    setIsTimeInAndTimeOutSelectionEnabled(false);
    inputRef?.current?.blur();
  };

  useEffect(() => {
    // Focus input for "Add a comment" search command
    let timeout: NodeJS.Timeout;
    if (inputRef.current && isCommentInputFocused) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
        setIsCommentInputFocusChange(false);
      }, 10);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCommentInputFocused]);

  const autoCheckOnInputFocus = () => {
    if (!timeSelection && !isTimeInAndTimeOutSelectionEnabled) {
      player?.pause();
      setTimeSelection({
        startTime: currentTime,
        endTime: currentTime,
      });
      setIsTimeInAndTimeOutSelectionEnabled(true);
    }
  };

  return (
    // <div className="flex h-fit w-full flex-col justify-end rounded-2xl border border-ds-comment-input-border bg-ds-comment-input-bg">
    <AddCommentWrapper>
      <div className="flex w-full p-2 px-3 *:w-full">
        <ReviewMentions
          inputRef={inputRef}
          text={value}
          setText={onValueChange}
          onPlainTextChange={onParsedValueChange}
          setMentionData={onMentionsChange}
          disabled={false}
          handleKeyDown={handleKeyDown}
          placeholder="Add a comment, #tags & @mentions…"
          handleOnFocus={autoCheckOnInputFocus}
        />
      </div>

      <AddCommentButtons
        disabled={!value || isPending}
        isComment={false}
        isLoading={isPending}
        onValueChange={onValueChange}
        addComment={() => {
          if (!value) return;
          submitComment();
        }}
      />
    </AddCommentWrapper>
    // </div>
  );
};

export default AddComment;

export const AddCommentWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { ref, width } = useElementSize();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (!isMobile)
    return (
      <div className="flex h-fit w-full flex-col justify-end rounded-2xl border border-ds-comment-input-border bg-ds-comment-input-bg">
        {children}
      </div>
    );

  return (
    <div className="w-full" ref={ref}>
      <motion.div
        variants={{
          closed: {
            height: 48,
            width: 48,
          },
          open: {
            width,
            height: 88,
          },
        }}
        className={cn(
          "relative transition-colors",
          isOpen &&
            "flex h-fit w-full flex-col justify-end rounded-2xl border border-ds-comment-input-border bg-ds-comment-input-bg",
          !isOpen &&
            "flex items-center justify-center rounded-full border border-transparent bg-ds-button-primary-bg text-ds-button-primary-text disabled:text-ds-button-primary-text-disabled aria-expanded:bg-ds-button-primary-bg-hover data-[hover=true]:bg-ds-button-primary-bg-hover"
        )}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        onClick={() => (!isOpen ? setIsOpen(!isOpen) : {})}
      >
        {isOpen ? children : <BubbleText6 width={24} height={24} />}
        {isOpen && (
          <Button
            isIconOnly
            className="absolute -top-12 left-0 rounded-full"
            onPress={() => setIsOpen(false)}
          >
            <CrossSmall width={20} height={20} />
          </Button>
        )}
      </motion.div>
    </div>
  );
};
