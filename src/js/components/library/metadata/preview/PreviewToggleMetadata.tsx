import { cn } from '@nextui-org/react';

interface PreviewToggleMetadataProps {
  label: string;
  value: boolean;
  showLabel?: boolean;
}

export const PreviewToggleMetadata = ({
  label,
  value,
  showLabel = true
}: PreviewToggleMetadataProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between', 'gap-x-5 gap-y-2', 'text-sm')}
    >
      {showLabel && <p className="font-medium text-ds-text-secondary">{label}</p>}
      <p className="text-ds-text-primary">{value ? 'Yes' : 'No'}</p>
    </div>
  );
};
