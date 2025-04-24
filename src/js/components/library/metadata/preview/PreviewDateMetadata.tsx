import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { absoluteFormatDate } from '@/utils/dates';

interface PreviewDateMetadataProps {
  label: string;
  value: string;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewDateMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewDateMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={absoluteFormatDate(value)} words={highlight} />
      ) : (
        <p className="text-ds-text-primary">{absoluteFormatDate(value)}</p>
      )}
    </div>
  );
};
