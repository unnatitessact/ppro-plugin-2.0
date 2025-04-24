import { z } from "zod";

export const CreateCanvasSchema = z.object({
  name: z.string().trim().min(1),
});
