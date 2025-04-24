'use client';

import { cn } from '@nextui-org/react';

import {
  FileBendFilled,
  FileTextFilled,
  ShapesPlusXSquareCircleFilled,
  VideoTrimFilled
} from '@tessact/icons';

import { useLibraryStore } from '@/stores/library-store';

const cardClass = (isSelected?: boolean, isAudio?: boolean) =>
  cn(
    'h-full w-full text-ds-text-secondary rounded-2xl p-4',
    'flex flex-col gap-1 justify-center items-center',
    'transition-colors duration-200',
    isSelected ? 'bg-ds-asset-card-bg-hover' : 'bg-ds-asset-card-bg-select',
    isAudio && 'bg-transparent'
  );

export const getIcon = (fileExtension?: string, size = 24) => {
  switch (fileExtension) {
    case '.tscript':
      return <FileTextFilled size={size} className="fill-ds-text-secondary" />;
    case '.tboard':
      return <ShapesPlusXSquareCircleFilled size={size} className="fill-ds-text-secondary" />;
    case '.tdraft':
      return <VideoTrimFilled size={size} className="fill-ds-text-secondary" />;
    case 'audio':
      return <div />;

    default:
      return <FileBendFilled size={size} className="fill-ds-text-secondary" />;
  }
};

export const IconThumbnail = ({
  isSelected,
  fileExtension,
  defaultAspectRatio
}: {
  isSelected?: boolean;
  fileExtension?: string;
  defaultAspectRatio?: 'horizontal' | 'vertical';
}) => {
  const { aspectRatio: libraryAspectRatio } = useLibraryStore();

  const aspectRatio = defaultAspectRatio || libraryAspectRatio;

  return (
    <div className={cn(aspectRatio === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]')}>
      <div className={cardClass(isSelected, fileExtension === 'audio')}>
        {getIcon(fileExtension)}
      </div>
    </div>
  );
};
