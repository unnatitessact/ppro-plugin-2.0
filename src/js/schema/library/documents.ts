import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  name: z.string().min(1)
});
