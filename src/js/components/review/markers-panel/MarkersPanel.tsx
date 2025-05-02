import { Dispatch, SetStateAction } from "react";

import { useComments } from "@/context/comments";
import { useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowCornerUpLeft,
  ArrowCornerUpRight,
  ArrowTopRight,
  CirclePlaceholderOn,
  CrossSmall,
  Pencil,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

import { ShapeType, useReviewStore } from "@/stores/review-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

import { markersPanelAnimation } from "@/constants/animations";

interface MarkersProps {
  isMarkersVisible: boolean;
  setIsMarkersVisible: (isMarkersVisible: boolean) => void;
  setShowColorPicker: Dispatch<SetStateAction<boolean>>;
}

export const shapes: Array<{
  icon: React.ReactNode;
  id: ShapeType;
}> = [
  {
    icon: <Pencil size={16} />,
    id: "brush",
  },
  {
    icon: <ArrowTopRight size={16} />,
    id: "arrow",
  },
  {
    icon: <CirclePlaceholderOn size={16} />,
    id: "ellipse",
  },
];

const MarkersPanel = ({
  isMarkersVisible,
  // setIsMarkersVisible,
  setShowColorPicker,
}: MarkersProps) => {
  // Based on if isShare is true, use useShareReviewStore else use review store
  // const shareReviewStore = useReviewStore();
  // const reviewStore = useReviewStore();
  // const { selectedColor, selectedShape, setSelectedShape, undo, redo } = isShare
  //   ? shareReviewStore
  //   : reviewStore;

  const { selectedColor, selectedShape, setSelectedShape, undo, redo } =
    useReviewStore();
  const { isTimeInAndTimeOutSelectionEnabled } = useComments();

  const { setIsMarkersVisible } = useSearchActionsStore();

  useHotkeys([
    [
      "mod+M",
      () => {
        isTimeInAndTimeOutSelectionEnabled &&
          setIsMarkersVisible(!isMarkersVisible);
      },
    ],
  ]);

  return (
    <div className="absolute -right-[40px] top-1/2 overflow-hidden -translate-y-1/2">
      <AnimatePresence>
        {isMarkersVisible && (
          <motion.div
            className="grid h-fit grid-rows-1 drop-shadow-marker-panel"
            variants={markersPanelAnimation}
            initial="initial"
            animate="animate"
            exit="initial"
          >
            {/* <div className="relative h-4 w-4 self-end">
            <div className="absolute bottom-0 left-0  h-[10px] w-[10px] bg-default-800 dark:bg-default-100 " />
            <div className="absolute bottom-0 left-0 ml-[1px] h-5 w-5 rounded-full bg-default-50"></div>
          </div> */}
            <div className="flex max-w-[42px] flex-col gap-1 rounded-r-xl border-none bg-default-800 p-1 dark:bg-default-100">
              {shapes.map((shape) => (
                <Button
                  color="secondary"
                  key={shape.id}
                  size="sm"
                  className={`text-default-50 dark:text-default-900 ${
                    selectedShape === shape.id
                      ? "bg-default-300"
                      : "bg-transparent"
                  }`}
                  isIconOnly
                  onPress={() => setSelectedShape(shape.id)}
                  aria-label={shape.id}
                >
                  {shape.icon}
                </Button>
              ))}
              <div className="flex flex-col items-center gap-1">
                <Divider className="w-[16px]" />
                <Button
                  size="sm"
                  onPress={() => setShowColorPicker((prev) => !prev)}
                  isIconOnly
                  aria-label="Color picker"
                >
                  <div
                    className="h-[16px] w-[16px] cursor-pointer rounded-md"
                    style={{
                      backgroundColor: selectedColor
                        ? selectedColor
                        : "#F06A6A",
                    }}
                  ></div>
                </Button>
                <Divider className="w-[16px]" />
              </div>

              {/* Undo button */}
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={undo}
                aria-label="Undo"
              >
                <ArrowCornerUpLeft
                  size={16}
                  className="cursor-pointer text-default-50 dark:text-default-900"
                />
              </Button>

              {/* Redo button */}
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={redo}
                aria-label="Redo"
              >
                <ArrowCornerUpRight
                  size={16}
                  className="cursor-pointer text-default-50 dark:text-default-900"
                />
              </Button>
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  setShowColorPicker(false);
                  setIsMarkersVisible(false);
                }}
                isIconOnly
                aria-label="Close markers panel"
              >
                <CrossSmall
                  size={16}
                  className="cursor-pointer text-default-50 dark:text-default-900"
                />
              </Button>
            </div>
            {/* <div className="relative h-[10px] w-[10px] self-start bg-default-800 dark:bg-default-100">
            <div className="absolute left-0 top-0 ml-[1px] h-5 w-5 rounded-full bg-default-50"></div>
          </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarkersPanel;
