import React from "react";

import { Group, Ellipse as KonvaEllipse } from "react-konva";

import DeleteButton from "@/components/review/markers-canvas/DeleteButton";
import {
  EllipsePreview,
  Ellipse as IEllipse,
  STROKE_WIDTH,
} from "@/components/review/markers-canvas/shapes";

import {
  COLOR_COMBINATIONS,
  COMBINATIONS_KEY,
} from "@/constants/data-colors/data-colors";

const Ellipse = ({
  ellipse,
  isLiveMarker = false,
  isPreview = false,
}: {
  ellipse: IEllipse | EllipsePreview;
  isLiveMarker?: boolean;
  isPreview?: boolean;
}) => {
  const { x, y, radiusX, radiusY, color } = ellipse;

  /** Live markers will have cursors as combination name whereas local markers will have hex code */
  const derivedColor = isLiveMarker
    ? COLOR_COMBINATIONS?.dark?.[color as COMBINATIONS_KEY]?.solid?.bg ?? color
    : color;
  return (
    <Group>
      <KonvaEllipse
        x={x}
        y={y}
        radiusX={radiusX}
        radiusY={radiusY}
        stroke={derivedColor}
        strokeWidth={STROKE_WIDTH}
        perfectDrawEnabled={false}
        listening={false}
        hitStrokeWidth={20}
      />
      {!isLiveMarker && !isPreview && <DeleteButton shape={ellipse} />}
    </Group>
  );
};

export default Ellipse;
