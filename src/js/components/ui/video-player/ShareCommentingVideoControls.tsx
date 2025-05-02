import { useRef } from 'react';

import { usePlayerContext } from '@/context/player';
import { Controls } from '@vidstack/react';
import { createPortal } from 'react-dom';

import {
  ControlsBar,
  PlaybackRateOptionsDropdown
} from '@/components/ui/video-player/CommentingVideoControls';
import { TimeSelector } from '@/components/ui/video-player/TimeSelector';
import * as Buttons from '@/components/ui/video-player/VideoButtons';
import { BufferingIndicator, Gestures } from '@/components/ui/video-player/VideoLayout';
import { Time } from '@/components/ui/video-player/VideoSlider';

export const ShareCommentingVideoControls = ({ buttonSize }: { buttonSize: number }) => {
  return (
    <>
      <Gestures />
      <BufferingIndicator />
      <Controls.Root className="relative z-10 flex h-full w-full flex-1 flex-col items-center justify-between rounded-bl-2xl rounded-br-2xl bg-ds-videoplayer-controls-bg px-4 pb-[18px] text-ds-text-primary">
        <Controls.Group className="flex h-full w-full items-center justify-start">
          <TimeCommenting />
        </Controls.Group>
        <div className="flex w-full">
          <Controls.Group className="flex h-full w-full flex-shrink-0 items-center justify-start gap-1">
            <ControlsBar buttonSize={buttonSize} />
          </Controls.Group>
          <Controls.Group className="flex w-full min-w-0 items-center justify-end gap-1">
            <PlaybackRateOptionsDropdown />
            <Buttons.Fullscreen buttonSize={buttonSize} />
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};

function TimeCommenting() {
  const {
    playerState: { timeSelection, setTimeSelection, timeSelectionPreview, setTimeSelectionPreview }
  } = usePlayerContext();
  const timeSelectionContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-10 w-full">
      <div
        className="absolute  left-0 top-[14px] z-20 flex h-0 w-full"
        ref={timeSelectionContainerRef}
      >
        {timeSelection &&
          timeSelectionContainerRef.current &&
          createPortal(
            // Render the time selector outside the player to avoid z-index issues
            <div
              className="z-100"
              style={{
                position: 'absolute',
                height: timeSelectionContainerRef.current?.clientHeight,
                width: timeSelectionContainerRef.current?.clientWidth,
                left: timeSelectionContainerRef.current?.getBoundingClientRect().left,
                top: timeSelectionContainerRef.current?.getBoundingClientRect().top
              }}
            >
              <TimeSelector timeSelection={timeSelection} setTimeSelection={setTimeSelection} />
            </div>,
            document.body
          )}
        {timeSelectionPreview &&
          timeSelectionContainerRef.current &&
          timeSelectionPreview?.startTime < timeSelectionPreview?.endTime &&
          createPortal(
            // Render the time selector outside the player to avoid z-index issues
            <div
              className="z-100"
              style={{
                position: 'absolute',
                height: timeSelectionContainerRef.current?.clientHeight,
                width: timeSelectionContainerRef.current?.clientWidth,
                left: timeSelectionContainerRef.current?.getBoundingClientRect().left,
                top: timeSelectionContainerRef.current?.getBoundingClientRect().top
              }}
            >
              <TimeSelector
                isDisabled
                timeSelection={timeSelectionPreview}
                setTimeSelection={setTimeSelectionPreview}
              />
            </div>,
            document.body
          )}
      </div>

      <Time
        showTallerTrack={!!timeSelection || !!timeSelectionPreview}
        controlsVariants="commenting"
      />
    </div>
  );
}
