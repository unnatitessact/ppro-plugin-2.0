import { create } from "zustand";

export type PageName = "library" | "review" | "auth" | "folder" | "projects";

interface ParamsStateStore {
  currentPage: PageName;
  setCurrentPage: (currentPage: PageName) => void;
  folderId: string | null;
  setFolderId: (folderId: string) => void;
  selectedAssetId: string;
  setSelectedAssetId: (selectedAssetId: string) => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
  projectFolderId: string;
  setProjectFolderId: (projectFolderId: string) => void;
  workspaceId: string;
  setWorkspaceId: (workspaceId: string) => void;
  taskId: string;
  setTaskId: (taskId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  teamId: string;
  setTeamId: (teamId: string) => void;
  viewId: string;
  setViewId: (viewId: string) => void;
  groupId: string;
  setGroupId: (groupId: string) => void;
}

export const useParamsStateStore = create<ParamsStateStore>((set) => ({
  folderId: "",
  setFolderId: (folderId) => set({ folderId }),
  selectedAssetId: "",
  setSelectedAssetId: (selectedAssetId) => set({ selectedAssetId }),
  projectId: "",
  setProjectId: (projectId) => set({ projectId }),
  projectFolderId: "",
  setProjectFolderId: (projectFolderId) => set({ projectFolderId }),
  workspaceId: "",
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
  taskId: "",
  setTaskId: (taskId) => set({ taskId }),
  userId: "",
  setUserId: (userId) => set({ userId }),
  teamId: "",
  setTeamId: (teamId) => set({ teamId }),
  viewId: "",
  setViewId: (viewId) => set({ viewId }),
  groupId: "",
  setGroupId: (groupId) => set({ groupId }),
  currentPage: "library",
  setCurrentPage: (currentPage) => set({ currentPage }),
}));
