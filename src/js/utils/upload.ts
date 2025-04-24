const documentMimeTypes = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/vnd.oasis.opendocument.text',
  'text/plain',
  'application/rtf'
];
const spreadsheetMimeTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.oasis.opendocument.spreadsheet'
];

export const getFileTypeFromMimeType = (mimeType: string) => {
  if (mimeType.includes('video') || mimeType === 'application/mxf') return 'video';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('audio')) return 'audio';
  if (spreadsheetMimeTypes.includes(mimeType)) return 'spreadsheet';
  if (documentMimeTypes.includes(mimeType)) return 'document';
  return 'other';
};

export const getOptimalPartSize = (fileSize: number) => {
  const LOWER_LIMIT = 5 * 1024 * 1024;
  const UPPER_LIMIT = 100 * 1024 * 1024;

  const perPartSize = fileSize / 20;
  if (perPartSize < LOWER_LIMIT) return LOWER_LIMIT;
  if (perPartSize > UPPER_LIMIT) return UPPER_LIMIT;
  return perPartSize;
};
