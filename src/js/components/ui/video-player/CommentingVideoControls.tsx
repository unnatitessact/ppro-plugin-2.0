import { useComments } from "@/context/comments";
import { AspectRatio, TimeCodeType, usePlayerContext } from "@/context/player";
import {
  useEventListener,
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "../../../../../liveblocks.config";
import { ClientSideSuspense, useIsInsideRoom } from "@liveblocks/react";
import { useMediaQuery } from "@mantine/hooks";
import { cn, useDisclosure } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  YtShortsIcon,
} from "@tessact/tessact-icons";
import {
  Controls,
  useCaptionOptions,
  useMediaState,
  usePlaybackRateOptions,
  useVideoQualityOptions,
} from "@vidstack/react";

import {
  ChevronDownSmall,
  Crop,
  Gauge,
  PeopleRemove,
  SquareLinesBottom,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { NextAvatar } from "@/components/ui/NextAvatar";
import * as RadixDropdown from "@/components/ui/RadixDropdown";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { ControlsVariants } from "@/components/ui/video-player/VideoPlayer";

// import {
//   CaptionDetectionDropdownMenuItemsMemo,
//   getSubtitleProcessStatusIcon,
// } from "@/components/detection/audio-tab/sections/CaptionDetection";

import {
  getVideoSubtitlesQueryKey,
  useSubtitlesQuery,
} from "@/api-integration/queries/video";
import { SubtitleLanguageCode } from "@/api-integration/types/video";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { renderValue, timeCodesMenu } from "@/utils/videoUtils";

import * as Buttons from "./VideoButtons";
import { BufferingIndicator, Gestures, Subtitles } from "./VideoLayout";
import * as Sliders from "./VideoSlider";

// This component is rendered as a fallback if Liveblocks fucks up
export const ControlsBar = ({
  buttonSize,
  controlsVariants,
}: {
  buttonSize: number;
  controlsVariants?: ControlsVariants;
}) => {
  const currentTime = useMediaState("currentTime"),
    duration = useMediaState("duration");
  const {
    playerState: { timeFormat, setTimeFormat, fps },
  } = usePlayerContext();

  return (
    <>
      <div
        className={cn(
          "contents",
          controlsVariants === "commenting-mobile" && "dark"
        )}
      >
        <Buttons.Play buttonSize={buttonSize} />
        <Buttons.Loop buttonSize={buttonSize} />
        <Buttons.Mute buttonSize={buttonSize} />
        <Sliders.Volume />
      </div>
      <Dropdown placement="top-end">
        <DropdownTrigger>
          <Button
            variant="light"
            size="sm"
            className={cn(
              "group mx-3",
              controlsVariants === "commenting-mobile" && "mx-0 dark"
            )}
            aria-label="Time code"
          >
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-base  font-medium text-ds-videoplayer-text-primary">
                {renderValue(currentTime, timeFormat, fps)}
              </span>
              <span
                className={cn(
                  "font-mono text-base font-medium text-ds-videoplayer-text-secondary",
                  controlsVariants === "commenting-mobile" && "text-white/50"
                )}
              >
                /{renderValue(duration, timeFormat, fps)}
              </span>
              <ChevronDownSmall
                className={cn(
                  "text-ds-videoplayer-text-secondary transition-transform group-aria-expanded:rotate-180",
                  controlsVariants === "commenting-mobile" && "text-white"
                )}
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
    </>
  );
};

// This component is only rendered when liveblocks is available, otherwise fallback component is rendered which does not use liveblocks
const LiveControls = ({ buttonSize }: { buttonSize: number }) => {
  const currentTime = useMediaState("currentTime");
  const duration = useMediaState("duration");

  const leaderId = useSelf((self) => self.presence.leaderId);
  const leader = useOthers(
    (others) => others.filter((other) => other.presence.id === leaderId)?.[0]
  );
  const updateMyPresence = useUpdateMyPresence();
  const {
    playerState: { timeFormat, fps },
  } = usePlayerContext();

  if (!leader) return <ControlsBar buttonSize={buttonSize} />;
  return (
    <div className="flex w-fit items-center gap-6 rounded-full bg-primary-400 px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="font-regular text-sm text-white">
          {renderValue(currentTime, timeFormat, fps)}
          <span className="text-white/60">
            / {renderValue(duration, timeFormat, fps)}
          </span>
        </p>
        <Divider orientation="vertical" className="h-2 bg-ds-divider-line" />

        <div className="flex items-center gap-1">
          <p className="font-regular text-sm text-white/60">Following</p>

          <NextAvatar
            src={leader.presence.avatar}
            alt={leader.presence.name}
            height={20}
            width={20}
            userFallbackProps={{
              color: leader.presence.color,
              email: leader.presence.email,
            }}
          />

          <p className="text-sm font-medium text-white">
            {leader.presence.name ?? leader.presence.email}
          </p>
        </div>
      </div>

      <div
        onClick={() => {
          updateMyPresence({
            leaderId: null,
          });
        }}
      >
        <PeopleRemove size={16} className="cursor-pointer text-white" />
      </div>
    </div>
  );
};

export const CommentingVideoControls = ({
  buttonSize,
}: {
  buttonSize: number;
}) => {
  const { fileId } = useComments();
  const isInsideRoom = useIsInsideRoom();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <>
      <Gestures />
      <BufferingIndicator />
      <Subtitles />
      <Controls.Root
        className={cn(
          "relative z-10 flex h-full w-full flex-1 flex-col items-center justify-between rounded-bl-2xl rounded-br-2xl bg-ds-videoplayer-controls-bg px-4 pb-[18px] text-ds-text-primary",
          isMobile && "px-2 pb-2"
        )}
      >
        <Controls.Group className="flex h-full w-full items-center justify-start">
          <Sliders.TimeCommenting controlsVariants="commenting" />
        </Controls.Group>
        <div className="flex w-full">
          <Controls.Group className="flex h-full w-full flex-shrink-0 items-center justify-start gap-1">
            <ClientSideSuspense
              fallback={<ControlsBar buttonSize={buttonSize} />}
            >
              {isInsideRoom && (() => <LiveControls buttonSize={buttonSize} />)}
            </ClientSideSuspense>
          </Controls.Group>
          <Controls.Group className="flex w-full min-w-0 items-center justify-end gap-1">
            {!isMobile && (
              <Buttons.SetAsThumbnailButton
                buttonSize={buttonSize}
                fileId={fileId}
              />
            )}
            <AspectRatioOptionsDropdown controlsVariants={"commenting"} />
            {!isMobile && (
              <>
                <PlaybackRateOptionsDropdown />
                <QualityOptionsDropdown />
                <CaptionsDropdown fileId={fileId} />
              </>
            )}
            {/* <AudioCaptionsOptionsDropdown /> */}
            <Buttons.Fullscreen buttonSize={buttonSize} />
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};

const AspectRatioIcon = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return (
    <div className="flex size-5 items-center justify-center ">
      <div
        className="max-h-[14px] max-w-[14px] rounded-sm border border-default-500"
        style={{
          aspectRatio: `${width}/${height}`,
          width: width > height ? "100%" : "auto",
          height: width > height ? "auto" : "100%",
        }}
      />
    </div>
  );
};

