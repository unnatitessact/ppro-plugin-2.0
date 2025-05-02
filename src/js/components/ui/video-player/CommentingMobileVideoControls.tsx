import { Controls } from '@vidstack/react';

import {
  AspectRatioOptionsDropdown,
  ControlsBar
} from '@/components/ui/video-player/CommentingVideoControls';
import { BufferingIndicator, Gestures, Subtitles } from '@/components/ui/video-player/VideoLayout';

import * as Buttons from './VideoButtons';
import * as Sliders from './VideoSlider';

export const CommentingMobileVideoControls = ({ buttonSize }: { buttonSize: number }) => {
  return (
    <>
      <Gestures />
      <BufferingIndicator />
      <Subtitles />
      <Controls.Root className="absolute bottom-0 z-50 flex w-full  flex-col gap-2 bg-gradient-to-b from-transparent to-[rgba(9,9,9,0.6375)] p-2 pt-3 opacity-0 backdrop-blur-sm media-controls:opacity-100">
        <Controls.Group className="flex h-full w-full items-center justify-start">
          <Sliders.TimeCommenting controlsVariants="commenting-mobile" />
        </Controls.Group>
        <div className="flex w-full">
          <Controls.Group className="flex h-full w-full flex-shrink-0 items-center justify-start gap-1">
            <ControlsBar buttonSize={buttonSize} controlsVariants="commenting-mobile" />
          </Controls.Group>
          <Controls.Group className="flex w-full min-w-0 items-center justify-end gap-1">
            <AspectRatioOptionsDropdown controlsVariants="commenting-mobile" />
            <span className="dark">
              <Buttons.Fullscreen buttonSize={buttonSize} />
            </span>
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};

// background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(9, 9, 9, 0.6375) 100%);
