import { cn } from '@nextui-org/react';
import { Rating } from 'react-simple-star-rating';

interface PreviewRatingMetadataProps {
  label: string;
  value: number;
  showLabel?: boolean;
}

export const PreviewRatingMetadata = ({
  label,
  value,
  showLabel = true
}: PreviewRatingMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      <Rating
        readonly
        initialValue={value}
        size={16}
        SVGclassName="inline-flex -translate-y-1"
        className="h-4"
        fillClassName="h-4"
        emptyClassName="h-4"
      />
    </div>
  );
};
