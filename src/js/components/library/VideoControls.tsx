import React from "react";

import { useVideo } from "../../context/video";
import { useIdle } from "@mantine/hooks";
import format from "format-duration";
import { motion } from "framer-motion";

import {
  ArrowsDiagonalOut,
  FastForwardFilled,
  MuteFilled,
  PauseFilled,
  PlayFilled,
  RewindFilled,
  VolumeFullFilled,
} from "@tessact/icons";

import { Button } from "../ui/Button";

// import { Slider } from '@/components/review/video/Slider';

const VideoControls = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    setIsPlaying,
    setGoToTime,
    toggleFullScreen,
    volume,
    setPrevVolume,
    setVolume,
    prevVolume,
  } = useVideo();

  const isIdle = useIdle(3000, { initialState: false });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isIdle ? 0 : 1 }}
      className="absolute bottom-5 left-1/2 z-50 flex w-5/6 min-w-96 max-w-lg flex-col gap-4 rounded-2xl bg-[#4F4F5C]/20 px-5 py-4 backdrop-blur-md -translate-x-1/2"
    >
      <div className="grid grid-cols-3 items-center">
        {/* <div>
          <VolumeFullFilled size={20} />
        </div> */}
        <div className="group flex items-center gap-1">
          <Button
            variant="light"
            color="transparent"
            size="sm"
            isIconOnly
            onPress={() => {
              if (volume === 0) {
                setVolume(prevVolume);
              } else {
                setPrevVolume(volume);
                setVolume(0);
              }
            }}
            aria-label="Mute/Unmute"
          >
            {volume === 0 ? (
              <MuteFilled size={20} />
            ) : (
              <VolumeFullFilled size={20} />
            )}
          </Button>

          {/* <div className="w-20 opacity-0 transition group-hover:opacity-100">
            <Slider thumbHeight="sm" max={100} value={volume} setValue={setVolume} />
          </div> */}
        </div>
        <div className="flex items-center justify-center gap-4">
          <RewindFilled
            size={20}
            className="cursor-pointer"
            onClick={() => setGoToTime(currentTime - 5)}
          />
          {isPlaying ? (
            <PauseFilled
              size={20}
              onClick={() => setIsPlaying(false)}
              className="cursor-pointer"
            />
          ) : (
            <PlayFilled
              size={20}
              onClick={() => setIsPlaying(true)}
              className="cursor-pointer"
            />
          )}
          <FastForwardFilled
            size={20}
            className="cursor-pointer"
            onClick={() => setGoToTime(currentTime + 5)}
          />
        </div>
        <div className="flex items-center justify-end gap-4 ">
          <ArrowsDiagonalOut
            size={20}
            onClick={toggleFullScreen}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-12 text-xs">
          {format(currentTime * 1000, { leading: true })}
        </p>
        {/* <div className="flex-1">
          <Slider
            value={currentTime}
            setValue={(value) => setGoToTime(value)}
            max={duration}
            thumbHeight="sm"
          />
        </div> */}
        <p className="min-w-12 text-right text-xs">
          {format(duration * 1000, { leading: true })}
        </p>
      </div>
    </motion.div>
  );
};

export default VideoControls;