export const AspectRatioOptionsDropdown = ({
  controlsVariants,
}: {
  controlsVariants?: ControlsVariants;
}) => {
  const {
    playerState: { aspectRatio, setAspectRatio },
  } = usePlayerContext();

  return (
    <Dropdown placement="top-end">
      <DropdownTrigger>
        <Button
          size="sm"
          variant="light"
          isIconOnly={!aspectRatio}
          className={cn(
            "flex h-full flex-shrink-0  items-center justify-center gap-2  text-sm font-medium",
            !!aspectRatio &&
              "bg-ds-timestamp-bg-selected text-primary-400 data-[hover=true]:bg-ds-timestamp-bg-selected",
            controlsVariants === "commenting-mobile" && "dark"
          )}
          aria-label="Aspect ratio"
        >
          <Crop size={20} />
          {aspectRatio}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(value) =>
          value === "none"
            ? setAspectRatio(null)
            : setAspectRatio(value as AspectRatio)
        }
      >
        <DropdownItem key="none" className="text-sm">
          None
        </DropdownItem>
        <DropdownItem
          key="1:1"
          startContent={<AspectRatioIcon width={1} height={1} />}
        >
          1:1
        </DropdownItem>
        <DropdownItem
          key="4:3"
          startContent={<AspectRatioIcon width={4} height={3} />}
        >
          4:3
        </DropdownItem>
        <DropdownItem
          key="9:16"
          startContent={<AspectRatioIcon width={9} height={16} />}
        >
          9:16
        </DropdownItem>
        <DropdownItem
          key="16:9"
          startContent={<AspectRatioIcon width={16} height={9} />}
        >
          16:9
        </DropdownItem>
        <DropdownItem isDisabled={true}>
          <Divider />
        </DropdownItem>
        <DropdownItem
          key="1:1"
          startContent={<InstagramIcon width={20} height={20} />}
        >
          <div className="flex items-center gap-1">
            Instagram post <span className="text-ds-text-secondary">(1:1)</span>
          </div>
        </DropdownItem>
        <DropdownItem
          key="9:16"
          startContent={<InstagramIcon width={20} height={20} />}
        >
          Instagram reel <span className="text-ds-text-secondary">(9:16)</span>
        </DropdownItem>
        <DropdownItem
          key="16:9"
          startContent={<YoutubeIcon width={20} height={20} />}
        >
          Youtube video <span className="text-ds-text-secondary">(16:9)</span>
        </DropdownItem>
        <DropdownItem
          key="9:16"
          startContent={<YtShortsIcon width={20} height={20} />}
        >
          Youtube short <span className="text-ds-text-secondary">(9:16)</span>
        </DropdownItem>
        <DropdownItem
          key="4:3"
          startContent={<TwitterIcon width={20} height={20} />}
        >
          Twitter post <span className="text-ds-text-secondary">(4:3)</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const PlaybackRateOptionsDropdown = () => {
  const playbackRateOptions = usePlaybackRateOptions({
      rates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
    }),
    playbackRateHint = `${playbackRateOptions.selectedValue}x `;

  const {
    playerState: { hotkeyPlaybackRate, setHotkeyPlaybackRate },
  } = usePlayerContext();

  return (
    <Dropdown placement="top-end">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className={cn(
            "flex h-full flex-shrink-0  items-center justify-center gap-1  text-base font-medium text-ds-text-secondary",
            !!hotkeyPlaybackRate &&
              "rounded-xl bg-ds-combination-amber-subtle-bg text-ds-combination-amber-subtle-text data-[hover=true]:bg-ds-combination-amber-subtle-bg/75"
          )}
          aria-label="Playback rate"
        >
          {hotkeyPlaybackRate ? (
            <>
              <Gauge size={16} />
              <span className="text-base font-medium">
                {hotkeyPlaybackRate}x
              </span>
            </>
          ) : (
            <span className="text-sm text-ds-text-primary">
              {playbackRateHint}
            </span>
          )}
          {/* <ChevronDownSmall
            className="text-ds-videoplayer-text-secondary transition-transform group-aria-expanded:rotate-180"
            size={16}
          /> */}
          {/* <Hd width={20} height={20} /> */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {playbackRateOptions.map(({ label, value, select }) => (
          <DropdownItem
            value={value}
            onPress={() => {
              select();
              setHotkeyPlaybackRate(null);
            }}
            key={value}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export const CaptionsDropdown = ({
  fileId,
  buttonClassname,
  disablePortal,
}: {
  fileId: string;
  buttonClassname?: string;
  disablePortal?: boolean;
}) => {
  // const queryClient = useQueryClient();

  const isInsideRoom = useIsInsideRoom();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: subtitles } = useSubtitlesQuery(fileId ?? "");

  const captionOptions = useCaptionOptions(),
    captionSelected = captionOptions.selectedValue as SubtitleLanguageCode;

  const isNoCaptionOptionsAvailable =
    captionOptions.filter((option) => option.value !== "off").length === 0;

  if (isNoCaptionOptionsAvailable) return null;

  return (
    <>
      <RadixDropdown.DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <RadixDropdown.DropdownMenuTrigger>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            as="div"
            onPointerDown={onOpen}
            className={buttonClassname}
            aria-label="Subtitles"
          >
            <SquareLinesBottom size={20} />
          </Button>
        </RadixDropdown.DropdownMenuTrigger>

        <RadixDropdown.DropdownMenuContent
          className="max-h-96 overflow-hidden p-0"
          disablePortal={disablePortal}
        >
          <div className="overflow-y-auto p-2">
            <RadixDropdown.DropdownMenuLabel>
              Subtitles
            </RadixDropdown.DropdownMenuLabel>
            <RadixDropdown.DropdownMenuGroup>
              <ScrollShadow>
                {captionOptions.map(({ label, value, select, track }) => {
                  const subtitle = subtitles?.find(
                    (subtitle) =>
                      track &&
                      subtitle.language_code ===
                        (track?.language as SubtitleLanguageCode)
                  );

                  if (!subtitle) return null;

                  // const endContent = getSubtitleProcessStatusIcon(
                  //   false,
                  //   subtitle?.eta
                  // );

                  return (
                    <RadixDropdown.DropdownMenuItem
                      key={value}
                      textValue={value}
                      onSelect={() => select()}
                      className={cn(
                        value === captionSelected && "bg-ds-menu-selected"
                      )}
                      // endContent={endContent}
                      disabled={!subtitle?.eta || subtitle?.eta < 1}
                    >
                      {label}
                    </RadixDropdown.DropdownMenuItem>
                  );
                })}
              </ScrollShadow>
            </RadixDropdown.DropdownMenuGroup>
            {/* <CaptionDetectionDropdownMenuItemsMemo
              subtitles={subtitles ?? []}
              selectedLanguage={captionSelected}
              setSelectedLanguage={(language) => {
                captionOptions
                  ?.find((option) => option.value === language)
                  ?.select();
              }}
            /> */}
          </div>
        </RadixDropdown.DropdownMenuContent>
      </RadixDropdown.DropdownMenu>
      {isInsideRoom && <SubtitleRefetcher />}
    </>
  );
};

const SubtitleRefetcher = () => {
  const queryClient = useQueryClient();
  const { fileId } = useComments();
  // Invalidate subtitles query when backend updates subtitles
  useEventListener((data) => {
    if (data.event.type === "SUBTITLES_UPDATED") {
      queryClient.invalidateQueries({
        queryKey: getVideoSubtitlesQueryKey(fileId),
      });
    }
  });
  return null;
};

export const QualityOptionsDropdown = () => {
  const qualityOptions = useVideoQualityOptions({
      auto: true,
      sort: "descending",
    }),
    currentQualityHeight = qualityOptions.selectedQuality?.height,
    qualityHint =
      qualityOptions.selectedValue !== "auto" && currentQualityHeight
        ? `${currentQualityHeight}p`
        : `Auto${currentQualityHeight ? ` (${currentQualityHeight}p)` : ""}`;

  const isNoQualitiesAvailable =
    qualityOptions.filter((quality) => quality.value !== "auto").length === 0;

  if (isNoQualitiesAvailable) return null;

  return (
    <Dropdown placement="top-end">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className="flex h-full flex-shrink-0  items-center justify-center gap-1 text-base font-medium text-ds-text-secondary"
          aria-label="Quality"
        >
          <span className="text-sm text-ds-text-primary">{qualityHint}</span>
          <ChevronDownSmall
            className="text-ds-videoplayer-text-secondary transition-transform group-aria-expanded:rotate-180"
            size={16}
          />
          {/* <Hd width={20} height={20} /> */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {qualityOptions.map(({ quality, label, value, select }) => (
          <DropdownItem
            value={value}
            onPress={() => select()}
            key={value}
            endContent={
              <>
                {quality && (
                  <QualityEndContent
                    value={
                      quality?.height < 2160
                        ? quality?.height >= 1080
                          ? "HD"
                          : undefined
                        : "4K"
                    }
                  />
                )}
              </>
            }
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const QualityEndContent = ({ value }: { value?: string }) => (
  <>{value && <p className="font-medium text-ds-text-secondary">{value}</p>}</>
);
