import { z } from 'zod';

export const CreateConnectionSchema = z.object({
  name: z.string().min(1),
  // url: z.string().url(),
  publicKey: z.string().min(1),
  privateKey: z.string().min(1),
  bucket_name: z.string().min(1),
  region: z.string().min(1)
});
