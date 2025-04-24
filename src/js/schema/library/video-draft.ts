import { z } from 'zod';

export const CreateVideoDraftSchema = z.object({
  name: z.string().min(1)
});
