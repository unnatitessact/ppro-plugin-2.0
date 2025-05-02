import { Dispatch, Key, RefObject, SetStateAction, useState } from "react";

// import { useAuth } from '@/context/auth';
import useAuth from "@/hooks/useAuth";
import { Spinner, useDisclosure } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";

import { ArrowShareLeft, SparklesThree } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Listbox, ListboxItem, ListboxSection } from "@/components/ui/Listbox";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";

import CommentHeader from "@/components/review/comments/CommentHeader";

// import { useAIEdit } from '@/hooks/useAIEdit';

import { useDeleteReviewCommentReply } from "@/api-integration/mutations/review";
import { Reply as IReply } from "@/api-integration/types/review";

// import { useReviewStore } from '@/stores/review-store';

import { getCommentCreator } from "@/utils/reviewUtils";

import CommentBody from "./CommentBody";

interface ReplyComponentProps {
  reply: IReply;
  lastReplyRef: RefObject<HTMLDivElement>;
  isLastReply: boolean;
  setIsReplyInputOpen: Dispatch<SetStateAction<boolean>>;
  commentId: string;
}

const Reply = ({
  reply,
  lastReplyRef,
  isLastReply,
  setIsReplyInputOpen,
  commentId,
}: ReplyComponentProps) => {
  const { isOpen: isDeleteReplyOpen, onOpenChange: onDeleteReplyOpenChange } =
    useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState<
    "threedot" | "rightclick" | false
  >(false);
  const [isEditing, setIsEditing] = useState(false);

  const { auth } = useAuth();
  // const isSelfComment = reply.external_user ? false : session.data?.user.id === reply.user.id;

  const creator = getCommentCreator(reply.created_by, reply.external_user);
  const isTessactAIComment = reply.created_by?.email === "ai@tessact.com";

  const isSelfComment = auth?.user
    ? reply.external_user && auth?.user?.email
      ? auth?.user?.email === reply.external_user?.email
      : reply.created_by && auth?.user?.id === reply.created_by?.id
    : false;

  const { mutate: deleteReviewCommentReply, isPending: isDeletePending } =
    useDeleteReviewCommentReply(reply.id);

  const commentActions = [
    {
      id: "reply",
      Icon: <ArrowShareLeft size={16} />,
      onPress: () => setIsReplyInputOpen((prev) => !prev),
      content: "Reply",
    },
  ];

  const handleAction = (action: Key) => {
    switch (action) {
      case "edit":
        setIsEditing(true);
        setIsMenuOpen(false);
        break;
      case "delete":
        onDeleteReplyOpenChange();
        break;
    }
  };

  // const { addToTimeline } = useAIEdit();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="flex flex-col"
      ref={isLastReply ? lastReplyRef : null}
    >
      <ContextMenu.Root
        onOpenChange={(open) => {
          if (open) {
            setIsMenuOpen("rightclick");
          } else {
            setIsMenuOpen(false);
          }
        }}
      >
        <ContextMenu.Trigger
          onContextMenu={(e) =>
            (isEditing || !isTessactAIComment || !isSelfComment) &&
            e.preventDefault()
          }
        >
          <div className="relative grid grid-cols-[26px,1fr]">
            <div className="absolute left-3 h-6 w-5 rounded-bl-lg  border-b-2 border-l-2 border-default-200" />

            <div />
            <div className="flex flex-col">
              <CommentHeader
                showDeleteConfirmation={onDeleteReplyOpenChange}
                type="reply"
                createdBy={creator}
                createdOn={reply.created_on}
                commentActions={commentActions}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                isSelfComment={isSelfComment}
                isTessactAIComment={isTessactAIComment}
                isExternalComment={
                  reply.is_external &&
                  reply.external_user?.user_type === "external"
                }
                isGuestComment={
                  reply.is_external &&
                  reply.external_user?.user_type === "guest"
                }
                isTaskShareComment={
                  reply.is_external &&
                  reply.external_user?.user_type === "task_share"
                }
              />
              <CommentBody
                content={reply.text}
                isReply
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                tags={reply.tags ?? []}
                mentions={reply.mentions ?? []}
                timeIn={null}
                timeOut={null}
                commentId={commentId}
                replyId={reply.id}
              />
              {reply.is_ai_reply && reply.ai_editor?.timeline_data === null && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-ds-button-default-bg p-3 text-ds-pills-tags-text">
                  <Spinner classNames={{ wrapper: "w-4 h-4" }} />
                  <p className="text-sm">Generating AI edits...</p>
                </div>
              )}
              {reply.is_ai_reply && reply.ai_editor?.timeline_data !== null && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-ds-button-default-bg px-3 py-2 text-ds-pills-tags-text">
                  <div className="flex items-center gap-2">
                    <SparklesThree size={16} />
                    <p className="text-sm">AI edit generated</p>
                  </div>
                  <Button
                    color="primary"
                    onPress={() => {
                      if (reply.ai_editor?.timeline_data) {
                        // addToTimeline(reply.ai_editor.timeline_data);
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
              onAction={handleAction}
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

      <ConfirmationModal
        isOpen={isDeleteReplyOpen}
        onOpenChange={onDeleteReplyOpenChange}
        subtitle={`Do you really want to delete this reply? This will permanently remove this for all other users too.`}
        title="Remove reply"
        confirmText="Yes, Delete"
        confirmButtonColor="danger"
        confirmAction={() => {
          deleteReviewCommentReply();
        }}
        isLoading={isDeletePending}
      />
    </motion.div>
  );
};

export default Reply;
