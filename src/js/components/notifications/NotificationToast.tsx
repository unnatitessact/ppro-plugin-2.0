import React from 'react';

import { toast } from 'sonner';

import { CrossSmall } from '@tessact/icons';

import { Button } from '@/components/ui/Button';

import NotificationIcon from '@/components/notifications/NotificationIcon';
import NotificationText from '@/components/notifications/NotificationText';

import { useNotificationRedirect } from '@/hooks/useNotificationRedirect';

import { NotificationRoomEvent } from '@/api-integration/types/notifications';

const NotificationToast = ({
  id,
  event
}: {
  id: string | number;
  event: NotificationRoomEvent;
}) => {
  const { handleRedirect } = useNotificationRedirect();
  const handleNotificationClick = () => {
    handleRedirect(event.data);
    toast.dismiss(id);
  };

  return (
    <div
      onPointerDown={() => handleNotificationClick()}
      className="group relative flex h-auto w-[320px] cursor-pointer items-start gap-3 overflow-visible p-4"
    >
      <Button
        size="xs"
        isIconOnly
        className="absolute -left-0.5 -top-0.5 z-10 flex items-center justify-center rounded-full border border-ds-search-outline/60 bg-ds-search-bg/75  opacity-0 transition-colors-opacity hover:bg-ds-search-search-item-bg-hover group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          toast.dismiss(id);
        }}
        aria-label="Dismiss"
      >
        <CrossSmall size={16} />
      </Button>
      <NotificationIcon hideUnreadBadge notificationData={event.data} />
      <NotificationText notificationData={event.data} showTime />
    </div>
  );
};

export default NotificationToast;
