import type { ReactNode } from 'react';

export const MetadataInfoItem = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-ds-asset-preview-text-primary">
      <p className="text-right text-ds-asset-preview-text-secondary">{label}</p>
      <span>:</span>
      {value}
    </div>
  );
};
