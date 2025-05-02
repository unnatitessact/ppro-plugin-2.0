import React, { useCallback, useMemo } from 'react';

import { useElementSize } from '@mantine/hooks';
// import { useAuth } from '@/context/auth';
import { Layer, Stage } from 'react-konva';

import BrushStroke from '@/components/review/markers-canvas/BrushStroke';
import Ellipse from '@/components/review/markers-canvas/Ellipse';
import PointyArrow from '@/components/review/markers-canvas/PointyArrow';
import { Shape, ShapePreview } from '@/components/review/markers-canvas/shapes';

import { useReviewStore } from '@/stores/review-store';

import { convertShapePercentageToPoint } from '@/utils/cursorsUtils';

const ShowMarkersCanvas = ({
  videoWidth,
  videoHeight
}: {
  videoWidth: number;
  videoHeight: number;
}) => {
  const { ref: containerRef, width: boxWidth, height: boxHeight } = useElementSize();
  //   const { session } = useAuth();
  //   const user = session?.user;
  //   const color = user?.profile?.color || 'red';

  const { selectedComment } = useReviewStore();

  const renderShape = useCallback(
    (shape: Shape | ShapePreview) => {
      const shapeInPoints = convertShapePercentageToPoint({
        shape,
        boxHeight,
        boxWidth,
        videoHeight,
        videoWidth
      });
      switch (shapeInPoints.shape) {
        case 'ellipse':
          return <Ellipse key={shape.id} ellipse={shapeInPoints} isLiveMarker />;
        case 'arrow':
          return <PointyArrow key={shape.id} arrow={shapeInPoints} isLiveMarker />;
        case 'brush':
          return <BrushStroke key={shape.id} brush={shapeInPoints} isLiveMarker />;
        default:
          return null;
      }
    },
    [boxHeight, boxWidth, videoHeight, videoWidth]
  );

  const shapes = useMemo(
    () => selectedComment?.markers?.map((marker) => (marker ? renderShape(marker.data) : null)),
    [selectedComment?.markers, renderShape]
  );

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        id="canvas"
        ref={containerRef}
      >
        <Stage width={boxWidth} height={boxHeight} listening={false}>
          <Layer>{shapes}</Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ShowMarkersCanvas;
