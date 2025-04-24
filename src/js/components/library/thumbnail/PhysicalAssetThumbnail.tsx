import { cn, Image } from "@nextui-org/react";
import Barcode from "react-barcode";

import { useLibraryStore } from "../../../stores/library-store";

interface PhysicalAssetThumbnailProps {
  assetImage: string | null;
  barcode: string;
  assetName: string;
}

export const PhysicalAssetThumbnail = ({
  assetImage,
  barcode,
  assetName,
}: PhysicalAssetThumbnailProps) => {
  const { aspectRatio, thumbnail } = useLibraryStore();

  return assetImage ? (
    <div className="relative">
      <div className="absolute z-20 flex h-full w-full items-center justify-center bg-black/20 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
        <Barcode
          renderer="svg"
          value={barcode}
          background="transparent"
          lineColor="white"
          fontSize={14}
          height={58}
          marginTop={32}
        />
      </div>
      <Image
        src={assetImage || ""}
        alt={assetName}
        className={cn(
          aspectRatio === "horizontal" ? "aspect-video" : "aspect-[9/16]",
          thumbnail === "fit" ? "object-contain" : "object-cover object-center",
          "rounded-bl-none rounded-br-none"
        )}
        classNames={{ wrapper: "flex h-full w-full" }}
      />
    </div>
  ) : (
    <div className="noise flex h-full items-center justify-center bg-ds-asset-card-card-bg text-ds-text-secondary transition group-hover:text-ds-text-primary">
      <Barcode
        renderer="svg"
        value={barcode}
        background="transparent"
        lineColor="currentColor"
        fontSize={14}
        height={58}
        marginTop={32}
      />
    </div>
  );
};
