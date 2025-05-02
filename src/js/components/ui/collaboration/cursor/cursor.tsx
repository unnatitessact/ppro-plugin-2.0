import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@nextui-org/react";

import { Avatar } from "@/components/ui/Avatar";

import {
  CURSORS_COMBINATIONS_SOLID,
  FILL_COMBINATIONS,
} from "@/constants/data-colors/data-colors";

interface CursorSVGProps {
  reversedX: boolean;
  reversedY: boolean;
  color: string;
}

function closestEquivalentAngle(from: number, to: number) {
  const delta = ((((to - from) % 360) + 540) % 360) - 180;
  return from + delta;
}

function getRotation(reversedX: boolean, reversedY: boolean): number {
  let newRotation = 0;
  if (reversedX) {
    if (reversedY) {
      newRotation = 180;
    } else {
      newRotation = 90;
    }
  } else {
    if (reversedY) {
      newRotation = -90;
    } else {
      newRotation = 0;
    }
  }
  return newRotation;
}

const CursorSVG = ({ reversedX, reversedY, color }: CursorSVGProps) => {
  const [rotation, setRotation] = useState<number>(
    getRotation(reversedX, reversedY)
  );
  useEffect(() => {
    setRotation((prevRotation) =>
      closestEquivalentAngle(prevRotation, getRotation(reversedX, reversedY))
    );
  }, [reversedX, reversedY, setRotation]);

  return (
    <div
      className={cn("origin-top-left transition-transform ")}
      style={{
        transform: `rotate(${rotation}deg`,
      }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={color}
      >
        <path d="M2.42059 0.265762C1.08342 -0.203468 -0.20266 1.08262 0.266571 2.41978L4.75903 15.2219C5.26916 16.6756 7.29944 16.7443 7.90658 15.3284L10.1342 10.1334L15.3292 7.90577C16.7451 7.29863 16.6765 5.26835 15.2228 4.75822L2.42059 0.265762Z" />
      </svg>
    </div>
  );
};
interface CursorProps {
  color?: string;
  x: number;
  y: number;
  name?: string;
  avatar?: string;
  bounds: {
    width: number;
    height: number;
  };
}

export default function Cursor({
  color,
  x,
  y,
  name,
  avatar,
  bounds,
}: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);

  const xPosition = Math.min(bounds.width, Math.max(0, x));
  const yPosition = Math.min(bounds.height, Math.max(0, y));

  const safeAreaLength = 16;
  const reverseOffsets = useMemo(() => {
    return ref.current
      ? {
          x: ref.current?.getBoundingClientRect()?.width + safeAreaLength,
          y: ref.current?.getBoundingClientRect()?.height + safeAreaLength,
        }
      : {
          x: safeAreaLength + 100,
          y: safeAreaLength + 40,
        };
  }, [ref.current, safeAreaLength]);
  const reversedX = reverseOffsets.x
    ? bounds.width - xPosition < reverseOffsets.x
    : null;
  const reversedY = reverseOffsets.y
    ? bounds.height - yPosition < reverseOffsets.y
    : null;
  const content = useMemo(() => {
    return (
      <CursorContent
        ref={ref}
        color={color}
        reversedX={reversedX}
        reversedY={reversedY}
        avatar={avatar}
        name={name}
      />
    );
  }, [avatar, color, name, reversedX, reversedY]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPosition}px`,
        top: `${yPosition}px`,
        zIndex: 50,
      }}
    >
      {content}
    </div>
  );
}

export const CursorContent = forwardRef(
  (
    {
      color,
      reversedX,
      reversedY,
      avatar,
      name,
    }: {
      color?: string;
      reversedX: boolean | null;
      reversedY: boolean | null;
      avatar?: string;
      name?: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div className="relative">
        {reversedX !== null && reversedY !== null && (
          <CursorSVG
            color={FILL_COMBINATIONS[color || 0]}
            reversedX={reversedX}
            reversedY={reversedY}
          />
        )}
        <div
          ref={ref}
          className={cn(
            `absolute left-0 top-0 p-2 transition-transform `,
            reversedX ? "-translate-x-full" : "translate-x-0",
            reversedY ? "-translate-y-full" : "translate-y-0"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1  whitespace-nowrap rounded-[20px] bg-transparent p-1.5",
              `${CURSORS_COMBINATIONS_SOLID[color || 0]}`
            )}
          >
            {avatar && <Avatar src={avatar} size="cursor" />}
            <span className="text-truncate max-w-48 overflow-hidden whitespace-nowrap text-sm font-medium text-white">
              {name}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CursorContent.displayName = "CursorContent";
