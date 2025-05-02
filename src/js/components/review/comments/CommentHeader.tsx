import React, { Key, useEffect, useState } from 'react';

import { DotGrid1X3Horizontal, Globus, Group3 } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { NextAvatar } from '@/components/ui/NextAvatar';
import { Tooltip } from '@/components/ui/Tooltip';

import { ReviewCommentCreator } from '@/api-integration/types/review';

import { formatDate } from '@/utils/dates';

interface CommentHeaderProps {
  createdBy: ReviewCommentCreator;
  commentActions: {
    id: string;
    Icon: React.ReactNode;
    onPress: () => void;
    content: string;
  }[];
  showDeleteConfirmation: (isOpen: boolean) => void;
  type?: 'comment' | 'reply';
  isMenuOpen: 'threedot' | 'rightclick' | false;
  setIsMenuOpen: (open: 'threedot' | 'rightclick' | false) => void;
  setIsEditing: (isEditing: boolean) => void;
  isEditing: boolean;
  isSelfComment: boolean;
  isTessactAIComment: boolean;
  createdOn?: string;
  isExternalComment?: boolean;
  isGuestComment?: boolean;
  isTaskShareComment?: boolean;
}

const CommentHeader = ({
  createdBy,
  createdOn,
  commentActions,
  type,
  showDeleteConfirmation,
  isMenuOpen,
  setIsMenuOpen,
  setIsEditing,
  isEditing,
  isSelfComment,
  isExternalComment,
  isGuestComment,
  isTaskShareComment
}: CommentHeaderProps) => {
  const onDropdownAction = (key: Key) => {
    switch (key) {
      case 'edit':
        setIsEditing(true);
        break;
      case `delete`:
        showDeleteConfirmation(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isEditing) {
      setIsMenuOpen(false);
    }
  }, [isEditing, setIsMenuOpen]);

  const [createdOnTimestamp, setCreatedOnTimestamp] = useState<string | undefined>(
    createdOn ? formatDate(createdOn) : undefined
  );

  // Automatically update createdOntimestamp every minute
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (createdOn) {
      interval = setInterval(() => {
        setCreatedOnTimestamp(formatDate(createdOn));
      }, 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [createdOn]);

  const isTessactAIComment = createdBy?.email === 'ai@tessact.com';

  return (
    <div className="flex min-h-12 items-center justify-between py-2 pl-1.5">
      <div className="flex min-w-0 items-center gap-2">
        <NextAvatar
          src={createdBy?.profile_picture ?? ''}
          alt={createdBy?.email ?? ''}
          userFallbackProps={{
            firstName: createdBy?.display_name ?? '',
            lastName: createdBy?.display_name ?? '',
            displayName: createdBy?.display_name ?? 'Unknown User',
            email: createdBy?.email ?? '',
            color: createdBy?.color ?? '',
            className: 'text-sm'
          }}
        />

        <div className="flex h-full w-full min-w-0 items-start gap-2">
          <div className="w-full min-w-0 flex-col">
            <div className="flex min-w-0 gap-2 truncate text-sm font-medium text-ds-comment-input-text">
              <Tooltip
                delay={500}
                isDisabled={!isExternalComment && !isGuestComment && !isTaskShareComment}
                showArrow
                placement="top"
                className="min-w-0"
                content={
                  <div className="flex w-full flex-col items-center justify-center text-center">
                    <div className="text-xs font-medium text-ds-tooltip-text">
                      {createdBy.display_name}
                    </div>
                    <div className="text-xs font-medium text-ds-text-secondary">
                      {createdBy.email}
                    </div>
                  </div>
                }
              >
                <div className="min-w-0 truncate">{createdBy.display_name ?? createdBy.email}</div>
              </Tooltip>
              <>
                {isExternalComment && (
                  <Tooltip
                    delay={500}
                    showArrow
                    content={
                      <p className="text-xs">
                        This is a comment via <br />
                        the public share link
                      </p>
                    }
                  >
                    <div className="flex items-center gap-0.5 p-0.5 text-ds-combination-amber-solid-bg">
                      <Globus size={14} />
                      <p className="text-xs font-medium">External</p>
                    </div>
                  </Tooltip>
                )}
                {isGuestComment && (
                  <Tooltip
                    delay={500}
                    showArrow
                    content={
                      <p className="text-xs">
                        This is a comment via <br />
                        the private share link
                      </p>
                    }
                  >
                    <div className="flex items-center gap-0.5 p-0.5 text-ds-combination-amber-solid-bg">
                      <Group3 size={14} />
                      <p className="text-xs font-medium">Guest</p>
                    </div>
                  </Tooltip>
                )}
                {isTaskShareComment && (
                  <Tooltip
                    delay={500}
                    showArrow
                    content={
                      <p className="text-xs">
                        This is a comment via <br />
                        the task share link
                      </p>
                    }
                  >
                    <div className="flex items-center gap-0.5 p-0.5 text-ds-combination-amber-solid-bg">
                      <Group3 size={14} />
                      <p className="text-xs font-medium">Guest</p>
                    </div>
                  </Tooltip>
                )}
              </>
            </div>
            {createdOnTimestamp && (
              <p className="font-base text-xs text-ds-text-secondary">{createdOnTimestamp}</p>
            )}
          </div>
        </div>
      </div>

      {/* comment actions */}

      {!isEditing && (
        <div className="flex flex-shrink-0 items-center gap-1">
          {(isSelfComment || isTessactAIComment) && (
            <Dropdown
              isOpen={isMenuOpen === 'threedot'}
              onOpenChange={(isOpen) => setIsMenuOpen(isOpen ? 'threedot' : false)}
              placement="bottom-end"
              classNames={{
                content: 'min-w-[auto]'
              }}
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-ds-pills-attachments-icon"
                  aria-label={`${type} actions`}
                >
                  <DotGrid1X3Horizontal size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => onDropdownAction(key)}
                aria-label={`${type} actions`}
              >
                <DropdownItem key={`edit`}>Edit</DropdownItem>
                <DropdownItem key={`delete`}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {commentActions.map(({ id, Icon, onPress, content }) => (
            <Tooltip delay={500} closeDelay={0} content={content} key={id}>
              <Button
                size="sm"
                className="text-ds-pills-attachments-icon"
                variant="light"
                onPress={onPress}
                isIconOnly
                aria-label={content}
              >
                {Icon}
              </Button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentHeader;
