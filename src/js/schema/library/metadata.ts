import { z } from 'zod';

export const AddMetadataFieldSchema = z.object({
  label: z.string(),
  type: z.enum([
    'text',
    'date',
    'text_area',
    'person',
    'location',
    'timecode',
    'timecode_range',
    'select',
    'multiselect',
    'rating',
    'toggle',
    'file'
  ])
});

export const CreateMetadataTemplateSchema = z.object({
  name: z.string()
});
