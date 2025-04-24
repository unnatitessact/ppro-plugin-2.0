// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";

// import useAuth from "../../hooks/useAuth";

// import {
//   LiveShapePreview,
//   RoomProvider,
//   useEventListener,
// } from "../../../../liveblocks.config";
// import appIcon from "../../public/desktop-app-logo.png";
// import { useHotkeys } from "@mantine/hooks";
// import { cn, Skeleton } from "@nextui-org/react";
// import { useQueryClient } from "@tanstack/react-query";
// import { platform } from "@todesktop/client-core";
// import { useInView } from "react-intersection-observer";
// import { toast } from "sonner";

// import { Bell, SettingsSliderVer } from "@tessact/icons";

// import { Badge } from "../ui/Badge";
// import { Button } from "../ui/Button";
// import { Kbd } from "../ui/Kbd";
// import { Listbox, ListboxItem } from "../ui/Listbox";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
// // import { Popover, PopoverTrigger } from '@/components/ui/RadixPopover';
// import { ScrollShadow } from "../ui/ScrollShadow";

// // import { TranslucentPopoverContent } from '@/components/ui/TranslucentPopoverContent';

// import NotificationItem from "../notifications/NotificationItem";
// import NotificationToast from "../notifications/NotificationToast";
// import { defaultShape } from "../review/markers-canvas/sha";

// import { useNotificationRedirect } from "../../hooks/useNotificationRedirect";
// import { useWorkspace } from "../../hooks/useWorkspace";

// import {
//   useMarkAllNotificationAsRead,
//   useMarkNotificationAsRead,
// } from "../../api-integration/mutations/notifications";
// import {
//   notificationListQueryKey,
//   notificationUnreadCountQueryKey,
//   useNotificationListQuery,
//   useNotificationSettings,
//   useNotificationUnreadCountQuery,
// } from "@/api-integration/queries/notifications";
// import {
//   NotificationRoomEvent,
//   NotificationRoomEventData,
// } from "@/api-integration/types/notifications";

// import { usePreferencesStore } from "@/stores/preferences-store";
// import { useReviewStore } from "@/stores/review-store";

// const NotificationBell = () => {
//   const queryClient = useQueryClient();
//   const { workspace } = useWorkspace();

//   const { setIsPreferencesModalOpen, setSelectedItem } = usePreferencesStore();

//   const [isOpen, setIsOpen] = useState(false);

//   const { handleRedirect } = useNotificationRedirect();

//   const [selectedNotification, setSelectedNotification] = useState<
//     string | null
//   >(null);

//   const { ref: infiniteScrollRef, inView } = useInView();

//   const {
//     data: paginatedNotificationsList,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage,
//   } = useNotificationListQuery();

//   const notifications = useMemo(
//     () =>
//       paginatedNotificationsList?.pages.flatMap((page) => page.results ?? []) ??
//       [],
//     [paginatedNotificationsList]
//   ) as NotificationRoomEventData[];

//   // console.log('notifications', notifications);

//   const { data: unreadCount } = useNotificationUnreadCountQuery();

//   const { mutate: markAllAsRead } = useMarkAllNotificationAsRead();
//   const { mutate: markAsRead } = useMarkNotificationAsRead();

//   const { data: settings } = useNotificationSettings();

//   const handleOpenNotificationPreferences = () => {
//     setIsOpen(false);
//     setIsPreferencesModalOpen(true);
//     setSelectedItem("notifications");
//   };

//   const handleMarkAllAsRead = () => {
//     setIsOpen(false);
//     markAllAsRead();
//   };

//   const handleNotificationClick = (notification: NotificationRoomEventData) => {
//     handleRedirect(notification);
//     setIsOpen(false);
//   };

//   useEventListener(({ event: e }) => {
//     const event = e as NotificationRoomEvent;

//     if (event.type === "NEW_NOTIFICATION") {
//       queryClient.invalidateQueries({
//         queryKey: notificationListQueryKey(workspace?.id),
//       });
//       queryClient.invalidateQueries({
//         queryKey: notificationUnreadCountQueryKey(workspace?.id),
//       });

