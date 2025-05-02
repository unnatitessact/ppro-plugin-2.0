import { Dispatch, SetStateAction, useLayoutEffect, useMemo, useRef } from 'react';

import { TimeSelection, usePlayerContext } from '@/context/player';
import { cn } from '@nextui-org/react';
import { useMediaState } from '@vidstack/react';

import { Slider } from '@/components/ui/Slider';
import { ControlsVariants } from '@/components/ui/video-player/VideoPlayer';

import { renderValue } from '@/utils/videoUtils';

export const TimeSelector = ({
  timeSelection,
  setTimeSelection,
  isDisabled = false,
  height,
  controlsVariants
}: {
  timeSelection: TimeSelection | null;
  setTimeSelection: Dispatch<SetStateAction<TimeSelection | null>>;
  isDisabled?: boolean;
  height?: number;
  controlsVariants?: ControlsVariants;
}) => {
  const duration = useMediaState('duration');
  const {
    player,
    playerState: {
      // timeSelection,
      // setTimeSelection,
      timeFormat,
      fps,
      isDraggingTimeSelectionLeftHandle,
      isDraggingTimeSelectionRightHandle,
      setIsDraggingTimeSelectionLeftHandle,
      setIsDraggingTimeSelectionRightHandle,
      shouldSyncEndTimeWithCurrentTime,
      setShouldSyncEndTimeWithCurrentTime
    }
  } = usePlayerContext();

  const sliderRef = useRef<HTMLDivElement>(null);
  const fillerRef = useRef<HTMLDivElement>();
  // const leftThumbRef = useRef<HTMLDivElement>();
  // const rightThumbRef = useRef<HTMLDivElement>();

  const isDragging = useMemo(
    () => isDraggingTimeSelectionLeftHandle || isDraggingTimeSelectionRightHandle,
    [isDraggingTimeSelectionLeftHandle, isDraggingTimeSelectionRightHandle]
  );

  // Set the data-duration attribute on the filler element
  // On mount, we get the reference to the filler element
  // and store it in the fillerRef
  // This is used for passing content to ::after of filler element.
  useLayoutEffect(() => {
    if (timeSelection && sliderRef.current) {
      const duration = timeSelection.endTime - timeSelection.startTime;
      if (duration < 0) return;
      if (!fillerRef.current) {
        // This search only runs once every mount
        const filler = sliderRef.current.querySelector('div[data-slot="filler"]') as HTMLDivElement;
        if (filler) {
          fillerRef.current = filler;
        }
      }
      if (fillerRef.current) {
        // fillerRef?.current.setAttribute(
        //   'data-duration',
        //   `${renderValue(duration, timeFormat, fps)}`
        // );
        if ((isDragging || shouldSyncEndTimeWithCurrentTime) && duration > 0) {
          fillerRef?.current.setAttribute(
            'data-duration',
            `${renderValue(duration, timeFormat, fps)}`
          );
        } else {
          fillerRef?.current.setAttribute('data-duration', ``);
          // fillerRef?.current?.removeAttribute('data-duration');
        }
      }
    }
  }, [
    isDragging,
    timeSelection,
    timeSelection?.startTime,
    timeSelection?.endTime,
    shouldSyncEndTimeWithCurrentTime,
    fps,
    timeFormat
  ]);

  if (!timeSelection) return null;

  return (
    <Slider
      isDisabled={isDisabled}
      ref={sliderRef}
      maxValue={duration}
      minValue={0}
      step={1 / fps} // this is 1 divided by fps
      value={[timeSelection?.startTime, timeSelection?.endTime]}
      onChangeEnd={() => {
        setIsDraggingTimeSelectionLeftHandle(false);
        setIsDraggingTimeSelectionRightHandle(false);
      }}
      onChange={(values) => {
        const sliderValues = values as number[];
        setTimeSelection((prevValues) => {
          if (prevValues) {
            if (prevValues?.startTime !== sliderValues[0]) {
              // User has changed start time
              setIsDraggingTimeSelectionLeftHandle(true);
              player!.currentTime = sliderValues[0];
              player?.pause();
            }
            if (prevValues?.endTime !== sliderValues[1]) {
              // User has changed end time
              setIsDraggingTimeSelectionRightHandle(true);
              player!.currentTime = sliderValues[1];
              player?.pause();
            }
          }

          // user has performed a manual operation, so we stop syncing the end time with current time
          setShouldSyncEndTimeWithCurrentTime(false);
          return { startTime: sliderValues[0], endTime: sliderValues[1] };
        });
      }}
      data-duration={timeSelection.endTime - timeSelection.startTime}
      renderThumb={({ index, ...props }) => (
        <div
          {...props}
          className={cn(
            'group pointer-events-auto z-20 flex h-6 w-12 items-center justify-center gap-px -translate-y-4 after:absolute after:-bottom-[3px]  after:h-1 after:w-1  data-[dragging=true]:opacity-100',
            index === 0 ? '-translate-x-5 after:right-px' : 'translate-x-5 after:left-px',
            controlsVariants === 'commenting-mobile' && 'translate-x-0',
            // index === 0 && controlsVariants === 'commenting-mobile' && 'translate-x-0',
            index === 0 && timeSelection.startTime === 0
              ? timeSelection.startTime === timeSelection.endTime
                ? 'cursor-not-allowed'
                : 'cursor-e-resize'
              : timeSelection.startTime === timeSelection.endTime
                ? 'cursor-w-resize'
                : 'cursor-ew-resize',
            index === 1 && timeSelection.endTime === duration
              ? timeSelection.startTime === timeSelection.endTime
                ? 'cursor-not-allowed'
                : 'cursor-w-resize'
              : timeSelection.startTime === timeSelection.endTime
                ? 'cursor-e-resize'
                : 'cursor-ew-resize',
            isDisabled && 'hidden'
          )}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-px rounded-sm bg-white/40 transition-colors group-hover:bg-white"
            />
          ))}
        </div>
      )}
      classNames={{
        base: cn(controlsVariants === 'commenting-mobile' && '-translate-y-1.5'),
        trackWrapper: 'h-0',
        track: 'pointer-events-none h-0 border-none',
        filler: cn(
          ` pointer-events-none -translate-y-1 bg-ds-videoplayer-bg-selected/80 rounded-md rounded-tl-none rounded-tr-none after:z-20 after:-translate-y-6 after:absolute after:w-[calc(100%+4rem)] after:rounded-3xl z-10  after:bg-ds-videoplayer-bg-selected/80 min-w-px after:h-6 after:-translate-x-8 after:content-[attr(data-duration)] after:flex after:justify-center after:items-center after:text-xs after:font-medium after:text-white data-[dragging=true]:bg-red-500`,
          height ? `h-[${height}px]` : controlsVariants === 'commenting-mobile' ? 'h-1' : 'h-4'
        )
      }}
    />
  );
};
