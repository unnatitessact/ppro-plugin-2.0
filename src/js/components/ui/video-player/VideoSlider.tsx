import { useMemo, useRef } from "react";

import { usePlayerContext } from "@/context/player";
import {
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "../../../../../liveblocks.config";
import { ClientSideSuspense, useIsInsideRoom } from "@liveblocks/react";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import {
  TimeSlider,
  TimeSliderInstance,
  useMediaState,
  useStore,
  VolumeSlider,
} from "@vidstack/react";
import { createPortal } from "react-dom";

import { popoverClassNames } from "@/components/ui/Popover";
import { TimeSelector } from "@/components/ui/video-player/TimeSelector";

import CollaborativeAvatarGroup from "@/components/video/CollaborativeAvatarGroup";
// import CollaborativeAvatarGroup from "@/components/review/video/CollaborativeAvatarGroup";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { generateSprites } from "@/utils/timelineUtils";
import { renderValue } from "@/utils/videoUtils";

import { ControlsVariants } from "./VideoPlayer";

export function Volume({
  disableColorToggleOnThemeChange,
}: {
  disableColorToggleOnThemeChange?: boolean;
}) {
  const isFullScreen = useMediaState("fullscreen");
  const whiteColor = isFullScreen || disableColorToggleOnThemeChange;
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <VolumeSlider.Root
      className={cn(
        "volume-slider group relative inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden",
        isMobile && "h-8 max-w-[50px]"
      )}
    >
      <VolumeSlider.Track
        className={cn(
          "ring-media-focus relative z-0 h-[5px] w-full rounded-md group-data-[focus]:ring-[3px]",
          whiteColor ? "bg-white/30" : "bg-ds-videoplayer-text-primary/30"
        )}
      >
        <VolumeSlider.TrackFill
          className={cn(
            "absolute h-full w-[var(--slider-fill)] rounded-md  will-change-[width]",
            whiteColor ? "bg-white" : "bg-default-900"
          )}
        />
      </VolumeSlider.Track>
      <VolumeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-3 w-0.5 rounded-sm bg-ds-videoplayer-controls-commenting-slider-active opacity-100  will-change-[left] -translate-x-1/2 -translate-y-1/2 " />
    </VolumeSlider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
  controlsVariants?: ControlsVariants;
  showTallerTrack?: boolean;
  onClick?: () => void;
  isOverlay?: boolean;
}

export function TimeCommenting({
  controlsVariants = "default",
  ...props
}: TimeSliderProps) {
  const {
    playerState: {
      timeSelection,
      setTimeSelection,
      timeSelectionPreview,
      setTimeSelectionPreview,
    },
  } = usePlayerContext();
  const timeSelectionContainerRef = useRef<HTMLDivElement>(null);

  const isInsideRoom = useIsInsideRoom();

  return (
    <div
      className={cn(
        "relative flex h-10 w-full items-center justify-center",
        controlsVariants === "commenting-mobile" && "h-3"
      )}
    >
      <div
        className="pointer-events-none  absolute left-0 top-[14px] z-20 flex w-full"
        ref={timeSelectionContainerRef}
      >
        {timeSelection &&
          timeSelectionContainerRef.current &&
          createPortal(
            // Render the time selector outside the player to avoid z-index issues
            <div
              className="z-100"
              style={{
                position: "absolute",
                height: timeSelectionContainerRef.current?.clientHeight,
                width: timeSelectionContainerRef.current?.clientWidth,
                left: timeSelectionContainerRef.current?.getBoundingClientRect()
                  .left,
                top: timeSelectionContainerRef.current?.getBoundingClientRect()
                  .top,
              }}
            >
              <TimeSelector
                timeSelection={timeSelection}
                setTimeSelection={setTimeSelection}
                controlsVariants={controlsVariants}
              />
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
                position: "absolute",
                height: timeSelectionContainerRef.current?.clientHeight,
                width: timeSelectionContainerRef.current?.clientWidth,
                left: timeSelectionContainerRef.current?.getBoundingClientRect()
                  .left,
                top: timeSelectionContainerRef.current?.getBoundingClientRect()
                  .top,
              }}
            >
              <TimeSelector
                isDisabled
                timeSelection={timeSelectionPreview}
                setTimeSelection={setTimeSelectionPreview}
                controlsVariants={controlsVariants}
              />
            </div>,
            document.body
          )}

        {isInsideRoom && controlsVariants === "commenting" && (
          <ClientSideSuspense fallback={<></>}>
            {() => <CollaborativeSlider />}
          </ClientSideSuspense>
        )}
      </div>
      <ClientSideSuspense
        fallback={
          <Time
            controlsVariants={controlsVariants}
            showTallerTrack={!!timeSelection || !!timeSelectionPreview}
            {...props}
          />
        }
      >
        {isInsideRoom &&
          (() => (
            <TimeSliderWithLiveblocks
              controlsVariants={controlsVariants}
              showTallerTrack={!!timeSelection || !!timeSelectionPreview}
              {...props}
            />
          ))}
      </ClientSideSuspense>
    </div>
  );
}

