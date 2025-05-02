export type ShapeType = 'arrow' | 'ellipse' | 'brush';

export interface Action {
  shapeType: ShapeType;
  shapeId: string;
  action: 'create' | 'delete';
  shape: Shape;
}

export interface Point {
  x: number;
  y: number;
}

export interface ShapeBase {
  id: string;
  color: string;
  shape: ShapeType;
}

export interface ShapePreviewBase extends ShapeBase {
  initial: Point;
  visible: boolean;
}

export interface EllipseBase extends ShapeBase {
  shape: 'ellipse'; // Specific to Ellipse
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export interface EllipsePreview extends EllipseBase, ShapePreviewBase {
  shape: 'ellipse'; // Re-declare to resolve conflict
}

export interface ArrowBase extends ShapeBase {
  shape: 'arrow'; // Specific to Arrow
  start: Point;
  end: Point;
  // length: number;
}

export interface ArrowPreview extends ArrowBase, ShapePreviewBase {
  shape: 'arrow'; // Re-declare to resolve conflict
}

export interface BrushStrokeBase extends ShapeBase {
  shape: 'brush'; // Specific to BrushStroke
  points: Point[];
}

export interface BrushStrokePreview extends BrushStrokeBase, ShapePreviewBase {
  shape: 'brush'; // Re-declare to resolve conflict
}

export interface Ellipse extends EllipseBase {}
export interface Arrow extends ArrowBase {}
export interface BrushStroke extends BrushStrokeBase {}

export type Shape = Ellipse | Arrow | BrushStroke;
export type ShapePreview = EllipsePreview | ArrowPreview | BrushStrokePreview;

export const STROKE_WIDTH = 4;

export function defaultShape(
  shapeType: ShapeType,
  color: string = 'red',
  initial: Point = { x: 0, y: 0 }
): ShapePreview {
  switch (shapeType) {
    case 'ellipse':
      return {
        id: crypto.randomUUID(),
        color: color,
        initial: initial,
        x: initial.x,
        y: initial.y,
        radiusX: 0,
        radiusY: 0,
        visible: false,
        shape: 'ellipse'
      } as EllipsePreview;

    case 'arrow':
      return {
        id: crypto.randomUUID(),
        color: color,
        initial: initial,
        start: { ...initial },
        end: { ...initial },
        length: 0,
        visible: false,
        shape: 'arrow'
      } as ArrowPreview;

    case 'brush':
      return {
        id: crypto.randomUUID(),
        color: color,
        initial: initial,
        points: [{ ...initial }], // add point twice, so we have some drawings even on a simple click
        visible: false,
        shape: 'brush'
      } as BrushStrokePreview;

    default:
      throw new Error(`Unsupported shape type: ${shapeType}`);
  }
}

export function getDeletePoint(shape: ShapePreview | Shape): Point {
  switch (shape.shape) {
    case 'ellipse':
      return { x: shape.x + shape.radiusX, y: shape.y };
    case 'arrow':
      return { x: shape.start.x, y: shape.start.y };
    case 'brush':
      return {
        x: shape.points[shape.points.length - 1].x,
        y: shape.points[shape.points.length - 1].y
      };
  }
}

export function checkIfShapeIsLongEnough(shape: ShapePreview | Shape): boolean {
  switch (shape.shape) {
    case 'ellipse':
      return (
        shape.radiusX > minimumShapeLength.ellipse || shape.radiusY > minimumShapeLength.ellipse
      );
    case 'arrow':
      return (
        Math.hypot(shape.start.x - shape.end.x, shape.start.y - shape.end.y) >
        minimumShapeLength.arrow
      );
    case 'brush':
      return shape.points.length > 3;
    default:
      return true;
  }
}

export const minimumShapeLength: Omit<Record<ShapeType, number>, 'brush'> = {
  arrow: 32,
  ellipse: 32
};
