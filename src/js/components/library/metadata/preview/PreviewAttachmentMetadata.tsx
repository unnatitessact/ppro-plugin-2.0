import { cn } from '@nextui-org/react';

import HighlightedText from '@/components/search/utils-component/HighlightText';

import { AttachmentValue } from '@/api-integration/types/metadata';

interface PreviewAttachmentMetadataProps {
  label: string;
  value: AttachmentValue;
  highlight?: string[];
  showLabel?: boolean;
}

export const PreviewAttachmentMetadata = ({
  label,
  value,
  highlight,
  showLabel = true
}: PreviewAttachmentMetadataProps) => {
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
