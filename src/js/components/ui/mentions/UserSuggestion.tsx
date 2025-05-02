import type { SuggestionDataItem } from 'react-mentions';

import { useEffect, useRef } from 'react';

import { cn } from '@nextui-org/react';

import ProfileCard from '@/components/ui/ProfileCard';

import { User } from '@/api-integration/types/auth';

interface UserSuggestionProps {
  isActive: boolean;
  userData: User & SuggestionDataItem;
}

const UserSuggestion = ({ isActive, userData }: UserSuggestionProps) => {
  const fullName =
    userData.profile.display_name ??
    `${userData.profile.first_name ?? ''} ${userData.profile.last_name ?? ''}`.trim();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-lg hover:bg-ds-timestamp-bg-hover',
        isActive && 'bg-ds-timestamp-bg-hover'
      )}
    >
      <ProfileCard
        data={{
          email: userData.email,
          firstName: userData.profile.first_name,
          lastName: userData.profile.last_name,
          displayName: userData.profile.display_name,
          color: userData.profile.color,
          profilePicture: userData.profile.profile_picture ?? ''
        }}
        primaryText={fullName}
        secondaryText={userData.email}
      />
    </div>
  );
};

export default UserSuggestion;
