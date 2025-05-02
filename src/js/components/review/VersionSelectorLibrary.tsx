import { Key } from "react";

// import { useRouter, useSearchParams } from 'next/navigation';

import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import { VersionSelector } from "./VersionSelector";
// import { VersionSelector } from "@/components/review/VersionSelector";

import { useAssetDetailsQuery } from "@/api-integration/queries/library";

import { useLibraryStore } from "@/stores/library-store";

interface VersionSelectorLibraryProps {
  versionStackId: string;
}

export const VersionSelectorLibrary = ({
  versionStackId,
}: VersionSelectorLibraryProps) => {
  const { data, isLoading } = useAssetDetailsQuery(versionStackId);

  const { showVersionsPanel } = useLibraryStore();
  // const searchParams = useSearchParams();
  // const router = useRouter();
  const navigate = useNavigate();

  if (data?.resourcetype !== "VersionStack") return null;

  const handleVersionSelection = (key: Key) => {
    const clickedVersion = data?.versions?.find((v) => v.file.id === key);

    const fileId = key as string;
    const params = new URLSearchParams("");
    params.set("version", fileId);

    if (
      clickedVersion?.file?.resourcetype === "File" &&
      clickedVersion?.file?.file_extension === ".tdraft"
    ) {
      navigate(`/video/${data?.id}?${params.toString()}`);
    } else {
      navigate(`/asset/${data?.id}?${params.toString()}`);
    }
  };

  return (
    <AnimatePresence>
      {showVersionsPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 130 }}
          exit={{ opacity: 0, height: 0 }}
          className="flex w-full items-center justify-center overflow-hidden"
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <VersionSelector
              versions={data?.versions}
              onVersionChange={handleVersionSelection}
              selectedVersionId={""}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
