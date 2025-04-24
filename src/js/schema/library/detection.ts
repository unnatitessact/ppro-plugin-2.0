import { z } from 'zod';

export const CaptionEditSchema = z.object({
  caption: z.string().trim().min(1, 'Caption is required.')
});

export const AdPromptSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required.').max(1000, 'Prompt is too long.')
});
