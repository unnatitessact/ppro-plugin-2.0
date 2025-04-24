import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { SelectValue } from '@/api-integration/types/metadata';

interface PreviewSelecttMetadataProps {
  label: string;
  value: SelectValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewSelecttMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewSelecttMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={value.value} words={highlight || []} />
      ) : (
        <p className="text-ds-text-primary">{value.value}</p>
      )}
    </div>
  );
};
