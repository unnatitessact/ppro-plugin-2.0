import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";

import useAuth from "../../hooks/useAuth";

// import dynamic from 'next/dynamic'; // Removed dynamic import

import AuthContext from "../../context/AuthContext"; // Changed to default import for Context
import { useDetection } from "../../context/detection"; // Fixed path
import { Scrub, usePlayerContext } from "../../context/player"; // Fixed path
// import { useOthers, useSelf, useUpdateMyPresence } from '../../liveblocks.config'; // Commented out - invalid path
import { ClientSideSuspense } from "@liveblocks/react";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { useMediaRemote } from "@vidstack/react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// import { VideoPlayer } from '../ui/video-player/VideoPlayer'; // Commented out - invalid path

// import ColorPicker from '@/components/review/color-picker/ColorPicker'; // Commented out - non-existent path
// import CursorsPanel from '@/components/review/cursors-panel/CursorsPanel'; // Commented out - non-existent path
// import MarkersPanel from '@/components/review/markers-panel/MarkersPanel'; // Commented out - non-existent path

import { useSubtitlesQuery } from "../../api-integration/queries/video"; // Fixed path

import { useReviewStore } from "../../stores/review-store"; // Fixed path
import { useSearchActionsStore } from "../../stores/search-actions-store"; // Fixed path

import { MOBILE_MEDIA_QUERY } from "../../utils/responsiveUtils"; // Fixed path

// Removed dynamic imports for non-existent review components
// const MarkersCanvas = dynamic(() => import('@/components/review/markers-canvas/MarkersCanvas'), {
//   ssr: false
// });
// const LiveMarkers = dynamic(() => import('@/components/review/markers-canvas/LiveMarkers'), {
//   ssr: false
// });
// const ShowMarkersCanvas = dynamic(
//   () => import('@/components/review/markers-canvas/ShowMarkersCanvas'),
//   { ssr: false }
// );

const VideoAssetPlayer = ({
  isReviewTab,
  isDetectionTab,
  src,
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
  const showCanvas = false; // Defaulted as review components are commented out
  // !isDetectionTab &&
  // (isLiveCanvasEnabled ||
  //   isMarkersVisible ||
  //   (selectedComment && selectedComment?.markers && selectedComment?.markers?.length > 0));

  const detectionTimeRanges = useMemo(() => {
    const playingEntityPopulated = selectedEntitiesPopulated.find(
      (entity) => entity.id === playingEntity
    );
    if (playingEntityPopulated) {
      return playingEntityPopulated?.timestamps?.map(
        (range: { start_time: number; end_time: number }) => ({
          startTime: range?.start_time,
          endTime: range?.end_time,
        })
      );
    }
  }, [playingEntity, selectedEntitiesPopulated]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full bg-ds-videoplayer-controls-bg",
        isMobile ? "rounded-none" : "rounded-2xl"
      )}
    >
      {/* <VideoPlayer // Commented out usage
        // Duration should always be the full video duration, not the clip duration
        // Don't set duration if it's a clip
        duration={clipStartTime === undefined && clipEndTime === undefined ? duration : undefined}
        aspectRatio={`${videoWidth}/${videoHeight}`}
        load="eager"
        src={src}
        preload="auto"
        controlsVariant={
          isDetectionTab ? 'detection' : isMobile ? 'commenting-mobile' : 'commenting'
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
      /> */}
      <Suspense fallback={<></>}>
        {/* {showCanvas && ( // Commented out usage of review components
          <div
            className="absolute left-0 top-0 w-full"
            style={{
              height
            }}
          >
            <div className="relative h-full w-full" ref={containerRef}>
              {createPortal(
                <div
                  className="z-100 flex h-full w-full"
                  style={{
                    position: 'absolute',
                    height: containerRef.current?.clientHeight,
                    width: containerRef.current?.clientWidth,
                    left: containerRef.current?.getBoundingClientRect().left,
                    top: containerRef.current?.getBoundingClientRect().top
                  }}
                >
                  <ColorPicker showColorPicker={showColorPicker} />
                  <MarkersPanel
                    setShowColorPicker={setShowColorPicker}
                    isMarkersVisible={isMarkersVisible}
                    setIsMarkersVisible={setIsMarkersVisible}
                  />
                  <ClientSideSuspense fallback={<></>}>
                    {() => (
                      <CursorsPanel videoHeight={videoHeight} videoWidth={videoWidth}>
                        <LiveMarkers videoWidth={videoWidth} videoHeight={videoHeight} />
                        <AnimatePresence>
                          {isMarkersVisible && (
                            <MarkersCanvas videoWidth={videoWidth} videoHeight={videoHeight} />
                          )}
                        </AnimatePresence>
                        <ShowMarkersCanvas videoWidth={videoWidth} videoHeight={videoHeight} />
                      </CursorsPanel>
                    )}
                  </ClientSideSuspense>
                </div>,
                document.body
              )}
            </div>
          </div>
        )} */}
      </Suspense>
      <ClientSideSuspense fallback={<></>}>
        {() => (
          <LivePresencePlayerStateBridge
            setIsLiveCanvasEnabled={setIsLiveCanvasEnabled}
          />
        )}
      </ClientSideSuspense>
    </div>
  );
};

export default VideoAssetPlayer;

export const LivePresencePlayerStateBridge = ({
  setIsLiveCanvasEnabled,
}: {
  setIsLiveCanvasEnabled: Dispatch<SetStateAction<boolean>>;
}) => {
  const authContext = useContext(AuthContext); // Use useContext
  const session = authContext?.session; // Access session from context value
  // Update presence with the current time of the video
  // const updateMyPresence = useUpdateMyPresence(); // Commented out
  const { player } = usePlayerContext();
  const remote = useMediaRemote(player);

  // // Presence state
  // const self = useSelf(); // Commented out
  // const others = useOthers(); // Commented out

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (player && player.currentTime && others && self) { // Commented out checks
  //       updateMyPresence({
  //         currentTime: player.currentTime
  //       });
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [player, updateMyPresence, self, others]); // Commented out dependencies

  useEffect(() => {
    if (leader?.presence) {
      remote?.seek(leader.presence.currentTime);
      if (leader.presence.isPlaying) {
        remote?.play();
      } else {
        remote?.pause();
      }
    }
  }, [leader?.presence?.currentTime, leader?.presence?.isPlaying]);

  useEffect(() => {
    if (
      (liveDrawings && liveDrawings?.length > 0) ||
      (cursors && cursors.length > 0) ||
      !!liveCurrentShape
    ) {
      setIsLiveCanvasEnabled(true);
    } else {
      setIsLiveCanvasEnabled(false);
    }
  }, [liveDrawings, cursors, liveCurrentShape]);

  // useEffect(() => {
  //   return player?.subscribe(({ currentTime, playing }) => {
  //     updateMyPresence({
  //       currentTime,
  //       isPlaying: playing,
  //     });
  //   });
  // }, [player, updateMyPresence]);

  return <></>;
};
