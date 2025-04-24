import { useCallback, useSyncExternalStore } from "react";

import { CallbackListener, PlayerRef } from "@remotion/player";

export const useCurrentPlayerFrame = (
  ref: React.RefObject<PlayerRef | null>
) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const { current } = ref;
      if (!current) {
        return () => undefined;
      }
      const updater: CallbackListener<"frameupdate"> = () => {
        onStoreChange();
        console.log("current time update");
      };
      current.addEventListener("frameupdate", updater);
      return () => {
        current.removeEventListener("frameupdate", updater);
      };
    },
    [ref]
  );

  const data = useSyncExternalStore<number>(
    subscribe,
    () => ref.current?.getCurrentFrame() ?? 0,
    () => 0
  );

  return data;
};
