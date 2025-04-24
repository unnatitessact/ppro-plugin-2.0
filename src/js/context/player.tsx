import type { MediaPlayerInstance } from '@vidstack/react';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

export interface TimeSelection {
  startTime: number;
  endTime: number;
}

export type TimeCodeType = 'default' | 'hms' | 'frames';
export type Scrub = {
  url?: string;
  height: number;
  width: number;
};

// Make sure social aspect ratios start with 'social-'
export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16';
// | 'social-insta-post'
// | 'social-insta-reel'
// | 'social-yt-video'
// | 'social-yt-short'
// | 'social-twitter-post';

export const hotkeyPlaybackRates = [-8, -4, -2, -1, 2, 4, 8] as const;
export type HotkeyPlaybackRate = (typeof hotkeyPlaybackRates)[number];

export interface PlayerContextValue {
  player: MediaPlayerInstance | null;
  playerState: {
    timeFormat: TimeCodeType;
    setTimeFormat: Dispatch<SetStateAction<TimeCodeType>>;
    // currentTime: number;
    // currentTimeFloored: number;
    duration: number;
    setDuration: Dispatch<SetStateAction<number>>;
    videoDimensions: { width: number; height: number };
    resolution: { width: number; height: number };
    hotkeyPlaybackRate: HotkeyPlaybackRate | null;
    setHotkeyPlaybackRate: Dispatch<SetStateAction<HotkeyPlaybackRate | null>>;

    setResolution: Dispatch<SetStateAction<{ width: number; height: number }>>;
    visualVideoDimensions: { width: number; height: number };
    scrub: Scrub;
    setScrub: Dispatch<SetStateAction<Scrub>>;
    fps: number;
    setFps: Dispatch<SetStateAction<number>>;
    isLoopingEnabled: boolean;
    setIsLoopingEnabled: Dispatch<SetStateAction<boolean>>;
    timeSelection: TimeSelection | null;
    setTimeSelection: Dispatch<SetStateAction<TimeSelection | null>>;
    timeSelectionPreview: TimeSelection | null;
    setTimeSelectionPreview: Dispatch<SetStateAction<TimeSelection | null>>;
    isDraggingTimeSelectionLeftHandle: boolean;
    setIsDraggingTimeSelectionLeftHandle: Dispatch<SetStateAction<boolean>>;
    isDraggingTimeSelectionRightHandle: boolean;
    setIsDraggingTimeSelectionRightHandle: Dispatch<SetStateAction<boolean>>;
    shouldSyncEndTimeWithCurrentTime: boolean;
    setShouldSyncEndTimeWithCurrentTime: Dispatch<SetStateAction<boolean>>;
    resetTimeSelectionStates: () => void;
    aspectRatio: AspectRatio | null;
    setAspectRatio: Dispatch<SetStateAction<AspectRatio | null>>;
  };
  setPlayer(player: MediaPlayerInstance | null): void;
}

export const PlayerContext = createContext<PlayerContextValue>({
  player: null,
  playerState: {
    timeFormat: 'default',
    setTimeFormat: () => {},
    // currentTime: 0,
    // currentTimeFloored: 0,
    duration: 0,
    setDuration: () => {},
    videoDimensions: { width: 0, height: 0 },
    resolution: { width: 0, height: 0 },
    setResolution: () => {},
    visualVideoDimensions: { width: 0, height: 0 },
    scrub: { url: '', height: 240, width: 426 },
    setScrub: () => {},
    fps: 24,
    hotkeyPlaybackRate: null,
    setHotkeyPlaybackRate: () => {},
    setFps: () => {},
    isLoopingEnabled: false,
    setIsLoopingEnabled: () => {},
    timeSelection: null,
    setTimeSelection: () => {},
    timeSelectionPreview: null,
    setTimeSelectionPreview: () => {},
    isDraggingTimeSelectionLeftHandle: false,
    setIsDraggingTimeSelectionLeftHandle: () => {},
    isDraggingTimeSelectionRightHandle: false,
    setIsDraggingTimeSelectionRightHandle: () => {},
    shouldSyncEndTimeWithCurrentTime: true,
    setShouldSyncEndTimeWithCurrentTime: () => {},
    resetTimeSelectionStates: () => {},
    aspectRatio: null,
    setAspectRatio: () => {}
  },
  setPlayer: () => {}
});

