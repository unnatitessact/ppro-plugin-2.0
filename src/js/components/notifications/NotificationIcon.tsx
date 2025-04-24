// import React from 'react';

// import { cn } from '@nextui-org/react';

// import { At, BubbleText6, FileBend, LayersThree } from '@tessact/icons';

// import { Badge } from '@/components/ui/Badge';

// import { StatusIcon as ProjectStatusIcon } from '@/components/projects/asset/ProjectFolder';
// import { StatusIcon } from '@/components/StatusIcon';

// import { FileStatus } from '@/api-integration/types/library';
// import { NotificationRoomEventData } from '@/api-integration/types/notifications';

// import { StepStatusIcons } from '../workflow/nodes/components/StatusPill';
// import { nameToStatus } from './NotificationText';

// const NotificationIcon = ({
//   notificationData,
//   hideUnreadBadge
// }: {
//   notificationData: NotificationRoomEventData;
//   hideUnreadBadge?: boolean;
// }) => {
//   return (
//     <Badge
//       disableOutline
//       placement="top-left"
//       color="primary"
//       content={''}
//       shape="circle"
//       className="text-xs font-medium "
//       classNames={{
//         badge: cn(
//           'text-white w-2.5 h-2.5 border-none drop-shadow-blue-glow',
//           (hideUnreadBadge || notificationData.is_read) && 'hidden'
//         )
//       }}
//     >
//       <div className="flex h-10 w-10 flex-shrink-0 items-center  justify-center rounded-xl bg-ds-button-secondary-bg text-ds-text-primary">
//         <NotificationMappedIcon data={notificationData} />
//       </div>
//     </Badge>
//   );
// };

// export default NotificationIcon;

// const NotificationMappedIcon = ({ data }: { data: NotificationRoomEventData }) => {
//   const size = 20;
//   const event = data.event;
//   if (
//     event === 'NEW_COMMENTS_ON_FILES' ||
//     event === 'REPLIES_TO_COMMENTS' ||
//     event === 'NEW_COMMENTS_ON_PREV_COMMENTED'
//   ) {
//     return <BubbleText6 size={size} />;
//   }
//   if (
//     event === 'MENTIONED_IN_METADATA' ||
//     event === 'MENTIONS_FOR_YOU' ||
//     event === 'NEW_MENTIONS_IN_COMMENTS'
//   ) {
//     return <At size={size} />;
//   }
//   if (
//     event === 'FILES_REMOVED' ||
//     event === 'NEW_FILES_ADDED' ||
//     event === 'NEW_FILES_ADDED_LIBRARY' ||
//     event === 'FILE_METADATA_UPDATES'
//   ) {
//     return <FileBend size={size} />;
//   }
//   if (
//     event === 'NEW_TASK_CREATED' ||
//     event == 'TASK_ASSIGNED_TO_TEAM' ||
//     event === 'TASK_ASSIGNED_TO_YOU'
//   ) {
//     return <LayersThree size={size} />;
//   }

//   if (event === 'LIBRARY_FILE_STATUS_CHANGE' || event === 'PROJECT_FILE_STATUS_CHANGE') {
//     const newStatus = data.metadata.new_status.toLowerCase().split(' ').join('_') as FileStatus;
//     const derivedStatus = nameToStatus(data?.metadata?.new_status_name);

//     const status = newStatus ?? derivedStatus;
//     if (!status) {
//       return <LayersThree size={20} />;
//     }

//     return <StatusIcon size={20} status={status} />;
//   }

//   if (event === 'PROJECT_STATUS_CHANGE') {
//     const newStatus = data?.metadata?.new_status?.toLowerCase().split(' ').join('_') as FileStatus;
//     const derivedStatus = nameToStatus(data?.metadata?.new_status_name);

//     const status = newStatus ?? derivedStatus;

//     if (!status) {
//       // Edge where if backend provided new_status or new_status_name is null
//       return <LayersThree size={20} />;
//     }

//     return <ProjectStatusIcon size={20} status={status} />;
//   }

//   if (event === 'TASK_UPDATES') {
//     if (data?.metadata?.new_status) {
//       if (data?.metadata?.status_icon) {
//         return <StepStatusIcons size={20} icon={data?.metadata?.status_icon} />;
//       }
//     }
//   }

//   return <LayersThree size={size} />;
// };