const TimeSliderWithLiveblocks = (props: TimeSliderProps) => {
  const leaderId = useSelf((self) => self.presence.leaderId);
  const updateMyPresence = useUpdateMyPresence();
  const {
    playerState: { timeSelection, timeSelectionPreview },
  } = usePlayerContext();
  return (
    <Time
      controlsVariants={props.controlsVariants}
      showTallerTrack={
        !!timeSelection ||
        !!(!!timeSelectionPreview && timeSelectionPreview?.endTime)
      }
      onClick={() => {
        if (leaderId) {
          updateMyPresence({
            leaderId: null,
          });
        }
      }}
      {...props}
    />
  );
};

export const CollaborativeSlider = () => {
  const duration = useMediaState("duration");

  const others = useOthers();

  if (others.length === 0) return null;

  return (
    <div className={cn("h-0 w-full -translate-y-2")}>
      {others.map((other) => (
        <CollaborativeAvatarGroup
          other={other.presence}
          key={other.connectionId}
          left={(other.presence.currentTime * 100) / duration} // in percentage w.r.t. time slider width
        />
      ))}
    </div>
  );
};

const COLUMNS = 10;
const ROWS = 10;

export function Time({
  controlsVariants = "default",
  showTallerTrack,
  onClick,
}: TimeSliderProps) {
  const sliderRef = useRef<TimeSliderInstance>(null),
    { pointerRate } = useStore(TimeSliderInstance, sliderRef);
  const {
    playerState: { timeFormat, fps, scrub },
  } = usePlayerContext();
  const duration = useMediaState("duration");

  const sprites = useMemo(
    () => generateSprites(scrub?.width || 0, scrub?.height || 0),
    [scrub?.width, scrub?.height]
  );

  const indexToShow = Math.round(pointerRate * ROWS * COLUMNS);

  const { ref, height, width } = useElementSize();

  const scale = useMemo(() => {
    return Math.max(width / scrub?.width, height / scrub?.height);
  }, [width, height, scrub?.width, scrub?.height]);

  const scrubBackgroundPosition = useMemo(() => {
    const horizontalPosition = `-${sprites[indexToShow || 0]?.left * scale}px`;
    const verticalPosition = `-${sprites[indexToShow || 0]?.top * scale}px`;

    return `${horizontalPosition} ${verticalPosition}`;
  }, [sprites, indexToShow, scale]);

  return (
    <TimeSlider.Root
      ref={sliderRef}
      keyStep={1}
      shiftKeyMultiplier={5}
      className={cn(
        "time-slider group relative inline-flex  h-10 w-full cursor-pointer touch-none select-none items-center outline-none",
        controlsVariants === "commenting-mobile" && "h-3 dark"
      )}
    >
      <TimeSlider.Chapters className="relative flex h-full w-full items-center rounded-[1px]">
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div
              className="last-child:mr-0 relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
              style={{ contain: "layout style" }}
              key={cue.startTime}
              ref={forwardRef}
              onClick={onClick}
              // onClick={() => {
              //   if (leaderId && updateMyPresence) {
              //     updateMyPresence({
              //       leaderId: null
              //     });
              //   }
              // }}
            >
              <TimeSlider.Track
                // onClick={() => {
                //   if (leaderId && updateMyPresence) {
                //     updateMyPresence({
                //       leaderId: null
                //     });
                //   }
                // }}
                // Increase the height of the time slider if time selection is active
                className={cn(
                  "ring-media-focus relative z-0  w-full rounded-2xl group-data-[focus]:ring-[1px]",
                  controlsVariants === "default" && showTallerTrack
                    ? "h-3"
                    : "h-2",
                  "bg-ds-videoplayer-controls-overlay-slider-active/10",
                  (controlsVariants === "commenting" ||
                    controlsVariants === "detection") &&
                    "bg-ds-videoplayer-controls-commenting-slider-active/10",
                  (controlsVariants === "search" ||
                    controlsVariants === "commenting-mobile") &&
                    "h-1 bg-white/30"
                )}
              >
                <TimeSlider.TrackFill
                  // onClick={() => {
                  //   if (leaderId && updateMyPresence) {
                  //     updateMyPresence({
                  //       leaderId: null
                  //     });
                  //   }
                  // }}
                  className={cn(
                    "absolute h-full w-[var(--chapter-fill)] rounded-2xl rounded-br-none rounded-tr-none will-change-[width]",
                    controlsVariants === "default" &&
                      "bg-ds-videoplayer-controls-overlay-slider-active",
                    (controlsVariants === "commenting" ||
                      controlsVariants === "detection") &&
                      "bg-ds-videoplayer-controls-commenting-slider-active",
                    (controlsVariants === "search" ||
                      controlsVariants === "commenting-mobile") &&
                      "h-1 bg-white"
                  )}
                />
                <TimeSlider.Progress
                  className={cn(
                    "absolute z-10 h-full w-[var(--chapter-progress)] rounded-2xl bg-ds-videoplayer-controls-commenting-slider-active/20 will-change-[width]",
                    controlsVariants === "default" &&
                      "bg-ds-videoplayer-controls-overlay-slider-active/20",
                    (controlsVariants === "commenting" ||
                      controlsVariants === "detection") &&
                      "bg-ds-videoplayer-controls-commenting-slider-active/20",
                    (controlsVariants === "search" ||
                      controlsVariants === "commenting-mobile") &&
                      "h-1 bg-white/50"
                  )}
                />
              </TimeSlider.Track>
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb
        className={cn(
          "absolute left-[var(--slider-fill)] top-1/2 z-10 w-0.5 rounded-sm  bg-ds-videoplayer-controls-commenting-slider-active will-change-[left]  -translate-x-full -translate-y-1/2",
          showTallerTrack ? "h-4" : "h-3",
          (controlsVariants === "search" ||
            controlsVariants === "commenting-mobile") &&
            "bg-white"
        )}
      />

      <TimeSlider.Preview className="group pointer-events-none flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100">
        <div
          className={cn(
            popoverClassNames.content,
            "-mb-2 h-auto rounded-md border-0 p-0 text-xs font-medium shadow-lg",
            "z-10  transition-opacity   group-data-[visible]:opacity-100",
            "z-20 after:absolute after:-bottom-3 after:left-1/2 after:-z-10 after:h-2 after:w-2  after:bg-ds-menu-bg after:-translate-x-1/2 after:rotate-45",
            controlsVariants === "commenting-mobile" &&
              "mb-0.5 after:-translate-y-2.5"
            // 'after:border after:border-ds-menu-border'
            // 'after:shadow-sm'
          )}
        >
          <div className="flex w-full flex-col ">
            {scrub?.url && (
              <div
                ref={ref}
                style={{
                  zIndex: 30,
                  pointerEvents: "none",
                  opacity: indexToShow ? 1 : 0,
                  width: `${(6 * scrub?.width) / scrub?.height}rem`,
                  height: "6rem",
                  backgroundImage: `url(${scrub?.url})`,
                  aspectRatio: `${scrub?.width} / ${scrub?.height}`,
                  backgroundSize: `${scrub?.width * COLUMNS * scale}px ${
                    scrub?.height * ROWS * scale
                  }px`,
                  backgroundPosition: scrubBackgroundPosition,
                }}
              ></div>
            )}
            <div className="flex w-full items-center justify-center px-1 py-0.5 text-center text-xs font-medium">
              {renderValue(pointerRate * duration, timeFormat, fps)}
            </div>
          </div>
        </div>
      </TimeSlider.Preview>

      {/* <TimeSlider.Preview className="group pointer-events-none flex flex-col items-center opacity-100 transition-opacity duration-200 data-[visible]:opacity-100">
         {thumbnails ? (
        <TimeSlider.Thumbnail.Root
          src={thumbnails}
          className="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
        >
          <TimeSlider.Thumbnail.Img />
        </TimeSlider.Thumbnail.Root>
      ) : null}

        <TimeSlider.ChapterTitle className="mt-2 text-sm" />

        <TimeSlider.Value className="font-karla flex items-center justify-center rounded-sm bg-default-100 px-1 py-0.5 text-xs font-medium opacity-0 transition-opacity group-data-[visible]:opacity-100" />
      </TimeSlider.Preview> */}
    </TimeSlider.Root>
  );
}
