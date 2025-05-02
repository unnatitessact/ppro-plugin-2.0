import { useEffect, useMemo, useState } from "react";

import useAuth from "@/hooks/useAuth";
// import { useAuth } from "@/context/auth";
import { usePlayerContext } from "@/context/player";
import { useElementSize } from "@mantine/hooks";
import { Spinner } from "@nextui-org/react";
import { Captions, Gesture, useMediaState } from "@vidstack/react";

import { CommentingMobileVideoControls } from "@/components/ui/video-player/CommentingMobileVideoControls";
import { DetectionVideoControls } from "@/components/ui/video-player/DetectionVideoControls";
import { MinimalOutsideVideoControls } from "@/components/ui/video-player/MinimalOutsideControls";
import { OverlayVideoControls } from "@/components/ui/video-player/OverlayVideoControls";
import { ShareCommentingVideoControls } from "@/components/ui/video-player/ShareCommentingVideoControls";
import { TaggingVideoControls } from "@/components/ui/video-player/TaggingVideoControls";

import { cn } from "@nextui-org/react";

// import { cn } from '@/components/tiptap/lib/utils';

import { useWorkspace } from "@/hooks/useWorkspace";

import { useShareStore } from "@/stores/share-store";

import { CommentingVideoControls } from "./CommentingVideoControls";
import { CroppingVideoControls } from "./CroppingVideoControls";
import { SearchVideoControls } from "./SearchVideoControls";
import { ControlsVariants } from "./VideoPlayer";

export interface VideoLayoutProps {
  buttonSize?: number;
  controlsVariant?: ControlsVariants;
}

export function VideoLayout({
  buttonSize = 20,
  controlsVariant = "default",
}: VideoLayoutProps) {
  const isFullScreen = useMediaState("fullscreen");
  if (isFullScreen) return <OverlayVideoControls buttonSize={buttonSize} />;

  switch (controlsVariant) {
    case "search":
      return <SearchVideoControls />;
    case "commenting-mobile":
      return <CommentingMobileVideoControls buttonSize={buttonSize} />;

    case "commenting":
      return <CommentingVideoControls buttonSize={buttonSize} />;
    case "tagging":
      return <TaggingVideoControls buttonSize={buttonSize} />;
    case "detection":
      return <DetectionVideoControls buttonSize={buttonSize} />;
    case "share-commenting":
      return <ShareCommentingVideoControls buttonSize={buttonSize} />;
    case "none":
      return null;
    case "cropping":
      return <CroppingVideoControls />;
    case "minimal-outside":
      return <MinimalOutsideVideoControls />;
    default:
      return <OverlayVideoControls buttonSize={buttonSize} />;
  }
}

export function Gestures() {
  return (
    <>
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      {/* <Gesture
        className="absolute left-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute right-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:10"
      /> */}
    </>
  );
}

export function BufferingIndicator() {
  return (
    <div className="invisible absolute left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2 group-data-[buffering]:visible group-data-[stream-type='unknown']:visible ">
      <Spinner size="lg" color="white" />
    </div>
  );
}

export function Subtitles({ className }: { className?: string }) {
  const {
    playerState: {
      videoDimensions: { height },
    },
  } = usePlayerContext();

  return (
    <Captions
      className={cn(
        "absolute left-1/2 -translate-x-1/2 -translate-y-full transform aria-[hidden=true]:hidden [&>[data-part=cue-display]]:rounded-xl  [&>[data-part=cue-display]]:bg-black/15 [&>[data-part=cue-display]]:px-2 [&>[data-part=cue-display]]:py-1 [&>[data-part=cue-display]]:backdrop-blur-sm",
        className
      )}
      style={{
        top: `${height - 100}px`,
      }}
    />
  );
}

export function WatermarkWorkspace() {
  const { auth } = useAuth();
  const { workspace } = useWorkspace();

  return (
    <WatermarkPresentational>
      <>
        <div>{auth?.user?.email}</div>
        <div>
          {auth?.user?.profile?.first_name} {auth?.user?.profile?.last_name}
        </div>
        <div>{workspace?.title}</div>
      </>
    </WatermarkPresentational>
  );
}

export function WaterMarkSharedLink() {
  const { shareData, name, email } = useShareStore();

  const { auth } = useAuth();

  const user = useMemo(() => {
    if (auth && shareData?.is_public) {
      return {
        name: `${auth?.user?.profile?.first_name} ${auth?.user?.profile?.last_name}`,
        email: auth?.user?.email,
      };
    }
    return {
      name,
      email,
    };
  }, [name, email, shareData?.is_public, auth]);

  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch IP");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching IP address:", error);
      }
    };

    getIpAddress();

    return () => controller.abort();
  }, []);

  return (
    <WatermarkPresentational>
      <>
        {ipAddress && <div>{ipAddress}</div>}
        {shareData?.short_url && <div>{shareData.short_url}</div>}
        {user?.name || user?.email ? (
          <div>{[user?.name, user?.email].filter(Boolean).join(" ")}</div>
        ) : null}
      </>
    </WatermarkPresentational>
  );
}

export function WatermarkPresentational({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ref, height, width } = useElementSize();

  const playing = useMediaState("playing");

  const {
    playerState: { visualVideoDimensions },
  } = usePlayerContext();

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const [fontSize, setFontSize] = useState(0);

  useEffect(() => {
    setFontSize(Math.max(0, 0.0175 * visualVideoDimensions?.width));
  }, [visualVideoDimensions?.width]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playing) return;

      // Generate random percentages between 0-100
      const topPercent = Math.random() * 100;
      const leftPercent = Math.random() * 100;

      // Calculate the offset percentages based on the watermark size relative to container
      const offsetTopPercent = Math.max(
        0,
        topPercent - (height / visualVideoDimensions?.height) * 100
      );
      const offsetLeftPercent = Math.max(
        0,
        leftPercent - (width / visualVideoDimensions?.width) * 100
      );

      setTop(offsetTopPercent);
      setLeft(offsetLeftPercent);
    }, 5000);

    if (!playing) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    playing,
    height,
    width,
    visualVideoDimensions?.height,
    visualVideoDimensions?.width,
  ]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: visualVideoDimensions?.width,
        height: visualVideoDimensions?.height,
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="pointer-events-none absolute z-100 font-medium text-ds-text-secondary/60"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            fontSize: `${fontSize}px`,
          }}
        >
          <div className="flex flex-col" ref={ref}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AspectRatioIndicator() {
  const {
    playerState: { aspectRatio, visualVideoDimensions },
  } = usePlayerContext();

  const { aspectWidth, aspectHeight } = useMemo(() => {
    if (!aspectRatio) return { aspectWidth: null, aspectHeight: null };
    const [width, height] = aspectRatio.split(":").map(Number);
    return { aspectWidth: width, aspectHeight: height };
  }, [aspectRatio]);

  if (aspectWidth === null || aspectHeight === null) return null;

  const videoAspectRatio =
    visualVideoDimensions?.width / visualVideoDimensions?.height;
  const indicatorAspectRatio = aspectWidth / aspectHeight;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: visualVideoDimensions?.width + 4,
        height: visualVideoDimensions?.height + 4,
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 left-1/2 top-1/2  shadow-[0_0_10px_1000px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2"
          style={{
            aspectRatio: `${aspectWidth}/${aspectHeight}`,
            width: videoAspectRatio > indicatorAspectRatio ? "auto" : "100%",
            height: videoAspectRatio > indicatorAspectRatio ? "100%" : "auto",
          }}
        />
      </div>
    </div>
  );
}
