import { useCallback, useEffect, useMemo, useRef } from "react";

import { useDetection } from "@/context/detection";
import { TimeCodeType, usePlayerContext } from "@/context/player";
import { Spacer } from "@nextui-org/react";
import { Controls, useMediaRemote, useMediaState } from "@vidstack/react";
import { AnimatePresence, motion } from "framer-motion";

import { ChevronDownSmall, CrossLarge, Pause, Play } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  CaptionsDropdown,
  PlaybackRateOptionsDropdown,
  QualityOptionsDropdown,
} from "@/components/ui/video-player/CommentingVideoControls";
import {
  BufferingIndicator,
  Gestures,
  Subtitles,
} from "@/components/ui/video-player/VideoLayout";

import {
  DetectedEntityDetailed,
  Timestamp,
} from "@/api-integration/types/detection";

// import { brands, emotions, faces, locations, objects, ocrs } from '@/utils/detectionUtils';
import { renderValue, timeCodesMenu } from "@/utils/videoUtils";

import * as Buttons from "./VideoButtons";
import * as Sliders from "./VideoSlider";

export const DetectionVideoControls = ({
  buttonSize,
}: {
  buttonSize: number;
}) => {
  // const audioOptions = useAudioOptions(),
  //   audioHint = audioOptions.selectedTrack?.label;

  // const captionOptions = useCaptionOptions(),
  //   captionHint = captionOptions.selectedTrack?.label ?? 'Off';

  // console.log({ audioOptions, captionOptions });

  const { fileId } = useDetection();
  const currentTime = useMediaState("currentTime"),
    duration = useMediaState("duration");
  const {
    playerState: { timeFormat, setTimeFormat, fps },
  } = usePlayerContext();
  const { setPlayingEntity, selectedEntitiesPopulated } = useDetection();

  return (
    <>
      <Gestures />

      <BufferingIndicator />
      <Subtitles />
      <Controls.Root className="relative z-10 flex h-full w-full flex-1 flex-col items-center justify-between  rounded-bl-2xl rounded-br-2xl bg-ds-videoplayer-controls-bg pb-[18px] text-ds-text-primary">
        <Controls.Group className="flex h-full w-full items-center justify-start px-4">
          <Sliders.Time controlsVariants="detection" />
        </Controls.Group>
        <div className="flex w-full px-4">
          <Controls.Group className="flex h-full w-full flex-shrink-0 items-center justify-start gap-1">
            <Buttons.Play
              buttonSize={buttonSize}
              onPress={() => {
                setPlayingEntity(null);
              }}
            />
            <Buttons.Loop buttonSize={buttonSize} />
            <Buttons.Mute buttonSize={buttonSize} />
            <Sliders.Volume />
            <Dropdown placement="top-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="group mx-3"
                  aria-label="Time code"
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="font-mono text-base  font-medium text-ds-videoplayer-text-primary">
                      {renderValue(currentTime, timeFormat, fps)}
                    </span>
                    <span className="font-mono text-base font-medium text-ds-videoplayer-text-secondary">
                      /{renderValue(duration, timeFormat, fps)}
                    </span>
                    <ChevronDownSmall
                      className="text-ds-videoplayer-text-secondary transition-transform group-aria-expanded:rotate-180"
                      size={20}
                    />
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(type) => {
                  setTimeFormat(type as TimeCodeType);
                }}
              >
                {timeCodesMenu.map((item) => (
                  <DropdownItem
                    key={item.type}
                    startContent={
                      <p className="text-ds-menu-text-primary">{item.label}</p>
                    }
                    endContent={
                      <p className="font-mono text-ds-menu-text-secondary">
                        {renderValue(currentTime, item.type, fps)}
                      </p>
                    }
                  ></DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Controls.Group>
          <Controls.Group className="flex w-full min-w-0 items-center justify-end gap-1">
            <Buttons.SetAsThumbnailButton
              buttonSize={buttonSize}
              fileId={fileId}
            />
            <PlaybackRateOptionsDropdown />
            <QualityOptionsDropdown />
            <CaptionsDropdown fileId={fileId} />
            <Buttons.Fullscreen buttonSize={buttonSize} />
          </Controls.Group>
        </div>
        <Controls.Group className="flex max-h-28 w-full flex-shrink-0 flex-col overflow-y-auto  px-4">
          <AnimatePresence>
            {selectedEntitiesPopulated.map((entity, index) => (
              <TimelineEntity
                key={entity.item}
                {...entity}
                isLast={index + 1 === selectedEntitiesPopulated.length}
              />
            ))}
          </AnimatePresence>
        </Controls.Group>
      </Controls.Root>
    </>
  );
};

export const TimelineEntity = ({
  id,
  image,
  item,
  timestamps,
  isLast,
}: { isLast?: boolean } & DetectedEntityDetailed) => {
  const divRef = useRef<HTMLDivElement>(null);

  const duration = useMemo(
    () =>
      timestamps.reduce(
        (acc, { start_time, end_time }) => acc + (end_time - start_time),
        0
      ),
    [timestamps]
  );
  const isPlaying = useMediaState("playing");
  const remote = useMediaRemote();
  const { playingEntity, setPlayingEntity, setSelectedEntities } =
    useDetection();
  const {
    playerState: { timeFormat, fps },
  } = usePlayerContext();
  const handleRemove = useCallback(() => {
    setSelectedEntities((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [id, setSelectedEntities]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      divRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      className="group flex flex-shrink-0 flex-col gap-1"
      initial={{
        opacity: 0,
        height: 0,
        // paddingBottom: 0
      }}
      animate={{
        opacity: 1,
        height: "auto",
        // paddingBottom: isLast ? 0 : '16px'
      }}
      exit={{
        opacity: 0,
        height: 0,
        // paddingBottom: 0
      }}
    >
      <div ref={divRef} className="h-full w-full">
        <div className="flex items-center gap-1">
          {image && (
            <img
              className="h-5 w-5 rounded-full border border-ds-alert-bg object-cover"
              width={20}
              height={20}
              alt={item}
              src={image}
            />
          )}
          <div className="text-sm text-ds-text-primary">{item}</div>
          <Divider orientation="vertical" className="h-3" />
          <div className="text-sm text-ds-text-secondary">
            {renderValue(duration, timeFormat, fps)}
          </div>
          <Divider orientation="vertical" className="h-3" />

          <Controls.Group className="flex items-center gap-1">
            <Button
              className="text-ds-text-secondary"
              variant="light"
              size="sm"
              aria-label="Play/Pause"
              isIconOnly
              onPress={() => {
                setPlayingEntity(id);
                if (isPlaying) {
                  remote.pause();
                } else {
                  remote.play();
                }
              }}
            >
              {isPlaying && playingEntity === id ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </Button>
            <Button
              className="text-ds-text-secondary"
              variant="light"
              size="sm"
              isIconOnly
              onPress={handleRemove}
              aria-label="Remove entity"
            >
              <CrossLarge size={16} />
            </Button>
          </Controls.Group>
        </div>
        <Timeline ranges={timestamps} />
        {!isLast && <Spacer y={4} />}
      </div>
    </motion.div>
  );
};

interface TimelineProps {
  ranges: Timestamp[];
  // ranges: {
  //   startTime: number;
  //   endTime: number;
  //   additional_data?: AdditionalDetectionData;
  // }[];
}

export const Timeline = ({ ranges }: TimelineProps) => {
  return (
    <div className="relative flex h-2 w-full rounded-xl bg-ds-videoplayer-controls-default">
      {ranges.map((range) => (
        <TimelineSelectionArea
          key={`${range?.start_time}-${range.end_time}`}
          range={range}
        />
      ))}
    </div>
  );
};

const TimelineSelectionArea = ({ range }: { range: Timestamp }) => {
  const duration = useMediaState("duration");
  const { player } = usePlayerContext();
  const remote = useMediaRemote(player);

  return (
    <div
      className="absolute top-1/2 h-1 cursor-pointer rounded-lg bg-ds-button-default-text -translate-y-1/2"
      style={{
        left: `${(range.start_time * 100) / duration}%`,
        width: `${((range.end_time - range.start_time) * 100) / duration}%`,
      }}
      onPointerDown={(e) => {
        const parentElement = e.currentTarget.parentElement;
        if (parentElement) {
          const rect = parentElement.getBoundingClientRect();
          const clickX = e.clientX - rect.left; // x position within the element.
          const leftPercentage = clickX / rect.width;
          const time = duration * leftPercentage;
          remote.seek(time);
        }
      }}
    >
      <div className="relative h-full w-full">
        {/* Larger hit area element */}
        {range?.additional_data?.rationale ? (
          <Tooltip
            showArrow
            content={range?.additional_data?.rationale}
            className="max-w-60 text-wrap"
          >
            <div className="absolute left-1/2 top-1/2 h-3 w-full min-w-4 -translate-x-1/2 -translate-y-3" />
          </Tooltip>
        ) : (
          <div className="absolute left-1/2 top-1/2 h-3 w-full min-w-4 -translate-x-1/2 -translate-y-3" />
        )}
      </div>
    </div>
  );
};
