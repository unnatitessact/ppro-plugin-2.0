import type { ReactNode } from 'react';

export const TechnicalMetadataItem = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-ds-text-primary">
      <p className="text-right text-ds-text-secondary">{label}</p>
      <span>:</span>
      <div
        style={{
          wordBreak: 'break-word'
        }}
      >
        {value}
      </div>
    </div>
  );
};