export const PlayerContextProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<MediaPlayerInstance | null>(null);
  // This state is used to keep track of the current time of the video.
  // It does not control the video player itself, it is derived from the player's state.
  // Use remote.seek() to change the current time of the video.
  // const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [fps, setFps] = useState<number>(24);

  const [hotkeyPlaybackRate, setHotkeyPlaybackRate] = useState<HotkeyPlaybackRate | null>(null);

  const [timeFormat, setTimeFormat] = useState<TimeCodeType>('default');

  // The size of the <video> element in pixels.
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });

  const [resolution, setResolution] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });

  const [scrub, setScrub] = useState<Scrub>({
    url: '',
    width: 426,
    height: 240
  });

  const [isLoopingEnabled, setIsLoopingEnabled] = useState(false);

  const [timeSelection, setTimeSelection] = useState<TimeSelection | null>(null);

  const [timeSelectionPreview, setTimeSelectionPreview] = useState<TimeSelection | null>(null);

  const [isDraggingTimeSelectionLeftHandle, setIsDraggingTimeSelectionLeftHandle] = useState(false);
  const [isDraggingTimeSelectionRightHandle, setIsDraggingTimeSelectionRightHandle] =
    useState(false);
  const [shouldSyncEndTimeWithCurrentTime, setShouldSyncEndTimeWithCurrentTime] = useState(true);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio | null>(null);

  const resetTimeSelectionStates = useCallback(() => {
    setTimeSelection(null);
    setTimeSelectionPreview(null);
    setIsDraggingTimeSelectionLeftHandle(false);
    setIsDraggingTimeSelectionRightHandle(false);
    setShouldSyncEndTimeWithCurrentTime(true);
  }, []);

  // const isVideoPausedSinceAtEndOfSelection = useRef(false);

  useEffect(() => {
    if (player) {
      player.qualities.switch = 'next'; //  Trigger a quality level switch for next fragment. This could eventually flush already buffered next fragment.
    }
  }, [player]);

  useEffect(() => {
    // Subscribe for updates without triggering renders.

    const mediaWidth = player?.state?.mediaWidth;
    const mediaHeight = player?.state?.mediaHeight;

    setVideoDimensions({ width: mediaWidth ?? 0, height: mediaHeight ?? 0 });

    return player?.subscribe(({ duration, mediaWidth, mediaHeight }) => {
      //   //   // Note: this callback runs every frame when the video is playing
      //   //   setCurrentTime(currentTime);
      setDuration(duration);
      setVideoDimensions({ width: mediaWidth, height: mediaHeight });
      //   //   setIsPlaying(playing);
    });
  }, [player]);

  // Actual video dimensions visually, the <video> element may be larger than this, in pixels.
  const { visualVideoWidth, visualVideoHeight } = useMemo(() => {
    let visualVideoWidth = 0,
      visualVideoHeight = 0;

    if (resolution.width === 0 || resolution.height === 0) {
      return {
        visualVideoWidth,
        visualVideoHeight
      };
    }

    const videoAspectRatio = resolution.width / resolution.height;
    const boxAspectRatio = videoDimensions?.width / videoDimensions?.height;
    if (boxAspectRatio > videoAspectRatio) {
      // case where video is portrait and has empty space on left and right side:
      visualVideoHeight = videoDimensions?.height;
      visualVideoWidth = visualVideoHeight * videoAspectRatio;
    } else {
      // case where video is landscape and has empty space on top and bottom side:
      visualVideoWidth = videoDimensions?.width;
      visualVideoHeight = visualVideoWidth / videoAspectRatio;
    }
    visualVideoWidth = Math.floor(visualVideoWidth);
    visualVideoHeight = Math.floor(visualVideoHeight);
    return {
      visualVideoWidth,
      visualVideoHeight
    };
  }, [resolution.width, resolution.height, videoDimensions?.height, videoDimensions?.width]);

  return (
    <PlayerContext.Provider
      value={{
        player,
        playerState: {
          timeFormat,
          setTimeFormat,
          // currentTime: player?.state?.currentTime ?? 0,
          // currentTimeFloored: Math.floor(player?.state?.currentTime ?? 0),
          duration,
          setDuration,
          videoDimensions,
          resolution,
          setResolution,
          visualVideoDimensions: {
            width: visualVideoWidth,
            height: visualVideoHeight
          },
          hotkeyPlaybackRate,
          setHotkeyPlaybackRate,
          scrub,
          setScrub,
          fps,
          setFps,
          isLoopingEnabled,
          setIsLoopingEnabled,
          timeSelection,
          setTimeSelection,
          timeSelectionPreview,
          setTimeSelectionPreview,
          isDraggingTimeSelectionLeftHandle,
          setIsDraggingTimeSelectionLeftHandle,
          isDraggingTimeSelectionRightHandle,
          setIsDraggingTimeSelectionRightHandle,
          shouldSyncEndTimeWithCurrentTime,
          setShouldSyncEndTimeWithCurrentTime,
          resetTimeSelectionStates,
          aspectRatio,
          setAspectRatio
        },
        setPlayer
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};
