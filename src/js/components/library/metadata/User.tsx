import { cn, Image } from '@nextui-org/react';

import UserFallback from '@/components/ui/UserFallback';

interface UserProps {
  image?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  color?: string;
}

export const User = ({
  image,
  name,
  size = 'sm',
  email = '',
  firstName,
  lastName,
  displayName,
  color
}: UserProps) => {
  const fallbackSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <div className={cn('flex items-center gap-2', size === 'lg' ? 'text-base' : 'text-sm')}>
      <div style={{ width: fallbackSize, height: fallbackSize }}>
        {image ? (
          <Image
            src={image}
            alt={name}
            height={fallbackSize}
            width={fallbackSize}
            className="rounded-full"
          />
        ) : (
          <UserFallback
            firstName={firstName}
            lastName={lastName}
            displayName={displayName}
            email={email}
            color={color}
          />
        )}
      </div>
      <span>{name}</span>
    </div>
  );
};
