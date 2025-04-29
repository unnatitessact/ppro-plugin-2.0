// import { Library } from "../components/pages/Library";

import LibraryLayout from "@/components/layout/LibraryLayout";
import { Library } from "../components/library/Library";

// import { useWorkspace } from "../hooks/useWorkspace";
// import { LibraryRoomProvider } from "../../../liveblocks.config";

export const LibraryPage = () => {
  // const workspace = useWorkspace();

  return (
    // <LibraryRoomProvider
    //   id={`library:${workspace?.workspace?.id}:root`}
    //   initialPresence={{}}
    //   initialStorage={{}}
    // >
    <LibraryLayout>
      <Library />
    </LibraryLayout>
    // </LibraryRoomProvider>
  );
};
