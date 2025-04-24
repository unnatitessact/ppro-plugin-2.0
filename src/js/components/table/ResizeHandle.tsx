import React, { useCallback, useRef } from 'react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth: number;
  maxWidth: number;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, minWidth, maxWidth }) => {
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      startWidthRef.current = e.currentTarget.parentElement?.offsetWidth || 0;

      const handleMouseMove = (e: MouseEvent) => {
        const diffX = e.clientX - startXRef.current;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + diffX));
        onResize(newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResize, minWidth, maxWidth]
  );

  return (
    <div
      className="group absolute  right-0 top-0 flex h-full w-10 cursor-col-resize items-center justify-center"
      onMouseDown={handleMouseDown}
      style={{ zIndex: 10 }}
    >
      <div className="hidden h-full w-0.5  bg-primary-400 group-hover:block" />
    </div>
  );
};

export default ResizeHandle;
