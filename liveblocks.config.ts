import {
  createClient,
  JsonObject,
  LiveList,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// import { Shape, ShapePreview } from "@/components/review/markers-canvas/shapes";

import { IndexStatus } from "./src/js/api-integration/types/library";

type EventType =
  | "FOLLOW"
  | "UNFOLLOW"
  | "SEEK"
  | "NEW_NOTIFICATION"
  | "SUBTITLES_UPDATED"
  | "METADATA_UPDATED"
  | "AI_METADATA_TRANSLATION"
  | "COMMENTS_UPDATED"
  | "PROJECT_TASK_UPDATE";

export const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
});

// type FollowUser = {
//   id: string;
//   name: string;
//   avatar: string;
// };

// export type LiveShape = Shape & JsonObject;
// export type LiveShapePreview = ShapePreview & JsonObject;

export type Presence = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  email: string;
  isAddingReview: boolean;
  //   currentShape: LiveShapePreview | null;
  cursor: {
    x: number;
    y: number;
  } | null;
  //   drawings: LiveShape[];
  currentTime: number;
  // leader: PlayerLeader | null;
  leaderId: string | null;
  // followers: FollowUser[];
  isPlaying: boolean;
};

type Storage = Record<string, never>;

interface UserMeta extends JsonObject {}

interface RoomEvent extends JsonObject {
  type: EventType;
  leaderId?: string;
  unfollowerId?: string;
  seekTo?: number;
}

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useUpdateMyPresence,
    useSelf,
    useRoom,
    useStatus,
    useBroadcastEvent,
    useEventListener,
    useIsInsideRoom,
    useOthersMapped,
    useRedo,
    useUndo,
    useErrorListener,
  },
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);

export type LibraryRoomEvent = {
  type: string;
  video_id?: string;
  index_status?: IndexStatus;
  index_percent?: number;
};

export const {
  RoomProvider: LibraryRoomProvider,
  useEventListener: useLibraryEventListener,
} = createRoomContext(client);

export default client;

interface CanvasPresence extends JsonObject {}

type CanvasStorage = {
  data: LiveObject<{
    nodes: LiveList<string>;
    sceneVersion: number;
  }>;
};

export const {
  RoomProvider: CanvasRoomProvider,
  suspense: {
    useRoom: useCanvasRoom,
    useStorage: useCanvasStorage,
    useMutation: useCanvasMutation,
  },
} = createRoomContext<CanvasPresence, CanvasStorage>(client);

export const {
  RoomProvider: ProjectRoomProvider,
  useEventListener: useProjectEventListener,
} = createRoomContext(client);

export const {
  RoomProvider: GlobalProjectRoomProvider,
  useEventListener: useGlobalProjectEventListener,
} = createRoomContext(client);

export const {
  RoomProvider: ProjectLibraryRoomProvider,
  useEventListener: useProjectLibraryEventListener,
} = createRoomContext(client);

export const {
  RoomProvider: PresetRoomProvider,
  useEventListener: usePresetEventListener,
} = createRoomContext(client);

export const {
  RoomProvider: FeatureFlagRoomProvider,
  useEventListener: useFeatureFlagEventListener,
} = createRoomContext(client);
