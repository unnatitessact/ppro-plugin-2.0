import { cn, Image } from '@nextui-org/react';

import { AspectRatio, Thumbnail, useLibraryStore } from '@/stores/library-store';

interface AssetThumbnailProps {
  thumbnailUrl: string;
  fileName: string;
  overrideAspectRatio?: AspectRatio;
  overrideThumbnail?: Thumbnail;
}

export const AssetThumbnail = ({
  thumbnailUrl,
  fileName,
  overrideAspectRatio,
  overrideThumbnail
}: AssetThumbnailProps) => {
  const { thumbnail, aspectRatio } = useLibraryStore();

  const aspectRatioToUse = overrideAspectRatio || aspectRatio;
  const thumbnailToUse = overrideThumbnail || thumbnail;

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-ds-asset-card-bg-hover',
        'overflow-hidden',
        aspectRatioToUse === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]'
      )}
    >
      <div className="pointer-events-none absolute z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      <Image
        src={thumbnailUrl}
        alt={fileName}
        className={cn(
          aspectRatioToUse === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]',
          thumbnailToUse === 'fit' ? 'object-contain' : 'object-cover object-center',
          'rounded-none transition-all',
          'flex h-full max-h-full w-full max-w-full'
        )}
        classNames={{ wrapper: 'flex h-full w-full' }}
      />
    </div>
  );
};
