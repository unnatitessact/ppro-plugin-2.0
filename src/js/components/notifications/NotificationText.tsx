// import React from 'react';

// import { NotificationRoomEventData } from '@/api-integration/types/notifications';

// import { formatDate } from '@/utils/dates';

// const NotificationText = ({
//   notificationData,
//   showTime
// }: {
//   notificationData: NotificationRoomEventData;
//   showTime?: boolean;
// }) => {
//   return (
//     <div className="flex  flex-col flex-wrap items-start gap-1 whitespace-normal text-sm ">
//       <div className="w-full break-words text-ds-text-secondary">
//         <NotificationTextFormatted notificationData={notificationData} />
//       </div>
//       {showTime && (
//         <div className=" w-full whitespace-break-spaces text-ds-text-secondary">
//           {formatDate(notificationData?.created_on)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationText;

// const NotificationTextFormatted = ({
//   notificationData
// }: {
//   notificationData: NotificationRoomEventData;
// }) => {
//   const event = notificationData.event;

//   if (event === 'REPLIES_TO_COMMENTS') {
//     return (
//       <>
//         Your comment on <Highlight>{notificationData.metadata.file_name}</Highlight> has received a
//         new reply
//       </>
//     );
//   }

//   if (event === 'MENTIONS_FOR_YOU') {
//     return (
//       <>
//         You were mentioned in a comment on{' '}
//         <Highlight>{notificationData.metadata.file_name}</Highlight>
//       </>
//     );
//   }
//   if (event === 'NEW_COMMENTS_ON_PREV_COMMENTED') {
//     return (
//       <>
//         A new comment added on <Highlight>{notificationData.metadata.file_name}</Highlight> where
//         you previously commented
//       </>
//     );
//   }

//   if (event === 'MENTIONED_IN_METADATA') {
//     return (
//       <>
//         You were mentioned in the <Highlight>{notificationData.metadata.field_name}</Highlight>{' '}
//         metadata field of <Highlight>{notificationData.metadata.file_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'LIBRARY_FILE_STATUS_CHANGE') {
//     return (
//       <>
//         The status of <Highlight>{notificationData.metadata.file_name}</Highlight> has changed to{' '}
//         <Highlight>
//           {statusToText(notificationData?.metadata?.new_status) ??
//             notificationData?.metadata?.new_status_name ??
//             ''}
//         </Highlight>
//       </>
//     );
//   }

//   if (event === 'NEW_FILES_ADDED_LIBRARY') {
//     return (
//       <>
//         A new file <Highlight>{notificationData.metadata.file_name}</Highlight> has been added to
//         the library
//       </>
//     );
//   }

//   if (event === 'PROJECT_STATUS_CHANGE') {
//     return (
//       <>
//         <Highlight>{notificationData.metadata.project_name}</Highlight> status has been changed to{' '}
//         <Highlight>
//           {statusToText(notificationData?.metadata?.new_status) ??
//             notificationData?.metadata?.new_status_name ??
//             ''}
//         </Highlight>
//       </>
//     );
//   }

//   if (event === 'NEW_TASK_CREATED') {
//     return (
//       <>
//         New task <Highlight>{notificationData.metadata.task_name}</Highlight> has been created in{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'TASK_UPDATES') {
//     return (
//       <>
//         Task <Highlight>{notificationData.metadata.task_name}</Highlight> in{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight> has been updated to{' '}
//         <Highlight>
//           {notificationData.metadata.new_value ?? notificationData?.metadata?.new_status}
//         </Highlight>
//       </>
//     );
//   }

//   if (event === 'TASK_ASSIGNED_TO_YOU') {
//     return (
//       <>
//         You have been assigned to the task{' '}
//         <Highlight>{notificationData.metadata.task_name}</Highlight> in{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'TASK_ASSIGNED_TO_TEAM') {
//     return (
//       <>
//         A new task <Highlight>{notificationData.metadata.task_name}</Highlight> has been assigned to
//         your team in <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'NEW_FILES_ADDED') {
//     return (
//       <>
//         A new file <Highlight>{notificationData.metadata.file_name}</Highlight> has been added to
//         project <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'FILES_REMOVED') {
//     return (
//       <>
//         A new file <Highlight>{notificationData.metadata.file_name}</Highlight> has been removed
//         from project <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'NEW_COMMENTS_ON_FILES') {
//     return (
//       <>
//         New comment added to file <Highlight>{notificationData.metadata.file_name}</Highlight> in
//         project <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'NEW_MENTIONS_IN_COMMENTS') {
//     return (
//       <>
//         You were mentioned in a comment on file{' '}
//         <Highlight>{notificationData.metadata.file_name}</Highlight> in project{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight>
//       </>
//     );
//   }

//   if (event === 'FILE_METADATA_UPDATES') {
//     return (
//       <>
//         Metadata for file <Highlight>{notificationData.metadata.file_name}</Highlight> in project{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight> has been updated.
//       </>
//     );
//   }

//   if (event === 'PROJECT_FILE_STATUS_CHANGE') {
//     return (
//       <>
//         File <Highlight>{notificationData.metadata.file_name}</Highlight> in project{' '}
//         <Highlight>{notificationData.metadata.project_name}</Highlight> has changed status to{' '}
//         <Highlight>
//           {statusToText(notificationData.metadata.new_status) ??
//             notificationData?.metadata?.new_status_name ??
//             ''}
//         </Highlight>
//       </>
//     );
//   }
// };

// const Highlight = ({ children }: { children: React.ReactNode }) => (
//   <span className="break-all text-ds-text-primary">{children}</span>
// );

// export const statusToText = (status?: string) => {
//   if (!status) {
//     return undefined;
//   }
//   // status is a string, maybe having a underscore, as such approved, not_started
//   // we return a human readable version of the status
//   // by splliting on underscore, and making the first letter of each word uppercase
//   return status
//     .split('_')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// export const nameToStatus = (name?: string) => {
//   if (!name) return undefined;

//   return name
//     .split(' ')
//     .map((word) => word.toLowerCase())
//     .join('_');
// };
