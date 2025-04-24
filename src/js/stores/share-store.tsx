import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AssetDetails } from "../api-integration/types/projects";
import { ViewShareResponse } from "../api-integration/types/share";
import {
  ShareTaskFilesResponse,
  ViewTaskShareResponse,
} from "../api-integration/types/share-task";

interface ShareState {
  shareId: string | null;
  password: string | null;
  setPassword: (password: string) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  shareData: ViewShareResponse | null;
  setShareData: (shareData: ViewShareResponse) => void;
  taskShareData: ViewTaskShareResponse | null;
  setTaskShareData: (taskShareData: ViewTaskShareResponse) => void;
  isShareUserDetailsModalOpen: boolean;
  setIsShareUserDetailsModalOpen: (
    isShareUserDetailsModalOpen: boolean
  ) => void;
  name: string | null;
  setName: (name: string) => void;
  email: string | null;
  setEmail: (email: string) => void;
  files: ShareTaskFilesResponse | null;
  setFiles: (files: ShareTaskFilesResponse) => void;

  selectedFile: AssetDetails | null;
  setSelectedFile: (selectedFile: AssetDetails) => void;

  setShareId: (shareId: string | null) => void;
}

export const useShareStore = create<ShareState>()(
  persist(
    (set) => ({
      shareId: null,
      setShareId: (shareId: string | null) => set({ shareId }),
      password: null,
      setPassword: (password: string) => set({ password }),
      token: null,
      setToken: (token: string | null) => set({ token }),
      shareData: null,
      setShareData: (shareData: ViewShareResponse) => set({ shareData }),
      taskShareData: null,
      setTaskShareData: (taskShareData: ViewTaskShareResponse) =>
        set({ taskShareData }),
      isShareUserDetailsModalOpen: false,
      setIsShareUserDetailsModalOpen: (isShareUserDetailsModalOpen: boolean) =>
        set({ isShareUserDetailsModalOpen }),
      name: null,
      setName: (name: string) => set({ name }),
      email: null,
      setEmail: (email: string) => set({ email }),
      files: null,
      setFiles: (files: ShareTaskFilesResponse) => set({ files }),

      selectedFile: null,
      setSelectedFile: (selectedFile: AssetDetails) => set({ selectedFile }),
    }),
    {
      storage: createJSONStorage(() => sessionStorage),
      name: "share-store",
      partialize: (state) => ({
        shareId: state.shareId,
        token: state.token,
        name: state.name,
        email: state.email,
      }),
    }
  )
);
