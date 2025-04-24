import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

interface PreviewTimecodeMetadataProps {
  label: string;
  value: string;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewTimecodeMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewTimecodeMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={value} words={highlight} />
      ) : (
        <p className="text-ds-text-primary">{value}</p>
      )}
    </div>
  );
};
