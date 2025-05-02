import React from "react";

import { Group, Line } from "react-konva";

import DeleteButton from "@/components/review/markers-canvas/DeleteButton";
import {
  BrushStrokePreview,
  BrushStroke as IBrushStroke,
  STROKE_WIDTH,
} from "@/components/review/markers-canvas/shapes";

import {
  COLOR_COMBINATIONS,
  COMBINATIONS_KEY,
} from "@/constants/data-colors/data-colors";

const BrushStroke = ({
  brush,
  isLiveMarker = false,
  isPreview = false,
}: {
  brush: IBrushStroke | BrushStrokePreview;
  isLiveMarker?: boolean;
  isPreview?: boolean;
}) => {
  const { points, color } = brush;

  /** Live markers will have cursors as combination name whereas local markers will have hex code */
  const derivedColor = isLiveMarker
    ? COLOR_COMBINATIONS?.dark?.[color as COMBINATIONS_KEY]?.solid?.bg ?? color
    : color;

  return (
    <Group>
      <Line
        points={points.flatMap((point) => [point.x, point.y])}
        stroke={derivedColor}
        strokeWidth={STROKE_WIDTH}
        globalCompositeOperation="source-over"
        lineCap="round"
        lineJoin="round"
        perfectDrawEnabled={false}
        listening={false}
        hitStrokeWidth={20}
      />
      {!isLiveMarker && !isPreview && <DeleteButton shape={brush} />}
    </Group>
  );
};

export default BrushStroke;
