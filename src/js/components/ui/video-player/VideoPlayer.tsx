"use client";

import "@vidstack/react/player/styles/base.css";

import type {
  MediaErrorDetail,
  MediaKeyShortcuts,
  MediaPauseEvent,
  MediaPlayerProps,
  MediaPlayEvent,
  MediaProviderAdapter,
  MediaTimeUpdateEvent,
  MediaTimeUpdateEventDetail,
} from "@vidstack/react";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import {
  HotkeyPlaybackRate,
  hotkeyPlaybackRates,
  usePlayerContext,
} from "@/context/player";
import { useWorkspacePreferences } from "@/context/workspace-preferences";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
// import { captureException } from '@sentry/nextjs';
import { FileNotAllowedIcon } from "@tessact/tessact-icons";
import {
  isHLSProvider,
  MEDIA_KEY_SHORTCUTS,
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaRemote,
} from "@vidstack/react";
import { flushSync } from "react-dom";

import { Loader } from "@tessact/icons";

import { VIACOM_PRODUCTION_URL } from "@/hooks/useFeatureToggle";

import { Subtitle } from "@/api-integration/types/video";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

// import { karla } from "@/ds/font";

import {
  AspectRatioIndicator,
  VideoLayout,
  WatermarkWorkspace,
} from "./VideoLayout";

export type ControlsVariants =
  | "default"
  | "tagging"
  | "commenting"
  | "search"
  | "detection"
  | "minimal-outside"
  | "none"
  | "cropping"
  | "share-commenting"
  | "commenting-mobile";

interface VideoPlayerProps extends Omit<MediaPlayerProps, "children"> {
  src: string;
  isHLSReady?: boolean;
  disableNumKeys?: boolean;
  enableTimeSelection?: boolean;
  disableMuteKey?: boolean;
  controlsVariant?: ControlsVariants;
  /** Time ranges in which video playback should be constrained.
   * This does not affect overall duration of the video */
  timeRanges?: Array<{ startTime: number; endTime: number }>;
  subtitles?: Subtitle[];
  disableCacheBusting?: boolean;
  customWatermark?: React.ReactNode;
  isCorrupted?: boolean;
  fileExtension?: string;
}
const timestampSortFn = (a: { startTime: number }, b: { startTime: number }) =>
  a.startTime - b.startTime;

