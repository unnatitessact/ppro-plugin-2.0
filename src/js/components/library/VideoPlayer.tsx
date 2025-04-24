import { useEffect, useRef, useState } from "react";

import { useIdle, useInViewport, useMergedRef } from "@mantine/hooks";
import format from "format-duration";
import { motion } from "framer-motion";

import {
  ArrowsDiagonalOut,
  FastForwardFilled,
  // DotGrid1X3Horizontal,
  PauseFilled,
  PlayFilled,
  RewindFilled,
  VolumeFullFilled,
} from "@tessact/icons";

import { Slider } from "../ui/Slider";

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setTimeElapsed(videoRef.current.currentTime);
      setProgress(videoRef.current.currentTime / duration);
    }
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current?.requestFullscreen();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const isIdle = useIdle(3000, { initialState: false });
  const { ref, inViewport } = useInViewport();

  const mergedRef = useMergedRef(ref, videoRef);

  useEffect(() => {
    if (!inViewport) {
      videoRef.current?.pause();
    }
  }, [inViewport]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <video
        src={src}
        ref={mergedRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="h-full max-h-full w-full max-w-full"
      />
      <motion.div
        initial={{ left: "50%", translateX: "-50%" }}
        animate={{ opacity: isIdle ? 0 : 1 }}
        className="absolute bottom-5 flex w-5/6 min-w-96 max-w-lg flex-col gap-4 rounded-2xl bg-[#4F4F5C]/20 px-5 py-4 backdrop-blur-md"
      >
        <div className="grid grid-cols-3 items-center">
          <div>
            <VolumeFullFilled size={20} />
          </div>
          <div className="flex items-center justify-center gap-4">
            <RewindFilled size={20} />
            {isPlaying ? (
              <PauseFilled size={20} onClick={togglePlay} />
            ) : (
              <PlayFilled size={20} onClick={togglePlay} />
            )}
            <FastForwardFilled size={20} />
          </div>
          <div className="flex items-center justify-end gap-4 ">
            <ArrowsDiagonalOut
              size={20}
              onClick={toggleFullScreen}
              className="cursor-pointer"
            />
            {/* <DotGrid1X3Horizontal size={20} /> */}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-12 text-xs">
            {format(timeElapsed * 1000, { leading: true })}
          </p>
          <div className="flex-1">
            <Slider
              minValue={0}
              maxValue={1}
              value={progress}
              step={0.01}
              size="sm"
              hideThumb
              onChange={(value) => {
                setProgress(value as number);
              }}
              onChangeEnd={(value) => {
                if (videoRef.current) {
                  const timeToGo = duration * (value as number);
                  videoRef.current.currentTime = timeToGo;
                }
              }}
              classNames={{
                filler: "bg-white",
                track: "bg-white/25",
              }}
            />
          </div>
          <p className="min-w-12 text-right text-xs">
            {format(duration * 1000, { leading: true })}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