//       if (
//         settings?.local &&
//         settings?.browser &&
//         (platform.todesktop.isDesktopApp() ||
//           Notification.permission === "granted")
//       ) {
//         const newNotificationData = event?.data as NotificationRoomEventData;
//         // console.log('newNotificationData', newNotificationData);
//         const title = newNotificationData.title;
//         const options = {
//           body: newNotificationData.body,
//           icon: appIcon.src,
//           badge: appIcon.src,
//           sound: "/notification-sound.mp3",
//         };

//         const noti = new Notification(title, options);
//         noti.onclick = () => {
//           handleRedirect(newNotificationData);
//         };
//         // console.log('noti', noti);
//       }

//       if (isOpen) {
//         toast.dismiss();
//         return;
//       }
//       toast.custom((t) => <NotificationToast id={t} event={event} />, {
//         position: "top-right",
//         unstyled: true,
//         closeButton: true,
//         duration: 3000,
//         classNames: {
//           toast:
//             "flex !w-[320px] !mt-12 !border !border-ds-search-outline/60 !bg-ds-search-bg/60 !rounded-5 !backdrop-blur-md !hover:bg-ds-search-search-item-bg-hover/60",
//         },
//       });
//       // pushNotifications.start('12345678901');
//     }
//   });

//   useEffect(() => {
//     if (inView && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage, hasNextPage]);

//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     let timeout: NodeJS.Timeout | undefined;

//     if (isOpen) {
//       // select the first notification by default
//       if (notifications.length > 0) {
//         toast.dismiss();
//         setSelectedNotification(notifications?.[0]?.id);
//       }
//     }

//     return () => {
//       if (timeout) {
//         clearTimeout(timeout);
//       }
//     };
//   }, [isOpen, notifications]);

//   const toggle = () => {
//     setIsOpen((prev) => !prev);
//   };

//   useHotkeys([
//     [
//       "n",
//       () => {
//         toggle();
//       },
//     ],

//     [
//       "x",
//       () => {
//         if (isOpen && unreadCount && unreadCount > 0) {
//           handleMarkAllAsRead();
//         }
//       },
//     ],

//     [
//       "e",
//       () => {
//         if (
//           isOpen &&
//           selectedNotification &&
//           selectedNotificationPopulated &&
//           !selectedNotificationPopulated.is_read
//         ) {
//           markAsRead(selectedNotification);
//         }
//       },
//     ],
//     [
//       "ArrowDown",
//       () => {
//         if (isOpen && selectedNotification && notifications) {
//           const index = notifications.findIndex(
//             (notification) => notification.id === selectedNotification
//           );
//           if (index + 1 < notifications.length) {
//             setSelectedNotification(notifications[index + 1].id);
//           }
//         }
//       },
//     ],
//     [
//       "ArrowUp",
//       () => {
//         if (isOpen && selectedNotification && notifications) {
//           const index = notifications.findIndex(
//             (notification) => notification.id === selectedNotification
//           );
//           if (index - 1 >= 0) {
//             setSelectedNotification(notifications[index - 1].id);
//           }
//         }
//       },
//     ],
//   ]);

//   const selectedNotificationPopulated = useMemo(() => {
//     return notifications?.find(
//       (notification) => notification.id === selectedNotification
//     );
//   }, [selectedNotification, notifications]);

