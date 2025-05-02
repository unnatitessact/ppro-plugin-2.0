import { usePlayerContext } from '@/context/player';
import { cn } from '@nextui-org/react';
import { Captions, Controls, useMediaState } from '@vidstack/react';

import { Divider } from '@/components/ui/Divider';
import { PlaybackRateOptionsDropdown } from '@/components/ui/video-player/CommentingVideoControls';
import { BufferingIndicator, Gestures } from '@/components/ui/video-player/VideoLayout';

import * as Buttons from './VideoButtons';
import * as Sliders from './VideoSlider';

export const TaggingVideoControls = ({ buttonSize = 20 }: { buttonSize?: number }) => {
  const {
    playerState: { fps }
  } = usePlayerContext();
  const currentTime = useMediaState('currentTime'),
    duration = useMediaState('duration'),
    isFullScreen = useMediaState('fullscreen');
  return (
    <>
      <Gestures />
      <BufferingIndicator />
      <Captions
        className={`absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300 media-captions:opacity-100 media-controls:bottom-[85px] media-preview:opacity-0`}
      />
      <Controls.Root
        className={cn(
          'relative z-10  flex w-full flex-col items-center justify-center rounded-bl-2xl rounded-br-2xl p-2',
          isFullScreen ? 'text-white' : 'text-ds-videoplayer-text-primary'
        )}
      >
        <Controls.Group className="flex h-full w-full items-center justify-start">
          <Sliders.Time controlsVariants="commenting" />
        </Controls.Group>
        <div className=" grid w-full grid-cols-3">
          <Controls.Group className="col-span-1 flex h-full w-full items-center gap-1">
            <div className="font-medium">
              {Math.floor(currentTime * fps)}
              <span className="text-ds-videoplayer-text-secondary">
                /{Math.floor(duration * fps)}
              </span>
            </div>
            <Divider orientation="vertical" className="h-3" />
            <Buttons.Mute buttonSize={buttonSize} />
            <Sliders.Volume />
          </Controls.Group>
          <Controls.Group className="col-span-1 flex  h-full w-full items-center justify-center gap-2 ">
            <Buttons.SeekBackward buttonSize={buttonSize} />
            <Buttons.Play buttonSize={buttonSize} />
            <Buttons.SeekForward buttonSize={buttonSize} />
          </Controls.Group>
          <Controls.Group className="col-span-1 flex h-full w-full items-center justify-end">
            <PlaybackRateOptionsDropdown />
            <Buttons.Fullscreen buttonSize={buttonSize} />
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};
