import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export interface FileUpload {
  fileName: string;
  fileType: string;
  uploadPath: string;
  sizeUploaded: number;
  totalSize: number;
  uploadId: string;
  fileId: string;
  versionStackId?: string;
  versionStackFileId?: string;
  parent?: string | null;
}

interface State {
  uploads: FileUpload[];
}

interface Actions {
  addToUploads: (upload: FileUpload) => void;
  removeFromUploads: (uploadId: string) => void;
  updateProgress: (uploadId: string, sizeUploaded: number) => void;
  clearUploads: () => void;
}

export const useUploadsStore = createWithEqualityFn<State & Actions>(
  (set) => ({
    uploads: [],
    addToUploads: (upload: FileUpload) => set((state) => ({ uploads: [...state.uploads, upload] })),
    removeFromUploads: (uploadId: string) =>
      set((state) => ({ uploads: state.uploads.filter((upload) => upload.uploadId !== uploadId) })),
    updateProgress: (uploadId: string, sizeUploaded: number) =>
      set((state) => ({
        uploads: state.uploads.map((upload) =>
          upload.uploadId === uploadId ? { ...upload, sizeUploaded } : upload
        )
      })),
    clearUploads: () => set({ uploads: [] })
  }),
  shallow
);