export const VideoPlayer = ({
  src,
  isHLSReady,
  disableNumKeys,
  controlsVariant,
  enableTimeSelection,
  timeRanges,
  onTimeUpdate,
  onPlay,
  onPause,
  // onSeeked,
  subtitles,
  disableCacheBusting,
  customWatermark,
  isCorrupted,
  fileExtension,
  ...props
}: VideoPlayerProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const {
    player,
    playerState: {
      timeFormat,
      duration,
      timeSelection,
      setTimeSelection,
      timeSelectionPreview,
      shouldSyncEndTimeWithCurrentTime,
      setShouldSyncEndTimeWithCurrentTime,
      resetTimeSelectionStates,
      isLoopingEnabled,
      fps,
      hotkeyPlaybackRate,
      setHotkeyPlaybackRate,
    },
    setPlayer,
  } = usePlayerContext();

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    return player?.subscribe(({ currentTime }) => {
      setCurrentTime(currentTime);
    });
  }, [player]);

  const [isMediaError, setIsMediaError] = useState<MediaErrorDetail | null>(
    null
  );

  const jKeyPress = useRef(false);

  const { workspacePreferences, isLoadingWorkspacePreferences } =
    useWorkspacePreferences();

  const remote = useMediaRemote(player);

  const currentUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const isViacom = currentUrl === VIACOM_PRODUCTION_URL;

  function onProviderChange(
    provider: MediaProviderAdapter | null
    // nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  useEffect(() => {
    // When controls variant changes, we should reset the  selection states.
    // since the  selection states are only relevant to the commenting controls as of now.
    resetTimeSelectionStates();
  }, [controlsVariant]);

  useEffect(() => {
    setIsMediaError(null);
  }, [src]);

  const handleOnTimeUpdate = (
    detail: MediaTimeUpdateEventDetail,
    nativeEvent: MediaTimeUpdateEvent
  ) => {
    if (!player) return;
    const currentTime = detail.currentTime;
    if (range) {
      let left = 0;
      let right = range.length - 1;
      let rangeIndex = -1;
      while (left <= right) {
        // Binary search for the range which overlaps with currentTime
        const mid = Math.floor((left + right) / 2);
        if (
          range[mid].startTime <= currentTime &&
          range[mid].endTime >= currentTime
        ) {
          rangeIndex = mid;
          break;
        } else if (range[mid].startTime > currentTime) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      if (rangeIndex === -1) {
        // If currentTime is not in any range, then find the range which is right after currentTime
        left = 0;
        right = range.length - 1;
        while (left < right) {
          const mid = Math.floor((left + right) / 2);
          if (range[mid].endTime <= currentTime) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }
        const upperBoundRange = range[left];

        if (currentTime > upperBoundRange.endTime) {
          if (left + 1 < range.length) {
            player.currentTime = range[left + 1].startTime;
          } else {
            player.pause();
          }
        }
        if (currentTime < upperBoundRange.startTime) {
          player.currentTime = upperBoundRange.startTime;
        }
      }
    }
    if (timeSelection) {
      if (shouldSyncEndTimeWithCurrentTime) {
        flushSync(() => {
          setTimeSelection((prevTimeSelection) => {
            if (prevTimeSelection) {
              if (currentTime <= prevTimeSelection.startTime) {
                setShouldSyncEndTimeWithCurrentTime(false);
                return {
                  startTime: currentTime,
                  endTime: prevTimeSelection.endTime,
                };
              }
              return {
                startTime: prevTimeSelection.startTime,
                endTime: currentTime,
              };
            }
            return prevTimeSelection;
          });
        });
      } else {
        if (
          currentTime >= timeSelection.endTime &&
          timeSelection?.startTime < timeSelection.endTime
        ) {
          if (isLoopingEnabled) {
            player!.currentTime = timeSelection.startTime;
          } else {
            player?.pause();
          }
        }
      }
    }
    if (timeSelectionPreview && !!timeSelectionPreview?.endTime) {
      if (currentTime >= timeSelectionPreview.endTime) {
        if (isLoopingEnabled) {
          player!.currentTime = timeSelectionPreview.startTime;
        } else {
          player?.pause();
        }
      }
    }
    if (hotkeyPlaybackRate && hotkeyPlaybackRate < 0) {
      if (player.paused) {
        player.currentTime -= (1 / 8) * Math.abs(hotkeyPlaybackRate);
      } else {
        player?.pause();
        player.currentTime += 0.1;
      }
    }
    onTimeUpdate?.(detail, nativeEvent);
  };

  const handleOnPlay = (event: MediaPlayEvent) => {
    if (hotkeyPlaybackRate !== null) {
      if (hotkeyPlaybackRate < 0) {
        // pausedInNegativePlayback?.current = true;
        player?.pause();
        setHotkeyPlaybackRate(null);
        player!.playbackRate = 1;
        // setHotkeyPlaybackRate(null);
      }
    }
    if (range) {
      const lastRange = range[range.length - 1];
      if (currentTime > lastRange.endTime) {
        player!.currentTime = range[0].startTime;
      }
    }
    if (
      timeSelection &&
      currentTime >= timeSelection.endTime &&
      timeSelection?.startTime < timeSelection?.endTime &&
      !shouldSyncEndTimeWithCurrentTime
    ) {
      player!.currentTime = timeSelection.startTime;
    }
    if (
      timeSelectionPreview &&
      timeSelectionPreview?.endTime &&
      currentTime >= timeSelectionPreview.endTime
    ) {
      player!.currentTime = timeSelectionPreview.startTime;
    }

    onPlay?.(event);
  };

  const handleOnPause = (event: MediaPauseEvent) => {
    if (hotkeyPlaybackRate !== null) {
      if (!jKeyPress.current) {
        player!.playbackRate = 1;
        setHotkeyPlaybackRate(null);
        // if (hotkeyPlaybackRate < 0) {
        //   // player?.pause();
        // }
      } else {
        player!.currentTime += 0.1;
      }
      return;
    }
    jKeyPress.current = false;
    onPause?.(event);
  };

  const keyShortcuts: MediaKeyShortcuts = {
    ...MEDIA_KEY_SHORTCUTS,
    ...(disableNumKeys
      ? {
          numKeys: {
            keys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }
      : {}),
    ...(enableTimeSelection
      ? {
          startTimeSelection: {
            // Set the start  selection when pressing the `i` key.
            keys: ["i", "I"],
            onKeyDown() {
              console.log("startTimeSelection");
              setTimeSelection((prevTimeSelection) => {
                // If no  selection is set, set the start  to the current .
                // And set the end  to the duration of the video.

                if (prevTimeSelection === null) {
                  return {
                    startTime: currentTime,
                    endTime: currentTime,
                  };
                }
                // If a start  is already set, change it to the current .
                return {
                  startTime: Math.min(currentTime, prevTimeSelection.endTime), // Fail safe to ensure start  is always less than end
                  endTime: prevTimeSelection.endTime,
                };
              });
            },
          },
          endTimeSelection: {
            // Set the end  selection when pressing the `o` key.
            keys: ["o", "O"],
            onKeyDown() {
              console.log("endTimeSelection");
              // stop syncing end  with current  while playing
              // remote?.pause();
              player?.pause();
              setTimeSelection((prevTimeSelection) => {
                // If no  selection is set, set the start  to 0.
                // And set the end  to the current .

                if (prevTimeSelection === null) {
                  return {
                    startTime: 0,
                    endTime: currentTime,
                  };
                }
                // If a end  is already set, change it to the current .
                return {
                  startTime: prevTimeSelection.startTime,
                  endTime: Math.max(prevTimeSelection.startTime, currentTime), // Fail safe to ensure end  is always greater than start
                };
              });

              setShouldSyncEndTimeWithCurrentTime(false);
            },
          },
          clearTimeSelection: {
            // Clear the  selection and change other related states to defaults
            // when pressing the `Escape` key.
            keys: ["Escape"],
            onKeyDown() {
              resetTimeSelectionStates();
            },
          },
        }
      : {}),
    playbackRateModifiers: {
      keys: ["j", "J", "l", "L"],
      onKeyDown({ event }) {
        let newPlaybackRate: HotkeyPlaybackRate | null;
        if (event.key === "j" || event.key === "J") {
          if (!hotkeyPlaybackRate) {
            newPlaybackRate = -1;
          } else if (hotkeyPlaybackRate === 2) {
            // If the current playback rate is 2, then set it to 1.
            newPlaybackRate = null;
            if (player) {
              player.playbackRate = 1;
            }
          } else {
            const index = hotkeyPlaybackRates.findIndex(
              (rate) => rate === hotkeyPlaybackRate
            );
            const nextIndex = Math.max(0, index - 1);
            newPlaybackRate = hotkeyPlaybackRates[nextIndex];
          }
        } else {
          // K
          if (!hotkeyPlaybackRate) {
            newPlaybackRate = 2;
          } else if (hotkeyPlaybackRate === -1) {
            newPlaybackRate = null;
            if (player) {
              player.playbackRate = 1;
            }
            if (player?.paused) {
              player?.play();
            }
          } else {
            const index = hotkeyPlaybackRates.findIndex(
              (rate) => rate === hotkeyPlaybackRate
            );
            const nextIndex = Math.min(
              hotkeyPlaybackRates.length - 1,
              index + 1
            );
            newPlaybackRate = hotkeyPlaybackRates[nextIndex];
          }
        }
        if (player && !!newPlaybackRate) {
          player.playbackRate = Math.max(0, newPlaybackRate);
          if (newPlaybackRate < 0) {
            jKeyPress.current = true;
            // player?.pause();
            player.currentTime += 0.1;
          } else {
            player.play();
          }
        }
        setHotkeyPlaybackRate(newPlaybackRate);
      },
    },
    seekBackward: {
      keys: [
        "ArrowLeft",
        "Shift+ArrowLeft",
        // 'Alt+Shift+ArrowLeft', 'Alt+Ctrl+ArrowLeft'
      ],
      onKeyDown({ event, player, remote }) {
        let seekAmount;
        if (timeFormat === "frames" || timeFormat === "hms") {
          // Seek by frames
          seekAmount = event?.shiftKey ? 10 / fps : 1 / fps;
        } else {
          // Seek by seconds
          seekAmount = event?.shiftKey ? 5 : 1;
        }
        const timestamp = Math.max(0, (player.currentTime ?? 0) - seekAmount);
        remote.seek(timestamp, event);
      },
    },
    seekForward: {
      // Seek 1 second forward when pressing the right arrow key.
      keys: [
        // 'l',
        // 'L',
        "ArrowRight",
        "Shift+ArrowRight",
      ],
      onKeyDown({ event, player, remote }) {
        let seekAmount;
        if (timeFormat === "frames" || timeFormat === "hms") {
          // Seek by frames
          seekAmount = event?.shiftKey ? 10 / fps : 1 / fps;
        } else {
          // Seek by seconds
          seekAmount = event?.shiftKey ? 5 : 1;
        }
        const timestamp = Math.min(
          duration,
          (player.currentTime ?? 0) + seekAmount
        );
        remote.seek(timestamp, event);
      },
    },
    // Override the default togglePictureInPicture from key 'i' to key 'p'
    // to avoid conflicts with in out  selection
    togglePictureInPicture: {
      keys: ["p", "P"],
      onKeyDown({ event }) {
        remote.togglePictureInPicture(event);
      },
    },
  };

  // Range should be in sorted order for binary search
  const range = useMemo(() => timeRanges?.sort(timestampSortFn), [timeRanges]);

  // Due to a Chrome bug, we need to pass a random param and set crossOrigin to anonymous to prevent random CORS errors.
  // https://stackoverflow.com/questions/17570100/s3-not-returning-access-control-allow-origin-headers/55265139#55265139

  const randomId = useId();

  const randomParam = useMemo(
    // () => (disableCacheBusting ? '' : `random=${Math.floor(Math.random() * 10001)}`),
    () => (disableCacheBusting ? "" : `random=${randomId}`),
    [disableCacheBusting, randomId]
  );

  const handleOnError = (detail: MediaErrorDetail) => {
    // captureException(detail, {
    //   level: 'error',
    //   extra: {
    //     errorType: 'video_player_error',
    //     url: src,
    //     fileExtension: fileExtension,
    //     detail: JSON.stringify(detail),
    //     isCorrupted: isCorrupted,
    //     notSupported: isMediaError && isMediaError?.code === 4,
    //     disabledCacheBusting: disableCacheBusting
    //   }
    // });
    setIsMediaError(detail);
  };

  if (isCorrupted) {
    return <CorruptedVideo />;
  }

  if (isMediaError && isMediaError?.code === 4) {
    return <VideoSourceNotSupported fileExtension={fileExtension} />;
  }

  return (
    <MediaPlayer
      ref={setPlayer}
      className={cn(
        "ring-media-focus group flex aspect-video h-full w-full flex-col gap-1 overflow-visible rounded-xl font-sans text-white",
        isMobile && "rounded-none"
      )}
      title="Sprite Fight"
      src={disableCacheBusting ? src : `${src}?${randomParam}`}
      playsInline
      onProviderChange={onProviderChange}
      onTimeUpdate={handleOnTimeUpdate}
      keyTarget="document"
      loop={!timeSelection && isLoopingEnabled}
      onPlay={handleOnPlay}
      onPause={handleOnPause}
      onError={handleOnError}
      // onSeeked={handleSeeked}
      keyShortcuts={keyShortcuts}
      muted={hotkeyPlaybackRate ? hotkeyPlaybackRate < 0 : undefined}
      // paused={hotkeyPlaybackRate ? hotkeyPlaybackRate < 0 : undefined}
      {...props}
    >
      <MediaProvider
        className="flex h-full w-full items-center justify-center bg-ds-videoplayer-bg [&>video]:h-full"
        onContextMenu={(e) => e.preventDefault()}
      >
        {subtitles &&
          subtitles.map((subtitle, index) => (
            <Track
              key={subtitle.id}
              src={subtitle.url}
              lang={subtitle.language_code}
              kind="subtitles"
              label={
                subtitle.language_code?.charAt(0).toUpperCase() +
                subtitle.language_code.slice(1)
              }
              language={subtitle.language_code}
              type="srt"
              default={index === 0}
            />
          ))}
        {!isHLSReady && isViacom && (
          <div
            className="absolute top-4 z-100 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.2)",
            }}
          >
            <Loader size={14} />
            <span className="text-xs font-medium text-white">
              Playback might be affected while we process the video
            </span>
          </div>
        )}
        {!isLoadingWorkspacePreferences &&
          workspacePreferences?.watermarking_enabled && <WatermarkWorkspace />}
        {customWatermark ? customWatermark : null}
        <AspectRatioIndicator />
      </MediaProvider>
      <VideoLayout controlsVariant={controlsVariant} />
    </MediaPlayer>
  );
};

