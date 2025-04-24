import { z } from "zod";

export const SecurityGroupCreationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Security group name is required." })
    .max(30, {
      message: "Security group name must be less than 30 characters.",
    }),
  description: z
    .string()
    .trim()
    .max(150, {
      message: "Security group description must be less than 150 characters.",
    })
    .optional(),
});
