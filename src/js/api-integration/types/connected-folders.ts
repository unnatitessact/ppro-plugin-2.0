import { UserMeta } from "../types/meta";

export type ConnectionProvider = "s3" | "azure" | "google" | "minio";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

export interface Connection {
  id: string;
  name: string;
  provider: ConnectionProvider;
  url: string;
  status: ConnectionStatus;
  created_on: string;
  modified_on: string;
  created_by: UserMeta;
  region: string;
  bucket_name: string;
}

export type ConnectionPayload = {
  name: string;
  // url: string;
  access_key: string;
  secret_key: string;
  bucket_name: string;
  region: string;
};

export type ConnectionResults = Connection[];