//   return (
//     <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
//       <PopoverTrigger>
//         <Button
//           isIconOnly
//           variant="light"
//           ref={buttonRef}
//           className="overflow-visible"
//           aria-label="Notifications"
//         >
//           <Badge
//             placement="top-right"
//             color="danger"
//             content={
//               unreadCount ? (unreadCount > 99 ? "99+" : unreadCount) : undefined
//             }
//             shape="rectangle"
//             className="text-xs font-medium"
//             classNames={{
//               base: "mx-2",
//               badge: cn("text-white", unreadCount === 0 && "hidden"),
//             }}
//           >
//             <Bell size={20} />
//           </Badge>
//         </Button>
//       </PopoverTrigger>
//       {/* <TranslucentPopoverContent
//         align="end"
//         side="bottom"
//         onOpenAutoFocus={(e) => e.preventDefault()}
//         onCloseAutoFocus={(e) => e.preventDefault()}
//         autoFocus={false}
//       > */}
//       <PopoverContent className="p-0">
//         <div className="relative flex h-full max-h-[532px] min-h-48 w-80 flex-1 flex-col overflow-hidden">
//           <div className="flex w-full justify-between border-b-1 border-ds-search-outline px-4 py-2">
//             <div className="flex items-center gap-2">
//               <p className="text-sm font-medium">Notifications</p>
//               <Kbd className="h-5 w-5 flex-shrink-0 text-xs font-medium">N</Kbd>
//             </div>
//             <Button
//               isIconOnly
//               size="sm"
//               variant="light"
//               className="text-ds-text-secondary"
//               onPress={handleOpenNotificationPreferences}
//               aria-label="Notification preferences"
//             >
//               <SettingsSliderVer size={20} />
//             </Button>
//           </div>
//           <div className="flex h-full w-full flex-1 items-center justify-center overflow-hidden">
//             <ScrollShadow
//               showTopBorder={false}
//               showBottomBorder={true}
//               className="h-full max-h-[430px] w-full"
//             >
//               <div className="flex flex-col">
//                 {notifications && notifications?.length > 0 ? (
//                   <Listbox
//                     aria-label="notification list"
//                     disallowEmptySelection
//                     className="bg-transparent p-0"
//                     classNames={{
//                       list: "gap-0",
//                       base: "rounded-none",
//                     }}
//                     selectionMode={
//                       unreadCount && unreadCount > 0 ? "single" : "none"
//                     }
//                     hideEmptyContent
//                     hideSelectedIcon
//                     selectedKeys={
//                       selectedNotification
//                         ? new Set([selectedNotification])
//                         : new Set([])
//                     }
//                     onSelectionChange={(keys) => {
//                       const value = Array.from(keys)[0];
//                       setSelectedNotification(value as string);
//                     }}
//                   >
//                     {notifications.map((notification) => (
//                       <ListboxItem
//                         aria-label="notification item"
//                         shouldFocusOnHover
//                         key={notification.id}
//                         className="rounded-none p-0 data-[hover=true]:bg-ds-search-search-item-bg-hover/60 data-[selected=true]:bg-ds-search-search-item-bg-selected/30 data-[focus-visible=true]:-outline-offset-2"
//                         onMouseEnter={() =>
//                           setSelectedNotification(notification.id)
//                         }
//                         onFocus={() => setSelectedNotification(notification.id)}
//                         onPress={() => handleNotificationClick(notification)}
//                       >
//                         <NotificationItem
//                           key={notification.id}
//                           notification={notification}
//                           isSelected={selectedNotification === notification.id}
//                         />
//                       </ListboxItem>
//                     ))}
//                   </Listbox>
//                 ) : (
//                   <div className="flex h-full w-full flex-col items-center justify-center gap-6">
//                     <p className="text-sm text-ds-text-secondary">
//                       No new notifications
//                     </p>
//                   </div>
//                 )}
//               </div>
//               {isFetchingNextPage && (
//                 <div className="flex w-full items-center gap-3 px-4 py-3">
//                   <Skeleton className="h-10 w-10 flex-shrink-0 rounded-xl" />
//                   <div className="flex h-10 w-full flex-col gap-2">
//                     <Skeleton className="h-6 w-full rounded-lg" />
//                     <Skeleton className="h-2 w-1/3  rounded-lg " />
//                   </div>
//                 </div>
//               )}
//               <div ref={infiniteScrollRef} />
//             </ScrollShadow>
//           </div>
//           {unreadCount && unreadCount > 0 ? (
//             <>
//               <div className="pb-12" />
//               <div className="absolute bottom-0 flex w-full items-center gap-2 bg-ds-button-secondary-bg p-2">
//                 {unreadCount && unreadCount > 0 ? (
//                   <Button
//                     variant="light"
//                     size="sm"
//                     startContent={
//                       <Kbd className="flex h-5 w-4 items-center justify-center text-xs font-medium">
//                         X
//                       </Kbd>
//                     }
//                     onPress={() => {
//                       handleMarkAllAsRead();
//                     }}
//                   >
//                     Mark all as read
//                   </Button>
//                 ) : null}
//                 {selectedNotification &&
//                   selectedNotificationPopulated &&
//                   !selectedNotificationPopulated.is_read && (
//                     <Button
//                       variant="light"
//                       size="sm"
//                       startContent={
//                         <Kbd className="flex h-5 w-4 items-center justify-center text-xs font-medium">
//                           E
//                         </Kbd>
//                       }
//                       aria-label="Mark read"
//                       onPress={() => {
//                         markAsRead(selectedNotification);
//                       }}
//                     >
//                       Mark read
//                     </Button>
//                   )}
//               </div>
//             </>
//           ) : null}
//         </div>
//       </PopoverContent>
//       {/* </TranslucentPopoverContent> */}
//     </Popover>
//   );

