import React, { useCallback, useEffect, useMemo } from "react";

// import { useAuth } from '@/context/auth';
import useAuth from "@/hooks/useAuth";
// import { useComments } from '@/context/comments';
import {
  LiveShape,
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "../../../../../liveblocks.config";
import { useElementSize } from "@mantine/hooks";
import { Layer, Stage } from "react-konva";

import BrushStroke from "@/components/review/markers-canvas/BrushStroke";
import Ellipse from "@/components/review/markers-canvas/Ellipse";
import PointyArrow from "@/components/review/markers-canvas/PointyArrow";
import { Shape, ShapePreview } from "@/components/review/markers-canvas/shapes";

import { useReviewStore } from "@/stores/review-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

import { convertShapePercentageToPoint } from "@/utils/cursorsUtils";

const LiveMarkers = ({
  videoWidth,
  videoHeight,
}: {
  videoWidth: number;
  videoHeight: number;
}) => {
  const { drawnShapes } = useReviewStore();
  const {
    ref: containerRef,
    width: boxWidth,
    height: boxHeight,
  } = useElementSize();
  const { auth } = useAuth();
  const user = auth?.user;
  const color = user?.profile?.color || "red";

  const { isMarkersVisible } = useSearchActionsStore();

  const updateMyPresence = useUpdateMyPresence();
  useEffect(() => {
    updateMyPresence({
      // @ts-ignore
      drawings: isMarkersVisible
        ? (drawnShapes.map((shape) => ({
            ...shape,
            color: color,
          })) as LiveShape[])
        : [],
    });
  }, [drawnShapes, isMarkersVisible, updateMyPresence, color]);

  const leaderId = useSelf((self) => self.presence.id);
  // const followersIds = useSelf((self) => self.presence.followers.map((follower) => follower.id));
  const leaderPresence = useOthers(
    (others) => others.find((other) => other.presence.id === leaderId)?.presence
  );

  // @ts-ignore
  const liveDrawings = leaderPresence?.drawings;
  // @ts-ignore
  const liveCurrentShape = leaderPresence?.currentShape;
  // const followersPresence = useOthers((others) =>
  //   others.map((other) => other.presence).filter((other) => followersIds?.includes(other.id))
  // );

  // const liveDrawings = [leaderPresence, ...followersPresence].flatMap(
  //   (presence) => presence?.drawings
  // );
  // const liveCurrentShapes = [leaderPresence, ...followersPresence].flatMap(
  //   (presence) => presence?.currentShape
  // );

  const renderLiveShape = useCallback(
    (shape: Shape | ShapePreview) => {
      const shapeInPoints = convertShapePercentageToPoint({
        shape,
        boxHeight,
        boxWidth,
        videoHeight,
        videoWidth,
      });
      switch (shapeInPoints.shape) {
        case "ellipse":
          return (
            <Ellipse key={shape.id} ellipse={shapeInPoints} isLiveMarker />
          );
        case "arrow":
          return (
            <PointyArrow key={shape.id} arrow={shapeInPoints} isLiveMarker />
          );
        case "brush":
          return (
            <BrushStroke key={shape.id} brush={shapeInPoints} isLiveMarker />
          );
        default:
          return null;
      }
    },
    [boxHeight, boxWidth, videoHeight, videoWidth]
  );

  const shapes = useMemo(
    () =>
      liveDrawings &&
      // @ts-ignore
      liveDrawings.map((drawing) =>
        drawing ? renderLiveShape(drawing) : null
      ),
    [liveDrawings, renderLiveShape]
  );

  if (!liveCurrentShape && (!liveDrawings || liveDrawings.length === 0))
    return null;

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: -10,
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        id="canvas"
        ref={containerRef}
      >
        <Stage width={boxWidth} height={boxHeight} listening={false}>
          <Layer>
            {shapes}
            {liveCurrentShape ? renderLiveShape(liveCurrentShape) : null}
            {/* {liveCurrentShapes &&
              liveCurrentShapes.map((shape) => (shape ? renderLiveShape(shape) : null))} */}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LiveMarkers;
