import { ListSparkle, DotGrid1X3Horizontal } from "@tessact/icons";

import { Button } from "../ui/Button";

const files = [
  {
    id: 1,
    name: "File 1",
    type: "file",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    size: 100,
    path: "/file1",
    content: "File 1 content",
  },
  {
    id: 2,
    name: "File 2",
    type: "file",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    size: 100,
    path: "/file2",
  },
  {
    id: 3,
    type: "folder",
    name: "Folder 1",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    size: 100,
    path: "/folder1",
    content: "Folder 1 content",
  },
];

export const Library = () => {
  return (
    <div className="h-full w-full">
      <nav className="flex items-center justify-between gap-2 p-2">
        <p>Library</p>

        <div className="flex items-center gap-2">
          <Button isIconOnly>
            <ListSparkle size={20} />
          </Button>

          <Button isIconOnly>
            <DotGrid1X3Horizontal size={20} />
          </Button>
        </div>
      </nav>

      {/* <LibraryRoomProvider
      id={`library:${workspace.id}:root`}
      initialPresence={{}}
      initialStorage={{}}
    > */}
      {/* <LibraryPage /> */}
      {/* </LibraryRoomProvider> */}
    </div>
  );
};
