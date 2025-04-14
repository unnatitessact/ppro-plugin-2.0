import { CSSProperties } from 'react';

import NextImage from 'next/image';

import { cn } from '@nextui-org/react';

import UserFallback, { UserFallbackProps } from '@/components/ui/UserFallback';

interface NextAvatarProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  userFallbackProps: UserFallbackProps;
  style?: CSSProperties;
  nextImageStyle?: CSSProperties;
  unoptimized?: boolean;
}

export const NextAvatar = ({
  src,
  alt,
  width,
  height,
  userFallbackProps,
  style,
  nextImageStyle,
  unoptimized = true
}: NextAvatarProps) => {
  return (
    <div
      className={cn('flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full')}
      style={{
        height: height ?? 24,
        width: width ?? 24,
        ...style
      }}
    >
      {src ? (
        <NextImage
          unoptimized={unoptimized}
          className="h-full w-full rounded-full"
          quality={100}
          alt={alt}
          src={src}
          width={width ?? 24}
          height={height ?? 24}
          style={{
            ...nextImageStyle
          }}
        />
      ) : (
        <UserFallback {...userFallbackProps} />
      )}
    </div>
  );
};
