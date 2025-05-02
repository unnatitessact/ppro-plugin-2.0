import { FileLockFilled } from '@tessact/icons';

export const FilePreview = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <FileLockFilled size={64} className="text-ds-text-secondary" />
      <p>This file type is not supported for preview at the moment</p>
    </div>
  );
};
