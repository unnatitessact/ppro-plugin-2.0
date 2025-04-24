import { useRef, useState } from "react";

import { cn } from "@nextui-org/react";
import format from "format-duration";
import { motion } from "framer-motion";

import {
  FastForward5SFilled,
  PauseFilled,
  PlayFilled,
  Rewind5SFilled,
} from "@tessact/icons";

import { Button } from "../ui/Button";

import { Slider } from "../review/video/Slider";

interface AudioPlayerProps {
  fileName: string;
  src: string;
  duration: number;
  forceDarkMode?: boolean;
}

export const AudioPlayer = ({
  fileName,
  src,
  duration,
  forceDarkMode,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const variants = {
    play: {
      y: "-50%",
      rotate: 360,
      transition: {
        y: { duration: 0.4 },
        rotate: { duration: 4, ease: "linear", repeat: Infinity },
      },
    },
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 5;
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 5;
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  return (
    <>
      <audio
        src={src}
        hidden
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <div
        className={cn(
          "flex w-full flex-col items-center gap-4 p-6",
          forceDarkMode ? "dark" : ""
        )}
      >
        <div className="noise relative aspect-video w-full max-w-96 overflow-hidden rounded-2xl border border-black/[3%] bg-ds-asset-card-card-bg shadow-physical-asset dark:border-white/5 dark:shadow-physical-asset-dark">
          <motion.div
            animate={isPlaying ? "play" : ""}
            variants={variants}
            className={cn(
              "pointer-events-none absolute left-1/2 top-0 z-10 overflow-hidden rounded-full -translate-x-1/2",
              "aspect-square h-full"
            )}
            style={{
              background: "url(/vinyl.png) no-repeat center center / cover",
            }}
          ></motion.div>
        </div>
        <div className="flex w-full max-w-96 flex-col gap-4 text-center">
          <h3 className="truncate font-medium">{fileName}</h3>
          <div className="flex items-center justify-center gap-2">
            <Button
              isIconOnly
              variant="light"
              onPress={handleRewind}
              aria-label="Rewind 5 seconds"
            >
              <Rewind5SFilled />
            </Button>
            <Button
              isIconOnly
              variant="light"
              onPress={togglePlay}
              aria-label="Play/Pause"
            >
              {isPlaying ? <PauseFilled /> : <PlayFilled />}
            </Button>
            <Button
              isIconOnly
              variant="light"
              onPress={handleFastForward}
              aria-label="Fast forward 5 seconds"
            >
              <FastForward5SFilled />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p
              style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
              className="text-sm"
            >
              {format(currentTime * 1000)}
            </p>
            <Slider
              value={currentTime}
              max={duration}
              setValue={handleSeek}
              thumbHeight="sm"
            />
            <p
              style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
              className="text-sm"
            >
              {format(duration * 1000)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
