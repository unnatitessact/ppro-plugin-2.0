import { ResourceType, VersionStackItem } from "../types/library";
import {
  ResourceType as ProjectResourceType,
  VersionStackItem as ProjectVersionStackItem,
} from "../types/projects";

import { PaginatedAPIResponse } from "../../types/api";

interface TreeBase {
  id: string;
  name: string;
  resourcetype: ResourceType;
  parent: string;
}

interface TreeAsset extends TreeBase {
  resourcetype: Exclude<ResourceType, "VersionStack">;
  children_count?: number;

  file_extension: string;
}

interface TreeVersionStack extends TreeBase {
  resourcetype: "VersionStack";
  versions: VersionStackItem[];
}

export type Tree = TreeAsset | TreeVersionStack;

export interface TreeFolder {
  id: string;
  name: string;
  parent: string | null;
  children_count?: number;
  created_on: string;
}

export type TreeResult = PaginatedAPIResponse<Tree>;
export type TreeFolderResult = PaginatedAPIResponse<TreeFolder>;

interface ProjectTreeBase {
  id: string;
  name: string;
  resourcetype: ProjectResourceType;
  parent: string;
}

interface ProjectTreeAsset extends ProjectTreeBase {
  resourcetype: Exclude<ProjectResourceType, "ProjectVersionStack">;
  children_count?: number;

  file_extension: string;
}

interface ProjectTreeVersionStack extends ProjectTreeBase {
  resourcetype: "ProjectVersionStack";
  versions: ProjectVersionStackItem[];
}

export type ProjectTree = ProjectTreeAsset | ProjectTreeVersionStack;

export interface ProjectTreeFolder {
  id: string;
  name: string;
  parent: string | null;
  children_count?: number;
  created_on: string;
}

export type ProjectTreeResult = PaginatedAPIResponse<ProjectTree>;
export type ProjectTreeFolderResult = PaginatedAPIResponse<ProjectTreeFolder>;
