import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useComments } from '@/context/comments';
import { usePlayerContext } from '@/context/player';
import { useMediaQuery } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { useMediaRemote } from '@vidstack/react';

import { PaperPlaneTopRight, Writing } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { tagMentionMarkup } from '@/components/ui/mentions/Mentions';
import { Tooltip } from '@/components/ui/Tooltip';

import { TagsPopover } from '@/components/review/add-comment/TagsPopover';
import CommentTimeSelection from '@/components/review/time-selection/CommentTimeSelection';

import { useSearchActionsStore } from '@/stores/search-actions-store';

import { MOBILE_MEDIA_QUERY } from '@/utils/responsiveUtils';

import TimeSelection from '../time-selection/TimeSelection';

interface AddCommentButtonsProps {
  disabled?: boolean;
  isLoading: boolean;
  addComment: () => void;
  isComment: boolean;
  timeIn?: number | null;
  timeOut?: number | null;
  onValueChange: Dispatch<SetStateAction<string>>;
}

const AddCommentButtons = ({
  disabled,
  isLoading,
  addComment,
  isComment,
  timeIn,
  timeOut,
  onValueChange
}: AddCommentButtonsProps) => {
  const { isTimedAsset } = useComments();

  const {
    player,
    playerState: { timeSelection, setTimeSelection }
  } = usePlayerContext();

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    return player?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [player]);

  const remote = useMediaRemote(player);
  const { isMarkersVisible, setIsMarkersVisible } = useSearchActionsStore();

  const handleTagSelect = (name: string) => {
    const tagMarkup = tagMentionMarkup.replace('__id__', name);
    onValueChange((prev) => prev + ' ' + tagMarkup);
  };

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <div className={cn('flex gap-2 px-3 pb-3', isTimedAsset ? 'justify-between' : 'justify-end')}>
      {isTimedAsset && (
        <div>
          {isComment ? (
            <CommentTimeSelection timeIn={timeIn ?? null} timeOut={timeOut ?? null} />
          ) : (
            <>
              <TimeSelection />
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-[32px,32px,40px] items-center justify-end gap-1">
        {isTimedAsset && !isMobile ? (
          <Tooltip delay={500} closeDelay={0} content="Markers">
            <Button
              size="sm"
              variant="light"
              color={isMarkersVisible ? 'default' : undefined}
              aria-label="Markers"
              onPress={() => {
                remote.pause();
                if (!timeSelection) {
                  setTimeSelection({
                    startTime: currentTime ?? 0,
                    endTime: currentTime ?? 0
                  });
                }
                setIsMarkersVisible(!isMarkersVisible);
              }}
              isIconOnly
            >
              <Writing size={16} className="text-default-400" />
            </Button>
          </Tooltip>
        ) : (
          <div />
        )}
        <TagsPopover onSelect={handleTagSelect} />

        <Button
          size="sm"
          radius="md"
          color="primary"
          className="w-full"
          onPress={addComment}
          isIconOnly
          isDisabled={disabled}
          isLoading={isLoading}
          aria-label="Add comment"
        >
          <PaperPlaneTopRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AddCommentButtons;
