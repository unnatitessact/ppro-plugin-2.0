import { UniqueIdentifier } from "@dnd-kit/core";
import { cn } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

import { FolderThumbnail } from "./thumbnail/FolderThumbnail";

import { LibraryAsset } from "../../api-integration/types/library";

import { useLibraryStore } from "../../stores/library-store";

import { AssetThumbnail } from "./thumbnail/AssetThumbnail";
import { IconThumbnail } from "./thumbnail/IconThumbnail";
import { PhysicalAssetThumbnail } from "./thumbnail/PhysicalAssetThumbnail";

interface LibraryDragOverlayProps {
  activeId: UniqueIdentifier | null;
  data: { current: LibraryAsset | null } | null;
}

export const LibraryDragOverlayContents = ({
  activeId,
  data,
}: LibraryDragOverlayProps) => {
  const { aspectRatio } = useLibraryStore();

  if (!activeId || !data || !data?.current) return null;

  const resource =
    data?.current?.resourcetype === "VersionStack"
      ? data?.current?.versions?.[0]?.file
      : data?.current;

  if (
    resource.resourcetype === "VideoFile" ||
    resource.resourcetype === "ImageFile"
  ) {
    return (
      <AssetThumbnail
        thumbnailUrl={resource?.thumbnail ?? ""}
        fileName={resource?.name}
      />
    );
  }

  if (resource.resourcetype === "File") {
    return <IconThumbnail fileExtension={resource.file_extension} />;
  }

  if (resource.resourcetype === "PhysicalAsset") {
    return (
      <PhysicalAssetThumbnail
        assetName={resource.name}
        barcode={resource.barcode}
        assetImage={resource.asset_image}
      />
    );
  }

  if (resource.resourcetype === "AudioFile") {
    return (
      <div
        className={cn(
          "pointer-events-none  z-10 overflow-hidden rounded-full bg-ds-asset-card-bg",
          aspectRatio === "horizontal" && "aspect-square h-full",
          aspectRatio === "vertical" && "aspect-square w-full"
        )}
        style={{
          background: "url(/vinyl.png) no-repeat center center / cover",
        }}
      ></div>
    );
  }

  if (resource.resourcetype === "Folder") {
    return (
      <FolderThumbnail
        folderName={resource.name}
        isConnectedFolder={!!resource.connection_id}
        subcontents={resource?.sub_contents}
      />
    );
  }

  return null;
};

export const LibraryDragOverlay = ({
  activeId,
  data,
}: LibraryDragOverlayProps) => {
  return (
    <AnimatePresence>
      {activeId ? (
        <div className="relative h-auto w-40 cursor-grabbing ">
          <motion.div
            className="relative h-auto w-40 cursor-grabbing overflow-hidden rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15 md:w-60"
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 0.2,
            }}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            exit={{
              scale: 0,
            }}
          >
            <LibraryDragOverlayContents activeId={activeId} data={data} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
  // return activeId ? (
  //   <div className="relative h-auto w-40 cursor-grabbing overflow-hidden rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15 md:w-60">
  //     <LibraryDragOverlayContents activeId={activeId} data={data} />
  //   </div>
  // ) : null;
};
