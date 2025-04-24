'use client';

import { useMemo, useState } from 'react';

import { useElementSize } from '@mantine/hooks';
import { cn, Image } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';

import { AspectRatio, Thumbnail, useLibraryStore } from '@/stores/library-store';

interface ScrubThumbnailProps {
  scrubUrl: string;
  thumbnailUrl: string;
  fileName: string;
  scrubWidth?: number;
  scrubHeight?: number;
  overrideAspectRatio?: AspectRatio;
  overrideThumbnail?: Thumbnail;
}

const COLUMNS = 10;
const ROWS = 10;

export const generateSprites = (spriteWidth: number, spriteHeight: number) => {
  const sprites = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      sprites.push({
        top: i * spriteHeight,
        left: j * spriteWidth
      });
    }
  }
  return sprites;
};

export const getHeight = (
  aspectRatio: string,
  thumbnail: string,
  scrubHeight: number,
  scrubWidth: number
) => {
  if (aspectRatio === 'vertical') {
    return thumbnail === 'fill' ? '100%' : 'auto';
  } else {
    return thumbnail === 'fill' || (thumbnail === 'fit' && scrubHeight >= scrubWidth)
      ? '100%'
      : 'auto';
  }
};

export const getWidth = (
  aspectRatio: string,
  thumbnail: string,
  scrubHeight: number,
  scrubWidth: number
) => {
  if (aspectRatio === 'vertical') {
    return thumbnail === 'fill' ? 'auto' : '100%';
  } else {
    return thumbnail === 'fit' && scrubHeight >= scrubWidth ? 'auto' : '100%';
  }
};

export const ScrubThumbnail = ({
  scrubUrl,
  thumbnailUrl,
  fileName,
  scrubWidth = 426,
  scrubHeight = 240,
  overrideAspectRatio,
  overrideThumbnail
}: ScrubThumbnailProps) => {
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);
  const [indexToShow, setIndexToShow] = useState<number | null>(null);

  const { thumbnail, aspectRatio } = useLibraryStore();

  const aspectRatioToUse = overrideAspectRatio || aspectRatio;
  const thumbnailToUse = overrideThumbnail || thumbnail;

  const sprites = useMemo(
    () => generateSprites(scrubWidth || 0, scrubHeight || 0),
    [scrubWidth, scrubHeight]
  );

  const { ref, height, width } = useElementSize();

  const scale = useMemo(() => {
    return Math.max(width / scrubWidth, height / scrubHeight);
  }, [width, height, scrubWidth, scrubHeight]);

  const scrubBackgroundPosition = useMemo(() => {
    const horizontalPosition = `-${sprites[indexToShow || 0]?.left * scale}px`;
    let verticalPosition = `-${sprites[indexToShow || 0]?.top * scale}px`;

    if (
      aspectRatioToUse === 'horizontal' &&
      scrubHeight > scrubWidth &&
      thumbnailToUse === 'fill'
    ) {
      const offsetY = (scrubHeight / 2) * scale;
      verticalPosition = `calc(${verticalPosition} + ${offsetY * scale}px)`;
    }

    return `${horizontalPosition} ${verticalPosition}`;
  }, [sprites, indexToShow, scale, aspectRatioToUse, thumbnailToUse, scrubHeight, scrubWidth]);

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-ds-asset-card-bg-hover',
        'group overflow-hidden',
        aspectRatioToUse === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]'
      )}
    >
      <AnimatePresence>
        {scrubPosition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-40 h-full w-0.5 bg-primary-400"
            style={{
              filter: 'drop-shadow(0px 4px 4px #3592FF)',
              transform: `translateX(${scrubPosition}px)`
            }}
          ></motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute z-50 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          zIndex: 30,
          pointerEvents: 'none',
          opacity: indexToShow ? 1 : 0,
          height: getHeight(aspectRatioToUse, thumbnailToUse, scrubHeight, scrubWidth),
          width: getWidth(aspectRatioToUse, thumbnailToUse, scrubHeight, scrubWidth),
          backgroundImage: `url(${scrubUrl})`,
          aspectRatio: `${scrubWidth} / ${scrubHeight}`,
          backgroundSize: `${scrubWidth * COLUMNS * scale}px ${scrubHeight * ROWS * scale}px`,
          backgroundPosition: scrubBackgroundPosition,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
      <Image
        src={thumbnailUrl}
        alt={fileName}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const percentage = mouseX / rect.width;
          const index = Math.round(percentage * ROWS * COLUMNS);
          setIndexToShow(index);
          setScrubPosition(mouseX);
        }}
        className={cn(
          aspectRatioToUse === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]',
          thumbnailToUse === 'fit' ? 'object-contain' : 'object-cover object-center',
          'h-full w-full'
        )}
        classNames={{ wrapper: 'flex h-full w-full' }}
        onMouseLeave={() => {
          setScrubPosition(null);
          setIndexToShow(null);
        }}
      />
    </div>
  );
};
