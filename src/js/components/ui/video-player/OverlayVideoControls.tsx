// import { useParams, useSearchParams } from 'next/navigation';

import { useParams, useSearchParams } from "react-router-dom";

import { Controls, useMediaState } from "@vidstack/react";
import formatDuration from "format-duration";

import { CaptionsDropdown } from "@/components/ui/video-player/CommentingVideoControls";
import {
  BufferingIndicator,
  Gestures,
  Subtitles,
} from "@/components/ui/video-player/VideoLayout";

import * as Buttons from "./VideoButtons";
import * as Sliders from "./VideoSlider";

export const OverlayVideoControls = ({
  buttonSize,
}: {
  buttonSize: number;
}) => {
  const currentTime = useMediaState("currentTime"),
    duration = useMediaState("duration");

  return (
    <>
      <Gestures />
      <BufferingIndicator />
      <Subtitles className="-translate-y-[10vh]" />
      <Controls.Root className="absolute bottom-5 left-1/2 z-50 flex w-5/6 min-w-96 max-w-lg flex-col gap-1 rounded-2xl bg-[#4F4F5C]/20 px-5 py-4 text-white opacity-0 backdrop-blur-md transition-opacity dark -translate-x-1/2 media-controls:opacity-100">
        <div className="h-full w-full px-5 py-4" id="overlay-controls-root">
          <Controls.Group className="grid grid-cols-3 items-center">
            <Controls.Group className="group flex items-center gap-1">
              <Buttons.Mute
                buttonSize={buttonSize}
                disableColorToggleOnThemeChange
              />
              <Sliders.Volume disableColorToggleOnThemeChange />
            </Controls.Group>
            <Controls.Group className="flex items-center justify-center gap-4">
              <Buttons.SeekBackward
                buttonSize={buttonSize}
                disableColorToggleOnThemeChange
              />

              <Buttons.Play
                buttonSize={buttonSize}
                disableColorToggleOnThemeChange
              />
              <Buttons.SeekForward
                buttonSize={buttonSize}
                disableColorToggleOnThemeChange
              />
            </Controls.Group>
            <Controls.Group className="flex items-center justify-end gap-4">
              <ReviewPageFullscreenCaptions />
              <Buttons.Fullscreen
                buttonSize={buttonSize}
                disableColorToggleOnThemeChange
              />
            </Controls.Group>
          </Controls.Group>
          <Controls.Group className="flex items-center justify-between gap-4">
            <p className="min-w-12 text-xs">
              {formatDuration(currentTime * 1000, { leading: true })}
            </p>
            <Controls.Group className="flex-1">
              <Sliders.Time />
            </Controls.Group>
            <p className="min-w-12 text-right text-xs">
              {formatDuration(duration * 1000, { leading: true })}
            </p>
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
};

const ReviewPageFullscreenCaptions = () => {
  const { assetId } = useParams() as { assetId: string };
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get("version");
  const fileId = versionId ?? assetId;

  if (!fileId) return null;
  return (
    <Controls.Group>
      <CaptionsDropdown
        fileId={fileId}
        buttonClassname="text-white"
        disablePortal
      />
    </Controls.Group>
  );
};
