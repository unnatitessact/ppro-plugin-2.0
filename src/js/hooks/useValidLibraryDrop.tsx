import { useDndContext } from "@dnd-kit/core";

import {
  LibraryAsset as ProjectLibraryAsset,
  ResourceType as ProjectResourceType,
} from "../api-integration/types/projects";
import { LibraryAsset, ResourceType } from "../api-integration/types/library";

import {
  isValidLibraryDrop,
  isValidProjectLibraryDrop,
} from "../utils/libraryUtils";

// Helper hook to skip passing active and over data to isValidLibraryDrop

export const useValidLibraryDrop = (id: string, resourcetype: ResourceType) => {
  const { active, over } = useDndContext();

  const activeData = active?.data?.current as LibraryAsset;
  const overData = over?.data?.current as LibraryAsset;

  return isValidLibraryDrop({
    active: {
      id: activeData?.id,
      resourceType: activeData?.resourcetype,
    },
    over: {
      id: overData?.id,
      resourceType: overData?.resourcetype,
    },
    asset: {
      id,
      resourceType: resourcetype,
    },
  });
};

export const useValidProjectLibraryDrop = (
  id: string,
  resourcetype: ProjectResourceType
) => {
  const { active, over } = useDndContext();

  const activeData = active?.data?.current as ProjectLibraryAsset;
  const overData = over?.data?.current as ProjectLibraryAsset;

  return isValidProjectLibraryDrop({
    active: {
      id: activeData?.id,
      resourceType: activeData?.resourcetype,
    },
    over: {
      id: overData?.id,
      resourceType: overData?.resourcetype,
    },
    asset: {
      id,
      resourceType: resourcetype,
    },
  });
};
