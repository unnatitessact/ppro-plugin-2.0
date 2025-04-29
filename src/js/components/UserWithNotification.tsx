// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "./ui/Dropdown";
// import { useMediaQuery } from "@mantine/hooks";
// import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
// import { Divider } from "./ui/Divider";
// import { Badge } from "./ui/Badge";

// export const UserWithNotification = () => {
//   const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

//   return (
//     <div className="flex items-center">
//       {!isMobile && <Divider orientation="vertical" className="mx-2 h-4" />}
//       <div
//         className={cn("inline-flex items-center gap-2", !isMobile && "pr-1")}
//       >
//         <NotificationBellWithRoomProvider />
//         {/* Divider to be replaced when notifications are added */}
//         <Badge placement="bottom-right" color="success">
//           <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//             <DropdownMenuTrigger className="p-1">
//               <Avatar
//                 size="sm"
//                 radius="md"
//                 src={
//                   userObject?.profile_picture
//                     ? userObject?.profile_picture
//                     : undefined
//                 }
//                 alt="Profile image"
//                 className="cursor-pointer"
//                 classNames={{
//                   fallback: "w-full h-full",
//                 }}
//                 showFallback
//                 fallback={
//                   <UserFallback
//                     key={"user-fallback".concat(userObject?.email ?? "")}
//                     firstName={userObject?.first_name}
//                     lastName={userObject?.last_name}
//                     displayName={userObject?.display_name}
//                     email={userObject?.email}
//                     // color={user?.?.color ?? ""}
//                   />
//                 }
//               />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="end"
//               className="z-[9999] min-w-56"
//               ref={ref}
//             >
//               {(userObject?.first_name || userObject?.email) && (
//                 <DropdownMenuLabel className="p-2">
//                   <div className="flex w-full flex-col">
//                     {userObject?.first_name && (
//                       <p className="text-base font-medium text-ds-menu-text-primary">
//                         {userObject?.first_name}
//                       </p>
//                     )}
//                     {userObject.email && (
//                       <p className="w-full max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal text-ds-menu-text-secondary">
//                         {userObject.email}{" "}
//                       </p>
//                     )}
//                   </div>
//                 </DropdownMenuLabel>
//               )}
//               {/* TODO: Add the following items in future, when API is ready. */}
//               {/* <DropdownMenuItem>
//         Set yourself as&nbsp;<span className="font-bold">active</span>
//       </DropdownMenuItem> */}
//               {/* <PauseNotificationsSubMenu /> */}
//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 onSelect={(event) => event.preventDefault()}
//                 disabled
//                 className="pointer-events-none hover:bg-transparent data-[disabled]:opacity-100"
//               >
//                 <div className="flex w-full items-center justify-between">
//                   <span className="text-sm font-medium">Theme</span>
//                   <TabThemeSwitcher selectedThemePreference={"light"} />
//                 </div>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 startContent={
//                   <ArrowBoxLeftThin size={16} className="text-default-500" />
//                 }
//                 onSelect={async (event) => {
//                   event.preventDefault();
//                   location.reload();

//                   setAuth({
//                     accessToken: null,
//                     refreshToken: null,
//                     user: null,
//                   });
//                 }}
//               >
//                 <div className="flex w-full justify-between">Logout</div>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </Badge>
//       </div>
//     </div>
//   );
// };
