"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@nextui-org/react";

export interface SliderProps {
  thumbHeight: "sm" | "md" | "lg";
  max: number;
  value: number;
  setValue: (value: number) => void;
}

export const Slider = ({ thumbHeight, max, value, setValue }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - left;
      const newValue = Math.round((clickPosition / width) * max);
      setValue(newValue);
    }
  };

  const filledWidth = (value / max) * 100;
  const thumbLeft = (value / max) * 100;

  useEffect(() => {
    const handleThumbMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      event.stopPropagation();
      if (isDragging && sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        const dragPosition = event.clientX - left;
        const newValue = Math.max(
          0,
          Math.min(Math.round((dragPosition / width) * max), max)
        );
        setValue(newValue);
      }
    };

    sliderRef.current?.addEventListener("mousemove", handleMouseMove);
    sliderRef.current?.addEventListener("mouseup", handleThumbMouseUp);

    return () => {
      sliderRef.current?.removeEventListener("mousemove", handleMouseMove);
      sliderRef.current?.removeEventListener("mouseup", handleThumbMouseUp);
    };
  }, [isDragging, setValue, max]);

  return (
    <>
      <div
        className="relative flex h-5 w-full cursor-pointer flex-col items-center justify-center"
        ref={sliderRef}
        onClick={handleSliderClick}
      >
        <div className="h-1 w-full rounded-md bg-white/40" />
        <div
          className="absolute left-0 top-1/2 h-1 rounded-bl-md rounded-tl-md bg-white -translate-y-1/2"
          style={{
            width: `${filledWidth}%`,
          }}
        />

        {/* thumb */}
        <div
          style={{ left: `${thumbLeft}%` }}
          className={cn(
            "absolute left-0 top-1/2 w-[2px] cursor-grab rounded-md bg-white -translate-y-1/2",
            thumbHeight === "sm" && "h-3",
            thumbHeight === "md" && "h-4",
            thumbHeight === "lg" && "h-6"
          )}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </>
  );
};

// const ToolTip = ({
//   resizeParams
// }: {
//   resizeParams: { isResizing: boolean; direction: 'left' | 'right' | '' };
// }) => {
//   return (
//     <div
//       className={cn(
//         resizeParams.isResizing ? 'absolute' : 'hidden',
//         resizeParams.direction === 'left' ? 'left-0' : 'right-0',
//         '-top-[40px] whitespace-nowrap rounded-lg  border-default-200 bg-default-100 bg-opacity-30 p-2 shadow-none backdrop-blur-sm backdrop-filter'
//       )}
//     >
//       <p className="text-base-800 text-sm font-medium">For precision seeeking press o + -</p>
//     </div>
//   );
// };
