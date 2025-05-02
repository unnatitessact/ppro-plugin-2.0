import { useEffect, useState } from "react";

import { usePlayerContext } from "@/context/player";
import { useHotkeys } from "@mantine/hooks";
import { useMediaRemote } from "@vidstack/react";

// import { useSearchActions } from '@/hooks/useSearch';

import { LibraryAsset } from "@/api-integration/types/library";
import { LibraryAsset as ProjectLibraryAsset } from "@/api-integration/types/projects";

import { useReviewStore } from "@/stores/review-store";

interface ReviewHotkeysProps {
  resourceType:
    | LibraryAsset["resourcetype"]
    | ProjectLibraryAsset["resourcetype"];
}

export const ReviewHotkeys = ({ resourceType }: ReviewHotkeysProps) => {
  const {
    player,
    playerState: {
      setTimeSelection,
      setShouldSyncEndTimeWithCurrentTime,
      resetTimeSelectionStates,
      timeSelection,
    },
  } = usePlayerContext();

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    return player?.subscribe(({ fullscreen }) => {
      setIsFullscreen(fullscreen);
    });
  }, [player]);

  // const isFullscreen = player?.state?.fullscreen;

  const remote = useMediaRemote(player);

  const { setShouldPlayAfterCommenting } = useReviewStore();
  // const { onReviewAction } = useSearchActions();

  useHotkeys([
    [
      "c",
      () => {
        if (!player) return;
        if (
          (resourceType === "VideoFile" ||
            resourceType === "ProjectVideoFile") &&
          isFullscreen
        ) {
          remote?.exitFullscreen();
        }
        if (player?.state?.playing) {
          setShouldPlayAfterCommenting(true);
          remote?.pause();
        }
        setShouldSyncEndTimeWithCurrentTime(false);
        const currentTime = JSON.parse(
          JSON.stringify(player?.currentTime ?? 0)
        );
        const time = {
          startTime: currentTime,
          endTime: currentTime,
        };

        // flushSync(() => {
        if (!timeSelection) {
          setTimeSelection(time);
        }
        // });

        // onReviewAction('add_comment');
      },
    ],
  ]);

  useHotkeys(
    [
      [
        "Escape",
        () => {
          resetTimeSelectionStates();
        },
      ],
    ],
    []
  );
  return null;
};
