import { create } from "zustand";

interface ParamsStateStore {
  folderId: string;
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
}));
