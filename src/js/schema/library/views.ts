import { z } from 'zod';

export const CreateViewSchema = z.object({
  name: z.string().min(1),
  query: z.string().min(1)
});