const VideoPlayerError = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <div
      className={cn(
        "flex aspect-video h-full w-full flex-col items-center justify-center gap-1 overflow-visible text-wrap rounded-xl bg-ds-videoplayer-bg text-center font-sans text-white",
        // karla.className,
        isMobile && "rounded-none"
      )}
    >
      <div className="flex max-w-[274px] flex-col items-center text-center">
        {icon}
        <div className="text-center text-base font-medium text-default-50 dark:text-default-900">
          {title}
        </div>
        {description && (
          <div className="text-center text-sm text-default-400 dark:text-default-500">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

const CorruptedVideo = () => {
  return (
    <VideoPlayerError
      icon={<FileNotAllowedIcon width={24} height={24} className="mb-3" />}
      title="This file is corrupted"
      description="Check your file, re-upload & try again."
    />
  );
};

const VideoSourceNotSupported = ({
  fileExtension,
}: {
  fileExtension?: string;
}) => {
  return (
    <VideoPlayerError
      icon={<FileNotAllowedIcon width={24} height={24} className="mb-3" />}
      title="This file is not viewable"
      description={
        fileExtension
          ? `${
              fileExtension.startsWith(".") ? "" : "."
            }${fileExtension} filetype is not supported on your browser. Updating your browser might help`
          : "This file type is not supported on your browser. Updating your browser might help"
      }
    />
  );
};
