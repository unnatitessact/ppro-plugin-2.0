import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import { PaperPlaneTopRight } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { MentionData } from "@/components/ui/mentions/Mentions";

import { ReviewMentions } from "@/components/review/review-mentions/ReviewMentions";

// import { useAIEdit } from '@/api-integration/mutations/editor';
import { useAddReviewCommentReply } from "@/api-integration/mutations/review";

import { bringTextToNextLine, TESSACT_AI_USER } from "@/utils/reviewUtils";

interface ReplyInputProps {
  commentId: string;
  isOpen: boolean;
  reply: string;
  setReply: Dispatch<SetStateAction<string>>;
}

const ReplyInput = memo(
  ({ commentId, isOpen, reply, setReply }: ReplyInputProps) => {
    const [parsedReply, setParsedReply] = useState<string>("");
    const [mentions, setMentions] = useState<MentionData>({
      users: [],
      tags: [],
    });

    const { mutateAsync: addReviewCommentReply, isPending } =
      useAddReviewCommentReply(commentId);

    // const { mutateAsync: aiEdit } = useAIEdit();

    const submitReply = useCallback(async () => {
      if (isPending || !reply) return;
      const hasMentionedTessactAI = mentions.users.some(
        (user) => user.id === TESSACT_AI_USER.id
      );

      const { data } = await addReviewCommentReply(
        {
          text: reply,
          plain_text: parsedReply,
          mentions: mentions.users
            .filter((user) => user.id !== TESSACT_AI_USER.id)
            .map((user) => user.id),
          tags: mentions.tags.map((tag) => tag.id),
          is_ai_reply: hasMentionedTessactAI,
        },
        {
          onSuccess: () => {
            setReply("");
            setParsedReply("");
            setMentions({ users: [], tags: [] });
          },
        }
      );

      const parsedReplyForAIEdit = parsedReply.split("@Tessact AI")[1]?.trim();

      setReply("");
      setParsedReply("");
      setMentions({ users: [], tags: [] });

      if (hasMentionedTessactAI && parsedReplyForAIEdit) {
        // await aiEdit({
        //   query: parsedReplyForAIEdit,
        //   isComment: false,
        //   itemId: data.id
        // });
      }
    }, [
      isPending,
      reply,
      parsedReply,
      mentions,
      addReviewCommentReply,
      // aiEdit,
      setReply,
    ]);

    const handleFormSubmitAndNewLine = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitReply();
        } else if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault();
          bringTextToNextLine({
            text: reply,
            setText: setReply,
            inputElement: event.target as HTMLTextAreaElement,
          });
        }
      },
      [reply, submitReply]
    );

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [isOpen]);

    return isOpen ? (
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="ml-5 mt-2 grid grid-cols-[1fr,40px] items-center gap-1 rounded-2xl border border-default-200 bg-default-100 px-3 py-2">
          <ReviewMentions
            inputRef={inputRef}
            text={reply}
            setText={setReply}
            onPlainTextChange={setParsedReply}
            setMentionData={setMentions}
            handleKeyDown={handleFormSubmitAndNewLine}
            placeholder="Reply to thread"
            autoFocus
          />
          <div className="flex items-center gap-1 self-end">
            <Button
              isLoading={isPending}
              size="sm"
              radius="md"
              color="primary"
              className="min-w-0"
              disabled={reply.length === 0 || isPending}
              onPress={submitReply}
              aria-label="Submit reply"
            >
              <PaperPlaneTopRight size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    ) : null;
  }
);

ReplyInput.displayName = "ReplyInput";

export default ReplyInput;
