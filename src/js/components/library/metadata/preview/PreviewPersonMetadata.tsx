import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { PersonValue } from '@/api-integration/types/metadata';

interface PreviewPersonMetadataProps {
  label: string;
  value: PersonValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewPersonMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewPersonMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={value.display_name} words={highlight || []} />
      ) : (
        <p className="text-ds-text-primary">{value.display_name}</p>
      )}
    </div>
  );
};
