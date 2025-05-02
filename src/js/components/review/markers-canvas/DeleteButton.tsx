import React, { useMemo } from 'react';

import { useReviewStore } from '@/stores/review-store';
import { Circle, Group, Line } from 'react-konva';

import { getDeletePoint, Shape } from '@/components/review/markers-canvas/shapes';

const DeleteButton = ({ shape }: { shape: Shape }) => {
  const { color } = shape;
  const deletePoint = useMemo(() => getDeletePoint(shape), [shape]);
  const { handleDeleteAction } = useReviewStore();
  return (
    <Group
      onMouseDown={(event) => {
        event.cancelBubble = true;
      }}
      onMouseMove={(event) => {
        event.cancelBubble = true;
      }}
      onMouseUp={(event) => {
        event.cancelBubble = true;
      }}
      onClick={(event) => {
        event.cancelBubble = true;
        handleDeleteAction(shape);
      }}
    >
      <Circle x={deletePoint.x} y={deletePoint.y} radius={10} fill={color} />
      <Line
        points={[deletePoint.x - 3, deletePoint.y - 3, deletePoint.x + 3, deletePoint.y + 3]}
        stroke="white"
      />
      <Line
        points={[deletePoint.x + 3, deletePoint.y - 3, deletePoint.x - 3, deletePoint.y + 3]}
        stroke="white"
      />
    </Group>
  );
};

export default DeleteButton;
