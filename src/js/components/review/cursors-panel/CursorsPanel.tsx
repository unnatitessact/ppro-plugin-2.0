import { useMemo } from "react";

import useAuth from "@/hooks/useAuth";
// import { useAuth } from "@/context/auth";
import {
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "../../../../../liveblocks.config";
import { useElementSize } from "@mantine/hooks";

import Cursor from "@/components/ui/collaboration/cursor/cursor";

import {
  convertPercentageToPoint,
  convertPointToPercentage,
} from "@/utils/cursorsUtils";

interface CursorsPanelProps {
  videoWidth: number;
  videoHeight: number;
  children?: React.ReactNode;
}
const CursorsPanel = ({
  videoWidth,
  videoHeight,
  children,
}: CursorsPanelProps) => {
  const { auth } = useAuth();
  const leaderId = useSelf((self) => self.presence.leaderId);
  const cursors = useOthers((others) =>
    others
      .filter(
        (other) =>
          (!!leaderId &&
            (other.presence.leaderId === leaderId ||
              other.presence.id === leaderId)) ||
          other.presence.leaderId === auth?.user.id
      )
      .map((other) => other.presence)
  );

  // const followersIds = useSelf((self) => self.presence.followers.map((follower) => follower.id));
  // const leaderPresence = useOthers(
  //   (others) => others.find((other) => other.presence.id === leaderId)?.presence
  // );
  // const followersPresence = useOthers((others) =>
  //   others.map((other) => other.presence).filter((other) => followersIds?.includes(other.id))
  // );
  // const followersId = followersPresence.map((other) => other.id);

  const { ref: boxRef, width: boxWidth, height: boxHeight } = useElementSize();
  const users = useMemo(() => {
    return cursors.map((presence) => {
      if (!presence || !presence.cursor) return presence;
      const point = convertPercentageToPoint({
        boxHeight,
        boxWidth,
        videoHeight,
        videoWidth,
        percentage: presence.cursor,
      });
      return {
        ...presence,
        cursor: {
          ...presence.cursor,
          ...point,
        },
      };
    });
  }, [
    cursors,
    // leaderPresence,
    // followersPresence,
    // followersId,
    videoHeight,
    videoWidth,
    boxWidth,
    boxHeight,
  ]);
  const updateMyPresence = useUpdateMyPresence();
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: users.length > 0 ? 40 : -1,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        ref={boxRef}
        onPointerMove={(e) => {
          const {
            left: boxLeft,
            top: boxTop,
            width: boxWidth,
            height: boxHeight,
          } = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - boxLeft;
          const y = e.clientY - boxTop;

          const percentage = convertPointToPercentage({
            boxWidth,
            boxHeight,
            videoHeight,
            videoWidth,
            point: {
              x,
              y,
            },
          });
          updateMyPresence({
            cursor: {
              ...percentage,
            },
          });
        }}
        onPointerLeave={() =>
          updateMyPresence({
            cursor: null,
          })
        }
      >
        {users.map((user) => {
          if (!user || !user.cursor || !user.cursor.x || !user.cursor.y)
            return null;
          return (
            <Cursor
              bounds={{ width: boxWidth, height: boxHeight }}
              color={user?.color}
              x={user?.cursor?.x}
              y={user?.cursor?.y}
              key={user.id}
              name={user?.name}
              avatar={user?.avatar}
            />
          );
        })}
        {children}
      </div>
    </div>
  );
};

export default CursorsPanel;
