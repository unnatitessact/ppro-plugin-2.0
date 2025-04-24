import { createContext, ReactNode, useContext, useState } from 'react';

export type TimeCodeType = 'default' | 'hms' | 'frames';

interface VideoContextType {
  // change action types
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
  goToTime: number | null;
  setGoToTime: (percentage: number) => void;
  prevVolume: number;
  setPrevVolume: (prevVolume: number) => void;
  hideTimeline: boolean;
  setHideTimeline: (hideTimeline: boolean) => void;
  timecode: TimeCodeType;
  setTimecode: (timecode: TimeCodeType) => void;
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
  toggleFullScreen: () => void;
}

export const VideoContext = createContext<VideoContextType>({
  isPlaying: false,
  setIsPlaying: () => {},
  volume: 100,
  setVolume: () => {},
  duration: 0,
  setDuration: () => {},
  currentTime: 0,
  setCurrentTime: () => {},
  goToTime: null,
  setGoToTime: () => {},
  prevVolume: 0,
  setPrevVolume: () => {},
  hideTimeline: false,
  setHideTimeline: () => {},
  timecode: 'default',
  setTimecode: () => {},
  isFullScreen: false,
  setIsFullScreen: () => {},
  toggleFullScreen: () => {}
});

export const VideoContextProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [goToTime, setGoToTime] = useState(0);
  const [prevVolume, setPrevVolume] = useState(0);
  const [hideTimeline, setHideTimeline] = useState(false);
  const [timecode, setTimecode] = useState<TimeCodeType>('default');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  return (
    <VideoContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        setVolume,
        volume,
        duration,
        setDuration,
        currentTime,
        setCurrentTime,
        goToTime,
        setGoToTime,
        prevVolume,
        setPrevVolume,
        hideTimeline,
        setHideTimeline,
        timecode,
        setTimecode,
        isFullScreen,
        setIsFullScreen,
        toggleFullScreen
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};
