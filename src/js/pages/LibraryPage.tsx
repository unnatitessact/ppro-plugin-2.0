// import { Library } from "../components/pages/Library";

import { Library } from "../components/library/Library";

import { useWorkspace } from "../hooks/useWorkspace";
import { LibraryRoomProvider } from "../../../liveblocks.config";

export const LibraryPage = () => {
  const workspace = useWorkspace();

  return (
    <LibraryRoomProvider
      id={`library:${workspace?.workspace?.id}:root`}
      initialPresence={{}}
      initialStorage={{}}
    >
      <Library />
    </LibraryRoomProvider>
  );
};
