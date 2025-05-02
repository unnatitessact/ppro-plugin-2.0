import React, { useMemo } from "react";

import { Arrow, Group, Wedge } from "react-konva";

import DeleteButton from "@/components/review/markers-canvas/DeleteButton";
import {
  ArrowPreview,
  Arrow as IArrow,
  STROKE_WIDTH,
} from "@/components/review/markers-canvas/shapes";

import {
  COLOR_COMBINATIONS,
  COMBINATIONS_KEY,
} from "@/constants/data-colors/data-colors";

/** Angle of arrow's tail in degrees  */
const angle = 6.5;

const PointyArrow = ({
  arrow,
  isLiveMarker = false,
  isPreview = false,
}: {
  arrow: IArrow | ArrowPreview;
  isLiveMarker?: boolean;
  isPreview?: boolean;
}) => {
  const { start, end, color } = arrow;
  const length = useMemo(
    () => Math.hypot(start.x - end.x, start.y - end.y),
    [start, end]
  );
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;

  /** Live markers will have cursors as combination name whereas local markers will have hex code */
  const derivedColor = isLiveMarker
    ? COLOR_COMBINATIONS?.dark?.[color as COMBINATIONS_KEY]?.solid?.bg ?? color
    : color;

  return (
    <Group>
      <Arrow
        points={[x1, y1, x2, y2]}
        lineCap="round"
        lineJoin="round"
        strokeWidth={STROKE_WIDTH}
        pointerLength={length * 0.2}
        pointerWidth={length * 0.175}
        fill={derivedColor}
        stroke={derivedColor}
        hitStrokeWidth={20}
        perfectDrawEnabled={false}
        listening={false}
      />
      <Wedge
        x={x1}
        y={y1}
        angle={angle}
        radius={length * 0.85}
        fill={derivedColor}
        stroke={derivedColor}
        hitStrokeWidth={20}
        rotation={Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) - angle / 2}
        perfectDrawEnabled={false}
        listening={false}
      />
      {!isLiveMarker && !isPreview && <DeleteButton shape={arrow} />}
    </Group>
  );
};

export default PointyArrow;
