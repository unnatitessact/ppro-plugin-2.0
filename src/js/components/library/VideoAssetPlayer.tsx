import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useAuth from "@/hooks/useAuth";

// import dynamic from 'next/dynamic';

// import { useAuth } from '@/context/auth';
import { useDetection } from "@/context/detection";
import { Scrub, usePlayerContext } from "@/context/player";
// import {
//   useOthers,
//   useSelf,
//   useUpdateMyPresence,
// } from "../../../../liveblocks.config";
// import { ClientSideSuspense } from "@liveblocks/react";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { useMediaRemote } from "@vidstack/react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// import { Loader } from '@tessact/icons';

import { VideoPlayer } from "@/components/ui/video-player/VideoPlayer";

import ColorPicker from "@/components/review/color-picker/ColorPicker";
import CursorsPanel from "@/components/review/cursors-panel/CursorsPanel";
import MarkersPanel from "@/components/review/markers-panel/MarkersPanel";

import { useSubtitlesQuery } from "@/api-integration/queries/video";

import { useReviewStore } from "@/stores/review-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import MarkersCanvas from "../review/markers-canvas/MarkersCanvas";

import LiveMarkers from "@/components/review/markers-canvas/LiveMarkers";
import ShowMarkersCanvas from "@/components/review/markers-canvas/ShowMarkersCanvas";
// const MarkersCanvas = dynamic(
//   () => import("@/components/review/markers-canvas/MarkersCanvas"),
//   {
//     ssr: false,
//   }
// );
// const LiveMarkers = dynamic(
//   () => import("@/components/review/markers-canvas/LiveMarkers"),
//   {
//     ssr: false,
//   }
// );
// const ShowMarkersCanvas = dynamic(
//   () => import("@/components/review/markers-canvas/ShowMarkersCanvas"),
//   { ssr: false }
// );

const VideoAssetPlayer = ({
  isReviewTab,
  isDetectionTab,
  src,
  isHLSReady,
  fps,
  resolution,
  scrub,
  clipStartTime,
  clipEndTime,
  duration,
  assetId,
  isConnectedFolderAsset,
  fileExtension,
}: {
  assetId: string;
  isReviewTab: boolean;
  isDetectionTab: boolean;
  src: string;
  isHLSReady: boolean;
  fps?: number;
  resolution: { width: number; height: number };
  scrub: Scrub;
  clipStartTime?: number;
  clipEndTime?: number;
  duration?: number;
  isConnectedFolderAsset?: boolean;
  fileExtension?: string;
}) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const { isMarkersVisible, setIsMarkersVisible } = useSearchActionsStore();
  const { selectedComment } = useReviewStore();

  const {
    playerState: {
      videoDimensions: { width, height },
      setResolution,
      setFps,
      setScrub,
      setDuration,
    },
  } = usePlayerContext();

  const { data: subtitles } = useSubtitlesQuery(assetId);

  useEffect(() => {
    setFps(fps ?? 24);
  }, [fps, setFps]);

  useEffect(() => {
    if (duration && clipStartTime === undefined && clipEndTime === undefined) {
      // Only set duration from backend if it's not a clip
      // Since backend returns clip duration, but vidstack expects full video duration
      // Vidstack will set duration if we don't set it here
      setDuration(duration);
    }
  }, [duration, setDuration, clipStartTime, clipEndTime]);

  useEffect(() => {
    setScrub(scrub);
  }, [scrub, setScrub]);

  useEffect(() => {
    setResolution({
      height: resolution.height,
      width: resolution.width,
    });
  }, [resolution, setResolution]);

  // Actual video dimensions visually, the <video> element may be larger than this, in pixels.
  const { videoWidth, videoHeight } = useMemo(() => {
    let videoWidth = 0,
      videoHeight = 0;
    const videoAspectRatio = resolution.width / resolution.height;
    const boxAspectRatio = width / height;
    if (boxAspectRatio > videoAspectRatio) {
      // case where video is portrait and has empty space on left and right side:
      videoHeight = height;
      videoWidth = videoHeight * videoAspectRatio;
    } else {
      // case where video is landscape and has empty space on top and bottom side:
      videoWidth = width;
      videoHeight = videoWidth / videoAspectRatio;
    }
    videoWidth = Math.floor(videoWidth);
    videoHeight = Math.floor(videoHeight);
    return {
      videoWidth,
      videoHeight,
    };
  }, [width, height, resolution.width, resolution.height]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { playingEntity, selectedEntitiesPopulated } = useDetection();

  const [isLiveCanvasEnabled, setIsLiveCanvasEnabled] = useState(false);
  const showCanvas =
    !isDetectionTab &&
    (isLiveCanvasEnabled ||
      isMarkersVisible ||
      (selectedComment &&
        selectedComment?.markers &&
        selectedComment?.markers?.length > 0));

  const detectionTimeRanges = useMemo(() => {
    const playingEntityPopulated = selectedEntitiesPopulated.find(
      (entity) => entity.id === playingEntity
    );
    if (playingEntityPopulated) {
      return playingEntityPopulated?.timestamps?.map((range) => ({
        startTime: range?.start_time,
        endTime: range?.end_time,
      }));
    }
  }, [playingEntity, selectedEntitiesPopulated]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full bg-ds-videoplayer-controls-bg",
        isMobile ? "rounded-none" : "rounded-2xl"
      )}
    >
      <VideoPlayer
        // Duration should always be the full video duration, not the clip duration
        // Don't set duration if it's a clip
        duration={
          clipStartTime === undefined && clipEndTime === undefined
            ? duration
            : undefined
        }
        aspectRatio={`${videoWidth}/${videoHeight}`}
        load="eager"
        src={src}
        isHLSReady={isHLSReady}
        preload="auto"
        controlsVariant={
          isDetectionTab
            ? "detection"
            : isMobile
            ? "commenting-mobile"
            : "commenting"
        }
        enableTimeSelection={isReviewTab ? true : false}
        keyDisabled={false}
        timeRanges={detectionTimeRanges}
        clipStartTime={clipStartTime}
        clipEndTime={clipEndTime}
        subtitles={subtitles ?? []}
        disableCacheBusting={isConnectedFolderAsset}
        fileExtension={fileExtension}
        onError={(error) => {
          console.log({ error });
        }}
      />
      <Suspense fallback={<></>}>
        {showCanvas && (
          <div
            className="absolute left-0 top-0 w-full"
            style={{
              height,
            }}
          >
            <div className="relative h-full w-full" ref={containerRef}>
              {createPortal(
                <div
                  className="z-100 flex h-full w-full"
                  style={{
                    position: "absolute",
                    height: containerRef.current?.clientHeight,
                    width: containerRef.current?.clientWidth,
                    left: containerRef.current?.getBoundingClientRect().left,
                    top: containerRef.current?.getBoundingClientRect().top,
                  }}
                >
                  <ColorPicker showColorPicker={showColorPicker} />
                  <MarkersPanel
                    setShowColorPicker={setShowColorPicker}
                    isMarkersVisible={isMarkersVisible}
                    setIsMarkersVisible={setIsMarkersVisible}
                  />
                  {/* <ClientSideSuspense fallback={<></>}>
                    {() => (
                      <CursorsPanel
                        videoHeight={videoHeight}
                        videoWidth={videoWidth}
                      >
                        <LiveMarkers
                          videoWidth={videoWidth}
                          videoHeight={videoHeight}
                        />
                        <AnimatePresence>
                          {isMarkersVisible && (
                            <MarkersCanvas
                              videoWidth={videoWidth}
                              videoHeight={videoHeight}
                            />
                          )}
                        </AnimatePresence>
                        <ShowMarkersCanvas
                          videoWidth={videoWidth}
                          videoHeight={videoHeight}
                        />
                      </CursorsPanel>
                    )}
                  </ClientSideSuspense> */}
                </div>,
                document.body
              )}
            </div>
          </div>
        )}
      </Suspense>
      {/* <ClientSideSuspense fallback={<></>}>
        {() => (
          <LivePresencePlayerStateBridge
            setIsLiveCanvasEnabled={setIsLiveCanvasEnabled}
          />
        )}
      </ClientSideSuspense> */}
    </div>
  );
};

