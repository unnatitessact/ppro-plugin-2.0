import { Controls, useMediaState } from '@vidstack/react';

import { BufferingIndicator } from '@/components/ui/video-player/VideoLayout';

import { useSearchStore } from '@/stores/search-store';

import { secondsToHoursMinutesSeconds } from '@/utils/videoUtils';

import * as Buttons from './VideoButtons';
import * as Sliders from './VideoSlider';

export const MinimalOutsideVideoControls = () => {
  const { selectedCommand } = useSearchStore();

  const currentTime = useMediaState('currentTime');
  const clipEndTime = useMediaState('clipEndTime');
  const clipStartTime = useMediaState('clipStartTime');
  const videoDuration = useMediaState('duration');
  const duration =
    selectedCommand?.key === 'search_for_clips' ||
    selectedCommand?.key === 'filtered_search_for_clips'
      ? clipEndTime - clipStartTime
      : videoDuration;

  return (
    <>
      <BufferingIndicator />
      <Controls.Root className="relative z-10 flex h-8 w-full items-center justify-between gap-2 rounded-bl-md rounded-br-md p-0 backdrop-blur-lg">
        <Controls.Group>
          <Buttons.Play size="sm" buttonSize={16} />
        </Controls.Group>
        <Controls.Group className="flex flex-1 items-center">
          <Sliders.Time controlsVariants="default" />
        </Controls.Group>
        <Controls.Group className="flex items-center gap-1 text-ds-videoplayer-text-primary">
          <div className="font-mono text-sm font-medium">
            {/* {currentTime} */}
            {secondsToHoursMinutesSeconds(currentTime)}{' '}
            <span className="text-ds-videoplayer-text-secondary">
              / {secondsToHoursMinutesSeconds(duration)}
            </span>
          </div>
        </Controls.Group>
      </Controls.Root>
    </>
  );
};
