import { PermissionPayload } from "../components/security-groups/files-folders/PermissionDropdown";

import { ResourceType } from "../api-integration/types/library";
import { LibraryTree } from "../api-integration/types/security-groups";

// export type ResourceType =
//   | 'ImageFile'
//   | 'AudioFile'
//   | 'Folder'
//   | 'VideoFile'
//   | 'File'
//   | 'VersionStack';

export type CheckedType = "checked" | "unchecked" | "indeterminate";

export interface LibraryTreeViewList {
  data: LibraryTree[];
  isSuccess: boolean;
  fetchNextPage: () => void;
}

export interface ModifiedTreeView {
  id: string;
  resourcetype: ResourceType;
  children_count: number;
  permissions: PermissionPayload[];
}
