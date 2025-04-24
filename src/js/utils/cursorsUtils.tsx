import type {
  Arrow,
  ArrowPreview,
  BrushStroke,
  BrushStrokePreview,
  Ellipse,
  EllipsePreview,
  Point,
  Shape,
  ShapePreview,
} from "../types/shape";

interface Dimensions {
  boxWidth: number;
  boxHeight: number;
  videoHeight: number;
  videoWidth: number;
}

type EllipseConversionProps = Dimensions & {
  ellipse: Ellipse | EllipsePreview;
};
type ArrowConversionProps = Dimensions & { arrow: Arrow | ArrowPreview };
type BrushStrokeConversionProps = Dimensions & {
  brush: BrushStroke | BrushStrokePreview;
};

type ShapeConversionProps = Dimensions & { shape: Shape | ShapePreview };

export const convertPointToPercentage = ({
  boxWidth,
  boxHeight,
  videoWidth,
  videoHeight,
  point,
}: Dimensions & {
  point: Point;
}): Point => {
  /** X position of cursor in box with respect to `videoWidth` in units of percentage */
  let xPercentage;

  /** Y position of cursor in box with respect to `videoHeight` in units of percentage */
  let yPercentage;

  const { x, y } = point;

  const boxAspectRatio = boxWidth / boxHeight;
  const videoAspectRatio = videoWidth / videoHeight;
  if (boxAspectRatio < videoAspectRatio) {
    xPercentage = x / videoWidth;
    yPercentage = (y - (boxHeight - videoHeight) / 2) / videoHeight;
  } else {
    xPercentage = (x - (boxWidth - videoWidth) / 2) / videoWidth;
    yPercentage = y / videoHeight;
  }
  return { x: xPercentage, y: yPercentage };
};

export const convertPercentageToPoint = ({
  boxWidth,
  boxHeight,
  videoWidth,
  videoHeight,
  percentage,
}: Dimensions & {
  percentage: Point;
}): Point => {
  /** X position of cursor in box with respect to `boxWidth` in units of pixels */
  let x;

  /** Y position of cursor in box with respect to `boxHeight` in units of pixels */
  let y;

  const { x: xPercentage, y: yPercentage } = percentage;

  const boxAspectRatio = boxWidth / boxHeight;
  const videoAspectRatio = videoWidth / videoHeight;
  if (boxAspectRatio < videoAspectRatio) {
    x = xPercentage * videoWidth;
    y = yPercentage * videoHeight + (boxHeight - videoHeight) / 2;
  } else {
    x = xPercentage * videoWidth + (boxWidth - videoWidth) / 2;
    y = yPercentage * videoHeight;
  }
  return {
    x,
    y,
  };
};

const convertEllipsePercentageToPoint = ({
  ellipse,
  ...dimensions
}: EllipseConversionProps): Ellipse | EllipsePreview => {
  const { radiusX, radiusY, x, y } = ellipse;
  const { x: xPoint, y: yPoint } = convertPercentageToPoint({
    ...dimensions,
    percentage: {
      x,
      y,
    },
  });

  const radiusXPoint = radiusX * dimensions.videoWidth;
  const radiusYPoint = radiusY * dimensions.videoHeight;

  return {
    ...ellipse,
    radiusX: radiusXPoint,
    radiusY: radiusYPoint,
    x: xPoint,
    y: yPoint,
  };
};

const convertArrowPercentageToPoint = ({
  arrow,
  ...dimensions
}: ArrowConversionProps): Arrow | ArrowPreview => {
  const { start, end } = arrow;
  const startPoint = convertPercentageToPoint({
    ...dimensions,
    percentage: {
      x: start.x,
      y: start.y,
    },
  });
  const endPoint = convertPercentageToPoint({
    ...dimensions,
    percentage: {
      x: end.x,
      y: end.y,
    },
  });
  return {
    ...arrow,
    start: startPoint,
    end: endPoint,
  };
};

const convertBrushPercentageToPoint = ({
  brush,
  ...dimensions
}: BrushStrokeConversionProps): BrushStroke | BrushStrokePreview => {
  const { points } = brush;
  const convertedPoints = points.map((point) =>
    convertPercentageToPoint({ percentage: point, ...dimensions })
  );
  return {
    ...brush,
    points: convertedPoints,
  };
};

export const convertShapePercentageToPoint = ({
  shape,
  ...dimensions
}: ShapeConversionProps): Shape | ShapePreview => {
  switch (shape.shape) {
    case "arrow":
      return convertArrowPercentageToPoint({ arrow: shape, ...dimensions });
    case "ellipse":
      return convertEllipsePercentageToPoint({ ellipse: shape, ...dimensions });
    case "brush":
      return convertBrushPercentageToPoint({ brush: shape, ...dimensions });
  }
};
