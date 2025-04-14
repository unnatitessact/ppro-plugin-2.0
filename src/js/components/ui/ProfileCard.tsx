import React from 'react';

import { cn } from '@nextui-org/react';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import UserFallback from '@/components/ui/UserFallback';

import { PROFILE_COMBINATIONS } from '@/data/colors';

interface CardProps {
  data: {
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email: string;
    color?: string;
  };
  primaryText: string;
  secondaryText?: string;
  removePadding?: boolean;
}

const ProfileCard = ({ data, primaryText, secondaryText, removePadding }: CardProps) => {
  const profileColorClass = PROFILE_COMBINATIONS[data.color || 0];
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg  text-sm font-medium',
        removePadding ? 'p-0' : 'p-2'
      )}
    >
      <Badge placement="bottom-right" color="success" size="xs" content="">
        <Avatar
          className={cn('h-7 w-7 border-none', profileColorClass)}
          src={data.profilePicture ?? ''}
          showFallback
          classNames={{
            fallback: 'w-full h-full flex items-center justify-center'
          }}
          fallback={
            <UserFallback
              firstName={data.firstName ?? ''}
              lastName={data.lastName ?? ''}
              displayName={data.displayName ?? ''}
              email={data.email}
              color={data.color}
              className="text-sm"
            />
          }
        />
      </Badge>
      <div className="flex flex-col font-medium">
        <p className={cn('text-ds-menu-text-primary')}>{primaryText}</p>
        {secondaryText && <p className="text-xs text-ds-text-secondary">{secondaryText}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
