import { forwardRef } from 'react';

import { usePlayerContext } from '@/context/player';
import { ChipProps, cn, extendVariants } from '@nextui-org/react';

import { Hashtag, Writing } from '@tessact/icons';

import { Chip } from '@/components/ui/Chip';
import { NextAvatar } from '@/components/ui/NextAvatar';

import { renderValue } from '@/utils/videoUtils';

export const TagsPillDefault = extendVariants(Chip, {
  defaultVariants: {
    type: 'default'
  },
  variants: {
    type: {
      default: {
        base: 'bg-ds-pills-tags-bg py-1.5 px-2 flex gap-1 items-center text-ds-pills-tags-text h-8 w-auto rounded-xl',
        avatar: 'w-5 h-5 rounded-full p-0 border-none flex-shrink-9',
        content: 'text-sm font-medium p-0'
      }
    }
  }
});

export const TagsPill = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  return (
    <TagsPillDefault
      ref={ref}
      className={cn(!!props.startContent || (!!props.avatar && 'px-1.5'))}
      {...props}
    />
  );
});

TagsPill.displayName = 'TagsPill';

export const AvatarCommentPill = ({
  firstName,
  lastName,
  displayName,
  src,
  color,
  email
}: {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  src?: string;
  color?: string;
  email: string;
}) => {
  return (
    <TagsPill
      avatar={
        <NextAvatar
          src={src}
          alt={email}
          width={20}
          height={20}
          userFallbackProps={{
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
            email: email,
            color: color,
            className: 'text-sm'
          }}
        />
        // <Avatar
        //   radius="full"
        //   name={displayName ?? firstName ?? lastName ?? email}
        //   src={src ?? undefined}
        //   showFallback
        //   size="sm"
        //   classNames={{
        //     base: cn('w-5 h-5', PROFILE_COMBINATIONS[color || 0]),
        //     fallback: cn('w-5 h-5', PROFILE_COMBINATIONS[color || 0])
        //   }}
        //   fallback={
        //     <UserFallback
        //       email={email ?? ''}
        //       firstName={firstName}
        //       displayName={displayName}
        //       lastName={lastName}
        //       color={color}
        //       className='text-sm'
        //     />
        //   }
        // />
      }
    >
      {displayName ?? firstName ?? lastName ?? email}
    </TagsPill>
  );
};

export const TimerangeCommentPill = ({
  startTime,
  endTime
}: {
  startTime: number;
  endTime: number;
}) => {
  const {
    playerState: { timeFormat, fps }
  } = usePlayerContext();
  const start = renderValue(startTime, timeFormat, fps);
  const end = renderValue(endTime, timeFormat, fps);
  return <TagsPill>{`${start} - ${end}`}</TagsPill>;
};

export const TimestampCommentPill = ({ timestamp }: { timestamp: number }) => {
  const {
    playerState: { timeFormat, fps }
  } = usePlayerContext();
  const time = renderValue(timestamp, timeFormat, fps);
  return <TagsPill>{time}</TagsPill>;
};

export const FramerangeCommentPill = ({
  startFrame,
  endFrame
}: {
  startFrame: string;
  endFrame: string;
}) => {
  return <TagsPill>{`${startFrame} - ${endFrame}`}</TagsPill>;
};

export const FramestampCommentPill = ({ framestamp }: { framestamp: string }) => {
  return <TagsPill>{framestamp}</TagsPill>;
};

export const TagCommentPill = ({ tag }: { tag: string }) => {
  return <TagsPill startContent={<Hashtag size={16} />}>{tag.replace('#', '')}</TagsPill>;
};

export const MarkerCommentPill = () => {
  return (
    <TagsPill>
      <Writing size={16} />
    </TagsPill>
  );
};