//   // return (
//   //   <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
//   //     <PopoverTrigger>
//   //       <Button isIconOnly variant="light" ref={buttonRef} className="overflow-visible">
//   //         <Badge
//   //           placement="top-right"
//   //           color="danger"
//   //           content={unreadCount ? (unreadCount > 99 ? '99+' : unreadCount) : undefined}
//   //           shape="rectangle"
//   //           className="text-xs font-medium"
//   //           classNames={{
//   //             base: 'mx-2',
//   //             badge: cn('text-white', unreadCount === 0 && 'hidden')
//   //           }}
//   //         >
//   //           <Bell size={20} />
//   //         </Badge>
//   //       </Button>
//   //     </PopoverTrigger>
//   //     <TranslucentPopoverContent>
//   //       <div className="relative flex h-full max-h-[532px] min-h-48 w-80 flex-1 flex-col overflow-hidden">
//   //         <div className="flex w-full justify-between border-b-1 border-ds-search-outline px-4 py-2">
//   //           <div className="flex items-center gap-2">
//   //             <p className="text-sm font-medium">Notifications</p>
//   //             <Kbd className="h-5 w-5 flex-shrink-0 text-xs font-medium">N</Kbd>
//   //           </div>
//   //           <Button
//   //             isIconOnly
//   //             size="sm"
//   //             variant="light"
//   //             className="text-ds-text-secondary"
//   //             onPress={handleOpenNotificationPreferences}
//   //           >
//   //             <SettingsSliderVer size={20} />
//   //           </Button>
//   //         </div>
//   //         <div className="my-auto flex h-full min-h-0 w-full flex-col overflow-y-auto">
//   //           {notifications && notifications?.length > 0 ? (
//   //             <Listbox
//   //               aria-label="notification list"
//   //               disallowEmptySelection
//   //               className="bg-transparent p-0"
//   //               classNames={{
//   //                 list: 'gap-0'
//   //               }}
//   //               selectionMode={unreadCount && unreadCount > 0 ? 'single' : 'none'}
//   //               hideEmptyContent
//   //               hideSelectedIcon
//   //               selectedKeys={selectedNotification ? new Set([selectedNotification]) : new Set([])}
//   //               onSelectionChange={(keys) => {
//   //                 const value = Array.from(keys)[0];
//   //                 setSelectedNotification(value as string);
//   //               }}
//   //             >
//   //               {notifications.map((notification) => (
//   //                 <ListboxItem
//   //                   aria-label="notification item"
//   //                   shouldFocusOnHover
//   //                   key={notification.id}
//   //                   className="rounded-none p-0 data-[hover=true]:bg-ds-search-search-item-bg-hover/60 data-[selected=true]:bg-ds-search-search-item-bg-selected/30 data-[focus-visible=true]:-outline-offset-2"
//   //                   onMouseEnter={() => setSelectedNotification(notification.id)}
//   //                   onFocus={() => setSelectedNotification(notification.id)}
//   //                   onPress={() => handleNotificationClick(notification)}
//   //                 >
//   //                   <NotificationItem
//   //                     key={notification.id}
//   //                     notification={notification}
//   //                     isSelected={selectedNotification === notification.id}
//   //                   />
//   //                 </ListboxItem>
//   //               ))}
//   //             </Listbox>
//   //           ) : (
//   //             <div className="flex h-full w-full flex-col items-center justify-center gap-6">
//   //               <p className="text-sm text-ds-text-secondary">No new notifications</p>
//   //             </div>
//   //           )}
//   //           {isFetchingNextPage && (
//   //             <div className="flex w-full items-center gap-3 px-4 py-3">
//   //               <Skeleton className="h-10 w-10 flex-shrink-0 rounded-xl" />
//   //               <div className="flex h-10 w-full flex-col gap-2">
//   //                 <Skeleton className="h-6 w-full rounded-lg" />
//   //                 <Skeleton className="h-2 w-1/3  rounded-lg " />
//   //               </div>
//   //             </div>
//   //           )}
//   //           <div ref={infiniteScrollRef} />
//   //         </div>
//   //         {unreadCount && unreadCount > 0 ? (
//   //           <>
//   //             <div className="pb-14 " />
//   //             <div className="absolute bottom-0 flex w-full items-center gap-2 bg-ds-button-secondary-bg p-2">
//   //               {unreadCount && unreadCount > 0 ? (
//   //                 <Button
//   //                   variant="light"
//   //                   size="sm"
//   //                   startContent={
//   //                     <Kbd className="flex h-5 w-4 items-center justify-center text-xs font-medium">
//   //                       X
//   //                     </Kbd>
//   //                   }
//   //                   onPress={() => {
//   //                     handleMarkAllAsRead();
//   //                   }}
//   //                 >
//   //                   Mark all as read
//   //                 </Button>
//   //               ) : null}
//   //               {selectedNotification &&
//   //                 selectedNotificationPopulated &&
//   //                 !selectedNotificationPopulated.is_read && (
//   //                   <Button
//   //                     variant="light"
//   //                     size="sm"
//   //                     startContent={
//   //                       <Kbd className="flex h-5 w-4 items-center justify-center text-xs font-medium">
//   //                         E
//   //                       </Kbd>
//   //                     }
//   //                     onPress={() => {
//   //                       markAsRead(selectedNotification);
//   //                     }}
//   //                   >
//   //                     Mark read
//   //                   </Button>
//   //                 )}
//   //             </div>
//   //           </>
//   //         ) : null}
//   //       </div>
//   //     </TranslucentPopoverContent>
//   //   </Popover>
//   // );
// };

// const NotificationBellWithRoomProvider = () => {
//   const { session } = useAuth();
//   const user = session?.user;

//   const { selectedShape, selectedColor } = useReviewStore();

//   if (!user) {
//     return null;
//   }

//   return (
//     <RoomProvider
//       id={`notifications:${user.id}`}
//       initialPresence={{
//         id: user?.id || "",
//         name:
//           user?.profile?.display_name ||
//           `${user?.profile?.first_name}&nbsp;${user?.profile?.last_name}` ||
//           "Anonymous",
//         email: user?.email as string,
//         avatar: user?.profile?.profile_picture || "",
//         color: user?.profile?.color || "red",
//         cursor: null,
//         currentShape: defaultShape(
//           selectedShape,
//           selectedColor
//         ) as LiveShapePreview,
//         isAddingReview: false,
//         currentTime: 0,
//         drawings: [],
//         leaderId: null,
//         isPlaying: false,
//       }}
//     >
//       <NotificationBell />
//     </RoomProvider>
//   );
// };

// export default NotificationBellWithRoomProvider;
