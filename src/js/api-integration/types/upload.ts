import { ResourceType } from './library';

export interface UploadIdResponse {
  key: string;
  upload_id: string;
  data: {
    created_on: string;
    file_extension: string;
    file_type: string;
    id: string;
    name: string;
    parent: string | null;
    size: number;
  };
}

export interface PresignedUrlsResponse {
  data: string[];
}

export interface UploadCompleteResponse {
  data: {
    id: string;
    name: string;
    parent: string | null;
    created_on: string;
    size: number;
    resourcetype: ResourceType;
    file_extension: string;
    file_type: string;
  };
}

export interface UploadCompleteResponseProjects {
  data: {
    id: string;
    name: string;
    parent: string | null;
    created_on: string;
    size: number;
    resourcetype: ResourceType;
    file_extension: string;
    file_type: string;
  };
}
