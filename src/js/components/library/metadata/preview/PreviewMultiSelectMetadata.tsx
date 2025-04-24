import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { MultiselectValue } from '@/api-integration/types/metadata';

interface PreviewMutliSelectMetadataProps {
  label: string;
  value: MultiselectValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewMutliSelectMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewMutliSelectMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText
          text={value.map((v) => v.value).join(', ') || ''}
          words={highlight || []}
        />
      ) : (
        <p className="text-ds-text-primary">{value.map((v) => v.value).join(', ')}</p>
      )}
    </div>
  );
};
