import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import { detectionCategoryMetadataQueryKey } from "../api-integration/queries/detection";
import {
  DetectedEntityDetailed,
  DetectionCategory,
  GetDetectionCategoryMetadataResponse,
} from "../api-integration/types/detection";
import { ResourceType } from "../api-integration/types/library";
import { ResourceType as ProjectResourceType } from "../api-integration/types/projects";

export type DetectionTab = "video" | "audio";
// export type DetectionCategory =
//   | 'faces'
//   | 'emotions'
//   | 'brands'
//   | 'objects'
//   | 'locations'
//   | 'ocr'
//   | 'keywords'
//   | 'transcriptions'
//   | 'captions';

export type Timestamp = {
  startTime: number;
  endTime: number;
};

export type PlayingEntity = {
  id: string;
  playing: boolean;
};

export type AssetIndex = {
  status?: string;
  percent?: number;
};

interface DetectionContextInterface {
  fileId: string;
  fileName: string;
  fileType: ResourceType | ProjectResourceType;
  selectedDetectionTab: DetectionTab;
  setSelectedDetectionTab: Dispatch<SetStateAction<DetectionTab>>;
  selectedCategory: DetectionCategory | null;
  setSelectedCategory: (category: DetectionCategory | null) => void;
  selectedEntities: Set<string>;
  setSelectedEntities: Dispatch<SetStateAction<Set<string>>>;
  selectedEntitiesPopulated: DetectedEntityDetailed[];
  playingEntity: string | null;
  setPlayingEntity: Dispatch<SetStateAction<string | null>>;
}

const DetectionContext = createContext<DetectionContextInterface>({
  fileId: "",
  fileName: "",
  fileType: "File",
  selectedDetectionTab: "video",
  setSelectedDetectionTab: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
  selectedEntities: new Set([]),
  setSelectedEntities: () => {},
  selectedEntitiesPopulated: [],
  playingEntity: null,
  setPlayingEntity: () => {},
});

export function DetectionProvider({
  children,
  fileId,
  fileName,
  fileType,
}: {
  children: ReactNode;
  fileId: string;
  fileName: string;
  fileType: ResourceType | ProjectResourceType;
  index?: AssetIndex;
}) {
  const queryClient = useQueryClient();

  const [selectedDetectionTab, setSelectedDetectionTab] =
    useState<DetectionTab>("video");
  const [selectedCategory, setSelectedCategoryState] =
    useState<DetectionCategory | null>(null);

  const [, startTransition] = useTransition();
  const setSelectedCategory = (category: DetectionCategory | null) => {
    startTransition(() => {
      setSelectedCategoryState(category);
    });
  };

  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(
    new Set([])
  );
  const [playingEntity, setPlayingEntity] = useState<string | null>(null);

  const selectedEntitiesPopulated = useMemo(() => {
    const ad_recommendations =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "ad_recommendations")
      ) ?? [];

    const scenes =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "scenes")
      ) ?? [];

    const persons =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "persons")
      ) ?? [];

    const emotions =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "emotions")
      ) ?? [];

    const objects =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "objects")
      ) ?? [];

    const brands =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "brands")
      ) ?? [];

    const locations =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "locations")
      ) ?? [];

    const events =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "time_stamped_events")
      ) ?? [];

    const ocr =
      queryClient.getQueryData<GetDetectionCategoryMetadataResponse>(
        detectionCategoryMetadataQueryKey(fileId, "ocr_text")
      ) ?? [];

    return (
      [
        ...ad_recommendations,
        ...scenes,
        ...persons,
        ...emotions,
        ...objects,
        ...brands,
        ...locations,
        ...events,
        ...ocr,
      ].filter((entity) => selectedEntities?.has(entity.id)) ?? []
    );
  }, [selectedEntities, fileId, queryClient]);

  useEffect(() => {
    if (playingEntity && !selectedEntities.has(playingEntity)) {
      setPlayingEntity(null);
    }
  }, [selectedEntities, playingEntity]);

  return (
    <DetectionContext.Provider
      value={{
        fileId,
        fileName,
        fileType,

        selectedDetectionTab,
        setSelectedDetectionTab,
        selectedCategory,
        setSelectedCategory,
        selectedEntities,
        setSelectedEntities,
        selectedEntitiesPopulated,
        playingEntity,
        setPlayingEntity,
      }}
    >
      {children}
    </DetectionContext.Provider>
  );
}

export const useDetection = () => {
  return useContext(DetectionContext);
};
