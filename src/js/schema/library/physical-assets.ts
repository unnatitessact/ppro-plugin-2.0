import { z } from 'zod';

export const NewPhysicalAssetSchema = z.object({
  name: z.string().min(1)
});
