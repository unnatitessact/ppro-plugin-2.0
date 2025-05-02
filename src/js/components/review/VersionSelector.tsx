import { useEffect, useRef } from 'react';

import { cn, Spacer } from '@nextui-org/react';

import { FileCard, PhysicalAssetThumbnail, Thumbnail } from '@/components/library/LibraryTableView';

import { VersionStackItemDetailed } from '@/api-integration/types/library';

interface VersionSelectorProps {
  selectedVersionId: string;
  versions: VersionStackItemDetailed[];
  onVersionChange: (versionId: string) => void;
}

export const VersionSelector = ({
  selectedVersionId,
  versions,
  onVersionChange
}: VersionSelectorProps) => {
  return (
    <div className="no-scrollbar flex h-full items-center gap-1 overflow-x-auto">
      <Spacer x={40} />
      {[...versions].reverse().map((version) => (
        <VersionButton
          key={version.id}
          version={version}
          onPress={() => onVersionChange(version.file.id)}
          isSelected={selectedVersionId === version.file.id}
        />
        // <Button key={version.id} variant="light" onPress={() => onVersionChange(version.file.id)}>
        //   {version.version_number}
        // </Button>
      ))}
      <Spacer x={40} />
    </div>
  );
};

const VersionButton = ({
  version,
  onPress,
  isSelected
}: {
  version: VersionStackItemDetailed;
  onPress: () => void;
  isSelected: boolean;
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      divRef?.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [isSelected]);
  return (
    <div
      ref={divRef}
      key={version.id}
      onClick={onPress}
      className={cn(
        'flex h-[84px] w-[102px] flex-col items-center justify-center gap-1 opacity-80 transition-opacity transform-gpu',
        isSelected && 'h-[94px] opacity-100'
      )}
    >
      <div
        className={cn(
          'w-full transition-height [&_div]:aspect-auto [&_div]:h-[54px] [&_div]:w-[102px] [&_div]:transition-height [&_div]:transform-gpu',
          isSelected && '[&_div]:h-[70px]'
        )}
      >
        {version.file.resourcetype === 'VideoFile' || version.file.resourcetype === 'ImageFile' ? (
          <Thumbnail fileName={version.file.name} thumbnailUrl={version.file.thumbnail || ''} />
        ) : version.file.resourcetype === 'PhysicalAsset' ? (
          <PhysicalAssetThumbnail
            barcode={version.file.barcode}
            thumbnailUrl={version.file.asset_image || ''}
          />
        ) : (
          <FileCard fileExtension={version.file.file_extension} />
        )}
      </div>
      <span
        className={cn(
          'text-base font-medium',
          isSelected ? 'text-ds-text-primary' : 'text-ds-text-secondary'
        )}
      >
        v{version.version_number}
      </span>
    </div>
  );
};
