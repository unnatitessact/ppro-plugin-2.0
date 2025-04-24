export type DetectionCategory =
  | 'brands'
  | 'emotions'
  | 'time_stamped_events'
  | 'keywords'
  | 'locations'
  | 'objects'
  | 'ocr_text'
  | 'persons'
  | 'keywords'
  | 'transcriptions'
  | 'subtitle'
  | 'ad_recommendations'
  | 'scenes'
  | 'dialogues';

export type AdditionalDetectionData = {
  rationale?: string;
  synopsis?: string;
};

export type Timestamp = {
  start_time: number;
  end_time: number;
  additional_data?: AdditionalDetectionData;
};

export type DetectedEntity = {
  id: string;
  image: string | null;
  item: string;
};

export type DetectedEntityDetailed = DetectedEntity & {
  timestamps: Timestamp[];
};

export type DetectedEntitiesSample = {
  count: number;
  items: DetectedEntity[];
};

export type DetectionMetadata = Record<DetectionCategory, DetectedEntitiesSample> & {
  index_status: 'in_progress' | 'completed';
  index_percentage: number;
};

// Queries

export type GetDetectionMetadataResponse = DetectionMetadata;
export type GetDetectionCategoryMetadataResponse = DetectedEntityDetailed[];

// Mutations
export type DownloadDetectionMetadataParams = {
  category?: DetectionCategory;
};

export type CreateDetectionAdPromptParams = {
  prompt: string;
};
