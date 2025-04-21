import { z } from "zod";

export const CreateFolderSchema = z.object({
  name: z.string().min(1),
});

export const CreateConnectedFolderSchema = z.object({
  name: z.string().min(1),
});
