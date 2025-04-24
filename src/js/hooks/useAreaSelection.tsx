"use client";

import * as React from "react";

import { useMediaQuery } from "@mantine/hooks";

import { MOBILE_MEDIA_QUERY } from "../utils/responsiveUtils";

interface Coordinates {
  x: number;
  y: number;
}
export interface DrawnArea {
  start: undefined | Coordinates;
  end: undefined | Coordinates;
}

interface UseAreaSelectionProps {
  container: React.RefObject<HTMLElement> | undefined;
  containerIds: string[];
}

const boxNode =
  typeof window !== "undefined" ? document.createElement("div") : null;
if (boxNode) {
  boxNode.className =
    "fixed mix-blend-multiply  rounded-md border border-ds-text-selection/80 bg-ds-text-selection/10";
}
// boxNode.style.position = 'fixed';
// boxNode.style.background = 'hsl(206deg 100% 50% / 5%)';
// boxNode.style.boxShadow = 'inset 0 0 0 2px hsl(206deg 100% 50% / 50%)';
// boxNode.style.borderRadius = '2px';
// boxNode.style.pointerEvents = 'none';
// boxNode.style.mixBlendMode = 'multiply';

export function useAreaSelection({
  container = { current: document.body },
  containerIds,
}: UseAreaSelectionProps) {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const boxRef = React.useRef<HTMLDivElement>(boxNode);
  const boxElement = boxRef;
  const [mouseDown, setMouseDown] = React.useState<boolean>(false);
  const [selection, setSelection] = React.useState<DOMRect | null>(null);
  const [drawArea, setDrawArea] = React.useState<DrawnArea>({
    start: undefined,
    end: undefined,
  });

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isMobile) return;
    document.body.style.userSelect = "none";
    setDrawArea((prev) => ({
      ...prev,
      end: {
        x: e.clientX,
        y: e.clientY,
      },
    }));
  }, []);

  const handleMouseDown = React.useCallback(
    (e: MouseEvent) => {
      if (isMobile) return;
      const targetId = e.target ? (e.target as HTMLElement).id : "";

      if (!containerIds.includes(targetId)) {
        return;
      }

      const containerElement = container.current;

      setMouseDown(true);

      if (
        containerElement &&
        containerElement.contains(e.target as HTMLElement)
      ) {
        document.addEventListener("mousemove", handleMouseMove);
        setDrawArea({
          start: {
            x: e.clientX,
            y: e.clientY,
          },
          end: {
            x: e.clientX,
            y: e.clientY,
          },
        });
      }
    },
    [container, handleMouseMove, containerIds]
  );

  const handleMouseUp = React.useCallback(() => {
    document.body.style.userSelect = "initial";
    document.removeEventListener("mousemove", handleMouseMove);
    setMouseDown(false);
    setDrawArea({
      start: undefined,
      end: undefined,
    });
    // set selection
  }, [handleMouseMove]);

  React.useEffect(() => {
    const containerElement = container.current;
    if (containerElement) {
      containerElement.addEventListener("pointerdown", handleMouseDown);
      document.addEventListener("pointerup", handleMouseUp);

      return () => {
        containerElement.removeEventListener("pointerdown", handleMouseDown);
        document.removeEventListener("pointerup", handleMouseUp);
      };
    }
  }, [container, handleMouseDown, handleMouseUp]);

  React.useEffect(() => {
    const { start, end } = drawArea;
    if (start && end && boxElement.current) {
      drawSelectionBox(boxElement.current, start, end);
      setSelection(boxElement.current.getBoundingClientRect());
    }
  }, [drawArea, boxElement]);

  React.useEffect(() => {
    const containerElement = container.current;
    const selectionBoxElement = boxElement.current;
    if (containerElement && selectionBoxElement) {
      if (mouseDown) {
        if (!document.body.contains(selectionBoxElement)) {
          containerElement.appendChild(selectionBoxElement);
        }
      } else {
        if (containerElement.contains(selectionBoxElement)) {
          containerElement.removeChild(selectionBoxElement);
        }
      }
    }
  }, [mouseDown, container, boxElement]);

  return { selection, drawArea, mouseDown };
}

export function useSelected(
  elementRef: React.RefObject<HTMLElement>,
  selection: DOMRect | null,
  drawArea: DrawnArea,
  isSelected: boolean,
  setIsSelected: (isSelected: boolean) => void
) {
  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (drawArea && drawArea?.start && drawArea?.end) {
      startTransition(() => {
        if (!elementRef.current || !selection) {
          setIsSelected(false);
        } else {
          const a = elementRef.current.getBoundingClientRect();
          const b = selection;
          const flag = !(
            a.y + a.height < b.y ||
            a.y > b.y + b.height ||
            a.x + a.width < b.x ||
            a.x > b.x + b.width
          );
          setIsSelected(flag);
        }
      });
    }
  }, [elementRef, selection, setIsSelected, drawArea]);

  return isSelected;
}

function drawSelectionBox(
  boxElement: HTMLElement,
  start: Coordinates,
  end: Coordinates
): void {
  const b = boxElement;
  if (end.x > start.x) {
    b.style.left = start.x + "px";
    b.style.width = end.x - start.x + "px";
  } else {
    b.style.left = end.x + "px";
    b.style.width = start.x - end.x + "px";
  }

  if (end.y > start.y) {
    b.style.top = start.y + "px";
    b.style.height = end.y - start.y + "px";
  } else {
    b.style.top = end.y + "px";
    b.style.height = start.y - end.y + "px";
  }
}
