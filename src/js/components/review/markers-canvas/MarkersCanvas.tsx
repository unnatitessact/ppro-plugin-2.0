"use client";

import type {
  Point,
  Shape,
  ShapePreview,
} from "@/components/review/markers-canvas/shapes";
import type { KonvaEventObject } from "konva/lib/Node";

import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { useAuth } from '@/context/auth';
import useAuth from "@/hooks/useAuth";
// import { useComments } from '@/context/comments';
import {
  LiveShapePreview,
  useUpdateMyPresence,
} from "../../../../../liveblocks.config";
import { useElementSize } from "@mantine/hooks";
import { motion } from "framer-motion";
import { Layer, Stage } from "react-konva";

import BrushStroke from "@/components/review/markers-canvas/BrushStroke";
import Ellipse from "@/components/review/markers-canvas/Ellipse";
import PointyArrow from "@/components/review/markers-canvas/PointyArrow";
import {
  checkIfShapeIsLongEnough,
  defaultShape,
  // getDeletePoint
} from "@/components/review/markers-canvas/shapes";

import { useReviewStore } from "@/stores/review-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

import {
  convertPointToPercentage,
  convertShapePercentageToPoint,
} from "@/utils/cursorsUtils";

const MarkersCanvas = ({
  videoWidth,
  videoHeight,
}: {
  videoWidth: number;
  videoHeight: number;
}) => {
  const {
    ref: containerRef,
    width: boxWidth,
    height: boxHeight,
  } = useElementSize();

  const dimensions = {
    boxHeight,
    boxWidth,
    videoWidth,
    videoHeight,
  };

  const {
    selectedColor,
    selectedShape,
    drawnShapes,
    appendShape,
    handleDrawAction,
    isDrawing,
    setIsDrawing,
  } = useReviewStore();

  const { isMarkersVisible } = useSearchActionsStore();

  const [currentShape, setCurrentShape] = useState<ShapePreview>(
    defaultShape(selectedShape, selectedColor)
  );

  const { auth } = useAuth();
  const user = auth?.user;
  const color = user?.profile?.color || "red";

  const updateMyPresence = useUpdateMyPresence();
  useEffect(() => {
    updateMyPresence({
      // @ts-ignore
      currentShape: isMarkersVisible
        ? ({ ...currentShape, color } as LiveShapePreview)
        : null,
    });
    if (isMarkersVisible) {
      updateMyPresence({
        leaderId: null,
      });
    }
  }, [currentShape, isMarkersVisible, updateMyPresence, color]);

  const startDrag = (pos: Point) => {
    const percentagePos = convertPointToPercentage({
      point: pos,
      ...dimensions,
    });
    const newShape = defaultShape(selectedShape, selectedColor, percentagePos);
    setCurrentShape(newShape);
    setIsDrawing(true);
  };

  const updateDrag = (pos: Point) => {
    setCurrentShape((prev) => {
      const percentagePos = convertPointToPercentage({
        point: pos,
        ...dimensions,
      });
      const updatedShape = updateShape(prev, percentagePos);
      return {
        ...prev,
        ...updatedShape,
      };
    });
  };

  const updateShape = (shape: ShapePreview, pos: Point) => {
    switch (shape.shape) {
      case "ellipse":
        return {
          x: (shape.initial.x + pos.x) / 2,
          y: (shape.initial.y + pos.y) / 2,
          radiusX: Math.abs(shape.initial.x - pos.x) / 2,
          radiusY: Math.abs(shape.initial.y - pos.y) / 2,
          visible: true,
        };
      case "arrow":
        return {
          end: pos,
          visible: true,
        };
      case "brush":
        return {
          points: [...shape.points, pos],
          visible: true,
        };
      default:
        return {};
    }
  };

  const endDrag = () => {
    setIsDrawing(false);
    const pointShape = convertShapePercentageToPoint({
      shape: currentShape,
      ...dimensions,
    });
    if (!checkIfShapeIsLongEnough(pointShape)) {
      setCurrentShape(defaultShape(selectedShape, selectedColor));
      return;
    }
    // const deletePoint = getDeletePoint(pointShape);
    appendShape({ ...currentShape });
    handleDrawAction({ ...currentShape });
    setCurrentShape(defaultShape(selectedShape, selectedColor));
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const pos = {
      x: e.target.getRelativePointerPosition()?.x ?? 0,
      y: e.target.getRelativePointerPosition()?.y ?? 0,
    };
    startDrag(pos);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const pos = {
      x: e.target.getRelativePointerPosition()?.x ?? 0,
      y: e.target.getRelativePointerPosition()?.y ?? 0,
    };
    updateDrag(pos);
  };

  const handleMouseUp = endDrag;

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setCurrentShape(defaultShape(selectedShape, selectedColor));
  };

  const renderShape = useCallback(
    (shape: Shape | ShapePreview, isPreview?: boolean) => {
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
            <Ellipse
              key={shape.id}
              ellipse={shapeInPoints}
              isPreview={isPreview}
            />
          );
        case "arrow":
          return (
            <PointyArrow
              key={shape.id}
              arrow={shapeInPoints}
              isPreview={isPreview}
            />
          );
        case "brush":
          return (
            <BrushStroke
              key={shape.id}
              brush={shapeInPoints}
              isPreview={isPreview}
            />
          );
        default:
          return null;
      }
    },
    [boxHeight, boxWidth, videoHeight, videoWidth]
  );

  const renderDrawnShapes = useMemo(
    () => drawnShapes.map((shape) => renderShape(shape, false)),
    [drawnShapes, renderShape]
  );

  const renderPreview = renderShape(currentShape, true);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        id="canvas"
        ref={containerRef}
      >
        <Stage
          width={boxWidth}
          height={boxHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Layer>
            {renderDrawnShapes}
            {renderPreview}
            {/* {useMemo(() => drawnShapes.map(renderShape), [drawnShapes, renderShape])} */}
            {/* {currentShape.visible && renderShape(currentShape)} */}
          </Layer>
        </Stage>
      </div>
    </motion.div>
  );
};

export default MarkersCanvas;
