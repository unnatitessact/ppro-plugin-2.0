'use client';

import { cn } from '@nextui-org/react';

import { FolderLinkFilled } from '@tessact/icons';

import { ThumbnailStack } from '@/components/library/asset/FolderCard';

import { FolderSubContent } from '@/api-integration/types/library';

import { useLibraryStore } from '@/stores/library-store';

export const FolderThumbnail = ({
  subcontents,
  defaultAspectRatio,
  folderName,
  isConnectedFolder
}: {
  subcontents: FolderSubContent[];
  defaultAspectRatio?: 'horizontal' | 'vertical';
  folderName: string;
  isConnectedFolder: boolean;
}) => {
  const { aspectRatio: libraryAspectRatio } = useLibraryStore();

  const aspectRatio = defaultAspectRatio || libraryAspectRatio;

  return (
    <div
      className={cn(
        'relative rounded-2xl',
        'h-full bg-ds-asset-card-card-bg',
        'overflow-hidden',
        'flex flex-col justify-end',
        'pt-12'
      )}
    >
      <ThumbnailStack subcontents={subcontents} inAnimatedState={true} />
      <div
        className={cn(
          aspectRatio === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]',
          'noise rounded-2xl bg-ds-asset-card-card-bg',
          'h-[calc(100%-20px)] w-full p-5',
          'shadow-folder dark:shadow-folder-dark',
          'relative z-50',
          'flex items-center justify-center'
        )}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="max-w-[calc(100%-40px)] flex-1">
            <h3 className="overflow-hidden truncate">{folderName}</h3>
            <p className={cn('text-xs text-ds-text-secondary')}>Folder</p>
          </div>
          {isConnectedFolder && (
            <div className="h-5 w-5">
              <FolderLinkFilled size={20} className="text-ds-text-secondary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
