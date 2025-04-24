"use client";

import { CircularProgress, cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import prettyBytes from "pretty-bytes";

import { Video } from "@tessact/icons";

import { useLibraryStore } from "../../../stores/library-store";

interface UploadAssetProps {
  fileName: string;
  fileType: string;
  sizeUploaded: number;
  totalSize: number;
}

export const UploadAsset = ({
  fileName,
  fileType,
  sizeUploaded,
  totalSize,
}: UploadAssetProps) => {
  const { aspectRatio } = useLibraryStore();

  return (
    <motion.div
      layout="position"
      className={cn(
        "flex flex-col gap-2 rounded-[20px] p-3",
        "transition-colors",
        "group",
        "bg-ds-asset-card-bg hover:bg-ds-asset-card-bg-hover"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-ds-asset-card-bg-select text-ds-text-secondary",
          aspectRatio === "horizontal" ? "aspect-video" : "aspect-[9/16]"
        )}
      >
        <div
          className={cn(
            "h-full w-full rounded-2xl p-4 text-ds-text-secondary",
            "flex items-center justify-center",
            "transition-colors duration-200"
          )}
        >
          {fileType === "video" && <Video />}
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="truncate text-ds-text-primary">{fileName}</h4>
        <p className="flex items-center gap-1 text-ds-asset-card-text-sucess">
          <CircularProgress
            value={(sizeUploaded / totalSize) * 100}
            classNames={{
              svg: "h-5 w-5",
              indicator: "stroke-ds-asset-card-text-sucess",
              track: "bg-ds-asset-card-bg-hover",
            }}
            strokeWidth={5}
          />
          {prettyBytes(sizeUploaded)} of {prettyBytes(totalSize)} Uploading
        </p>
      </div>
    </motion.div>
  );
};
