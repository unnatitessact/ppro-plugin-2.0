export const subtitle_language_codes = [
  'english',
  'english_uk',
  'spanish',
  'french',
  'german',
  'bengali',
  'hindi',
  'malayalam',
  'gujarati',
  'kannada',
  'marathi',
  'punjabi',
  'tamil',
  'telugu',
  'urdu',
  'arabic',
  'chinese',
  'japanese',
  'korean',
  'portuguese',
  'russian',
  'turkish',
  'italian',
  'greek',
  'dutch',
  'polish',
  'romanian',
  'swedish',
  'norwegian',
  'finnish',
  'danish'
] as const;

export type SubtitleLanguageCode = (typeof subtitle_language_codes)[number] | 'source' | '';

export type Subtitle = {
  id: string;
  eta: number;
  language_code: SubtitleLanguageCode;
  platform: string;
  url: string;
  file_type: 'srt' | 'vtt';
  process_status: 'in_progress' | 'completed';
  is_auto_generated: boolean;
};

export type GetSubtitleListResponse = Subtitle[];
