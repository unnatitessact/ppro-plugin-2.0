import { ResourceType } from "../api-integration/types/library";
import { ResourceType as ProjectResourceType } from "../api-integration/types/projects";

interface isValidLibraryDropArgs {
  active?: {
    // The active element from dnd context
    id: string;
    resourceType: ResourceType;
  };
  asset?: {
    // The asset on which droppable is present
    id: string;
    resourceType: ResourceType;
  };
  over?: {
    // The over element from dnd context
    id: string;
    resourceType: ResourceType;
  };
}

interface isValidProjectLibraryDropArgs {
  active?: {
    // The active element from dnd context
    id: string;
    resourceType: ProjectResourceType;
  };
  asset?: {
    // The asset on which droppable is present
    id: string;
    resourceType: ProjectResourceType;
  };
  over?: {
    // The over element from dnd context
    id: string;
    resourceType: ProjectResourceType;
  };
}

export const isValidLibraryDrop = ({
  active,
  asset,
  over,
}: isValidLibraryDropArgs) => {
  // Base conditions to not allow dropping on self or on nothing
  if (!active?.id) return false;
  if (!asset?.id) return false;
  if (!over?.id) return false;
  if (active.id === asset.id) return false;
  if (over?.id !== asset.id) return false;

  // All possible drag drop in the library are as follows:
  // 1. File -> File (Create new version stack)
  // 2. File -> VersionStack (Add to existing version stack)
  //
  // 3. File -> Folder (Move file to folder)
  // 4. Folder -> Folder (Move folder to folder)
  // 5. VersionStack -> Folder (Move version stack to folder)

  if (
    active.resourceType === "Folder" ||
    active.resourceType === "VersionStack"
  ) {
    // Folder and Version stack can only be moved into another folder, not dropped on any file or another version stack
    if (asset.resourceType === "Folder") {
      return true;
    }
    return false;
  }
  // All file types can be dropped on any other file type, folder or version stack
  return true;
};

export const isValidProjectLibraryDrop = ({
  active,
  asset,
  over,
}: isValidProjectLibraryDropArgs) => {
  // Base conditions to not allow dropping on self or on nothing
  if (!active?.id) return false;
  if (!asset?.id) return false;
  if (!over?.id) return false;
  if (active.id === asset.id) return false;
  if (over?.id !== asset.id) return false;

  // All possible drag drop in the project library are as follows:
  // 1. File -> File (Create new version stack)
  // 2. File -> VersionStack (Add to existing version stack)
  //
  // 3. File -> Folder (Move file to folder)
  // 4. Folder -> Folder (Move folder to folder)
  // 5. VersionStack -> Folder (Move version stack to folder)

  if (
    active.resourceType === "ProjectFolder" ||
    active.resourceType === "ProjectVersionStack"
  ) {
    // Folder and Version stack can only be moved into another folder, not dropped on any file or another version stack
    if (asset.resourceType === "ProjectFolder") {
      return true;
    }
    return false;
  }
  // All file types can be dropped on any other file type, folder or version stack
  return true;
};
