import { usePlayerContext } from '@/context/player';
import { cn } from '@nextui-org/react';
import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  SeekButton,
  Tooltip,
  TooltipPlacement,
  useMediaRemote,
  useMediaState
} from '@vidstack/react';
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon
} from '@vidstack/react/icons';
import { GalleryThumbnailsIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  ArrowsDiagonalIn,
  ArrowsDiagonalOut,
  ArrowsRepeatRightLeft,
  FastForwardFilled,
  PauseFilled,
  PlayFilled,
  RewindFilled,
  VolumeFullFilled,
  VolumeHalfFilled,
  VolumeOffFilled
} from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { ToastSuccess } from '@/components/ui/ToastContent';

import { useSetThumbnail } from '@/api-integration/mutations/library';

import { renderValue } from '@/utils/videoUtils';

export interface MediaButtonProps {
  tooltipPlacement?: TooltipPlacement;
  buttonSize?: number;
  disableColorToggleOnThemeChange?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export const buttonClass =
  'group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4';

export const tooltipClass =
  'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden';

export function Play({
  buttonSize,
  disableColorToggleOnThemeChange,
  size = 'sm',
  onPress
}: MediaButtonProps) {
  const isPaused = useMediaState('paused');

  const {
    playerState: { hotkeyPlaybackRate, setHotkeyPlaybackRate }
  } = usePlayerContext();

  const remote = useMediaRemote();

  if (hotkeyPlaybackRate) {
    return (
      <Button
        variant="light"
        isIconOnly
        size={size}
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        onPress={() => {
          setHotkeyPlaybackRate(null);
          remote?.changePlaybackRate(1);
          remote?.pause();
        }}
        aria-label="Playback rate"
      >
        <PauseFilled size={buttonSize} />
      </Button>
    );
  }

  return (
    <PlayButton asChild className="flex aspect-square h-full items-center justify-center">
      <Button
        variant="light"
        isIconOnly
        size={size}
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        onPress={onPress}
        aria-label="Play/Pause"
      >
        {isPaused ? <PlayFilled size={buttonSize} /> : <PauseFilled size={buttonSize} />}
      </Button>
    </PlayButton>
  );
}

export function Loop({ buttonSize }: MediaButtonProps) {
  const {
    playerState: {
      timeSelection,
      timeSelectionPreview,
      isLoopingEnabled,
      setIsLoopingEnabled,
      shouldSyncEndTimeWithCurrentTime
    }
  } = usePlayerContext();
  return (
    <Button
      isDisabled={
        (timeSelection !== null && shouldSyncEndTimeWithCurrentTime) ||
        timeSelectionPreview !== null
      }
      color={isLoopingEnabled ? 'default' : undefined}
      isIconOnly
      size="sm"
      variant="light"
      onPress={() => setIsLoopingEnabled((prev) => !prev)}
      aria-label="Loop"
    >
      <ArrowsRepeatRightLeft
        className={cn(!isLoopingEnabled ? 'text-ds-' : 'text-primary-400')}
        size={buttonSize}
      />
    </Button>
  );
}

export function SeekBackward({ buttonSize, disableColorToggleOnThemeChange }: MediaButtonProps) {
  return (
    <SeekButton
      asChild
      seconds={-1}
      className="flex aspect-square h-full items-center justify-center"
    >
      <Button
        isIconOnly
        variant="light"
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        aria-label="Seek backward"
      >
        <RewindFilled size={buttonSize} />
      </Button>
    </SeekButton>
  );
}

export function SeekForward({ buttonSize, disableColorToggleOnThemeChange }: MediaButtonProps) {
  return (
    <SeekButton
      asChild
      seconds={1}
      className="flex aspect-square h-full items-center justify-center"
    >
      <Button
        isIconOnly
        variant="light"
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        aria-label="Seek forward"
      >
        <FastForwardFilled size={buttonSize} />
      </Button>
    </SeekButton>
  );
}

export function Mute({ buttonSize, disableColorToggleOnThemeChange }: MediaButtonProps) {
  const volume = useMediaState('volume'),
    isMuted = useMediaState('muted');

  return (
    <MuteButton asChild className="flex aspect-square  items-center justify-center">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        aria-label="Mute"
      >
        {isMuted || volume == 0 ? (
          <VolumeOffFilled height={buttonSize} width={buttonSize} />
        ) : volume < 0.5 ? (
          <VolumeHalfFilled height={buttonSize} width={buttonSize} />
        ) : (
          <VolumeFullFilled height={buttonSize} width={buttonSize} />
        )}
      </Button>
    </MuteButton>
  );
}

export function Caption({ tooltipPlacement }: MediaButtonProps) {
  const track = useMediaState('textTrack'),
    isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={buttonClass}>
          {isOn ? (
            <ClosedCaptionsOnIcon className="h-8 w-8" />
          ) : (
            <ClosedCaptionsIcon className="h-8 w-8" />
          )}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isOn ? 'Closed-Captions Off' : 'Closed-Captions On'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement }: MediaButtonProps) {
  const isActive = useMediaState('pictureInPicture');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={buttonClass}>
          {isActive ? (
            <PictureInPictureExitIcon className="h-8 w-8" />
          ) : (
            <PictureInPictureIcon className="h-8 w-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? 'Exit PIP' : 'Enter PIP'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Fullscreen({ buttonSize, disableColorToggleOnThemeChange }: MediaButtonProps) {
  const isActive = useMediaState('fullscreen');
  return (
    <FullscreenButton
      className={cn(
        'flex aspect-square h-full items-center justify-center',
        isActive && 'text-white'
      )}
      style={{
        transform: 'scale(1,-1)'
      }}
      asChild
    >
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className={cn(disableColorToggleOnThemeChange && 'text-white')}
        aria-label="Fullscreen"
      >
        {isActive ? (
          <ArrowsDiagonalIn size={buttonSize} />
        ) : (
          <ArrowsDiagonalOut size={buttonSize} />
        )}
      </Button>
    </FullscreenButton>
  );
}

export function SetAsThumbnailButton({
  buttonSize,
  disableColorToggleOnThemeChange,
  fileId
}: MediaButtonProps & { fileId: string }) {
  const { mutate: setThumbnail } = useSetThumbnail();

  const currentTime = useMediaState('currentTime');
  const {
    playerState: { timeFormat, fps }
  } = usePlayerContext();

  return (
    <Button
      title="Set this as thumbnail"
      isIconOnly
      variant="light"
      className={cn(disableColorToggleOnThemeChange && 'text-white')}
      aria-label="Set as thumbnail"
      onPress={() => {
        setThumbnail(
          { assetId: fileId, time: currentTime },
          {
            onSuccess: () => {
              toast(
                <ToastSuccess
                  title={`Thumbnail set at ${renderValue(currentTime, timeFormat, fps)}`}
                />
              );
            }
          }
        );
      }}
    >
      <GalleryThumbnailsIcon size={buttonSize} />
    </Button>
  );
}
