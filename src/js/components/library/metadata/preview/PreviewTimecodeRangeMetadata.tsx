import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { TimecodeRangeValue } from '@/api-integration/types/metadata';

interface PreviewTimecodeRangeMetadataProps {
  label: string;
  value: TimecodeRangeValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewTimecodeRangeMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewTimecodeRangeMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      {highlight ? (
        <HighlightedText text={`${value[0]} - ${value[1]}`} words={highlight} />
      ) : (
        <p className="text-ds-text-primary">{`${value[0]} - ${value[1]}`}</p>
      )}
    </div>
  );
};