export default VideoAssetPlayer;

// export const LivePresencePlayerStateBridge = ({
//   setIsLiveCanvasEnabled,
// }: {
//   setIsLiveCanvasEnabled: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const { auth } = useAuth();
//   // const { session } = useAuth();
//   // Update presence with the current time of the video
//   const updateMyPresence = useUpdateMyPresence();
//   const { player } = usePlayerContext();
//   const remote = useMediaRemote(player);
//   const leaderId = useSelf((self) => self.presence.leaderId);
//   const leader = useOthers(
//     (others) => others.filter((other) => other.presence.id === leaderId)?.[0]
//   );

//   const cursors = useOthers((others) =>
//     others
//       .filter(
//         (other) =>
//           (!!leaderId &&
//             (other.presence.leaderId === leaderId ||
//               other.presence.id === leaderId)) ||
//           other.presence.leaderId === auth?.user.id
//       )
//       .map((other) => other.presence)
//   );

//   const leaderPresence = useOthers(
//     (others) => others.find((other) => other.presence.id === leaderId)?.presence
//   );

//   // @ts-ignore
//   const liveDrawings = leaderPresence?.drawings;
//   // @ts-ignore
//   const liveCurrentShape = leaderPresence?.currentShape;

//   useEffect(() => {
//     // Keep checking every 1 second if leader still exists in the room,
//     // Else set leaderId as null
//     // This handles the case where leader leaves the room
//     // Update self presence when others changes
//     let interval: NodeJS.Timeout;
//     if (leaderId) {
//       interval = setInterval(() => {
//         if (!leader) {
//           updateMyPresence({
//             leaderId: null,
//           });
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [leader]);

//   useEffect(() => {
//     if (leader?.presence) {
//       remote?.seek(leader.presence.currentTime);
//       if (leader.presence.isPlaying) {
//         remote?.play();
//       } else {
//         remote?.pause();
//       }
//     }
//   }, [leader?.presence?.currentTime, leader?.presence?.isPlaying]);

//   useEffect(() => {
//     if (
//       (liveDrawings && liveDrawings?.length > 0) ||
//       (cursors && cursors.length > 0) ||
//       !!liveCurrentShape
//     ) {
//       setIsLiveCanvasEnabled(true);
//     } else {
//       setIsLiveCanvasEnabled(false);
//     }
//   }, [liveDrawings, cursors, liveCurrentShape]);

//   useEffect(() => {
//     return player?.subscribe(({ currentTime, playing }) => {
//       updateMyPresence({
//         currentTime,
//         isPlaying: playing,
//       });
//     });
//   }, [player, updateMyPresence]);

//   return <></>;
// };
