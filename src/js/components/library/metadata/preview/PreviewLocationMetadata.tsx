import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { LocationValue } from '@/api-integration/types/metadata';

interface PreviewLocationMetadataProps {
  label: string;
  value: LocationValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewLocationMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewLocationMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={value.name} words={highlight} />
      ) : (
        <p className="text-ds-text-primary">{value.name}</p>
      )}
    </div>
  );
};
