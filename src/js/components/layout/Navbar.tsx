import { useState } from "react";

import { LayoutLeft } from "@tessact/icons";

// import { useRouter } from 'next/navigation';

// import { useAuth } from '@/context/auth';
// import { usePermissions } from '@/context/permissions';
// import { usePreferences } from '@/context/preferences';
import { useClickOutside } from "@mantine/hooks";
import { Avatar, Badge, cn, user } from "@nextui-org/react";
import { isMobile } from "react-device-detect";

import useAuth from "../../hooks/useAuth";

import {
  ArrowBoxLeftThin,
  MacbookThin,
  MoonStarThin,
  SunThin,
} from "@tessact/icons";

import { Divider } from "../ui/Divider";

import { useSidebarStore } from "../../stores/sidebar-store";
// import { Link } from '@/components/ui/NextLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/RadixDropdown";
import { Tab, Tabs } from "../ui/Tabs";
import UserFallback from "../ui/UserFallback";

import { NotificationBellWithRoomProvider } from "../notification/NotificationBell";

// import { useUpdatePreferences } from "@/api-integration/mutations/preferences";
// import { ThemePreference } from "@/api-integration/types/preferences";

// import { logout } from "@/actions/auth/logout";

import { Kbd } from "../ui/Kbd";

import { Drawer } from "vaul";

export const Navbar = () => {
  // const { session } = useAuth();
  // const user = session?.user;
  // const name =
  // user?.profile?.display_name ?? `${user?.profile?.first_name} ${user?.profile?.last_name}`;

  // const { preferences } = usePreferences();
  // const profile = preferences?.profile;
  // const email = preferences?.user;

  // const userObject = {
  //   email: email ?? user?.email ?? "",
  //   first_name: profile?.first_name ?? user?.profile?.first_name ?? "",
  //   last_name: profile?.last_name ?? user?.profile?.last_name ?? "",
  //   display_name: profile?.display_name ?? user?.profile?.display_name ?? "",
  //   profile_picture: profile?.profile_picture ?? "",
  // };

  const [isOpen, setIsOpen] = useState(false);

  const { toggleSidebar } = useSidebarStore();

  const { setAuth, auth } = useAuth();

  const userObject = {
    email: auth.user.email,
    first_name: auth.user.first_name,
    last_name: auth.user.last_name,
    display_name: auth.user.display_name,
    profile_picture: auth.user.profile_picture,
  };

  // const router = useRouter();
  // const { setIsPreferencesModalOpen } = usePreferencesStore();
  // const [, startTransition] = useTransition();
  // const [isOpen, setIsOpen] = useState(false);

  // const handleOpen = (value: boolean) => {
  //   startTransition(() => {
  //     setIsOpen(value);
  //   });
  // };

  // const { getPreferredName } = usePrefferedName();
  //     const prefferedName = getPreferredName({
  //       first_name: userObject?.first_name,
  //       last_name: userObject?.last_name,
  //       display_name: userObject?.display_name,
  // });

  // If user is focused on theme item and clicks outside, we need to immediatel
  const ref = useClickOutside(() => {
    setIsOpen(false);
  });

  // const { organizationPermissions } = usePermissions();
  // const canSeeUserManagement = checkIfHasAnyOrgPermission(
  //   organizationPermissions ?? []
  // );

  return (
    <div className="flex bg-transparent items-center px-3 py-2 justify-between">
      <Drawer.Trigger>
        <LayoutLeft onClick={toggleSidebar} />
      </Drawer.Trigger>
      <div className="flex items-center">
        {!isMobile && <Divider orientation="vertical" className="mx-2 h-4" />}
        <div
          className={cn("inline-flex items-center gap-2", !isMobile && "pr-1")}
        >
          <NotificationBellWithRoomProvider />
          {/* Divider to be replaced when notifications are added */}
          <Badge placement="bottom-right" color="success">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="p-1">
                <Avatar
                  size="sm"
                  radius="md"
                  src={
                    userObject?.profile_picture
                      ? userObject?.profile_picture
                      : undefined
                  }
                  alt="Profile image"
                  className="cursor-pointer"
                  classNames={{
                    fallback: "w-full h-full",
                  }}
                  showFallback
                  fallback={
                    <UserFallback
                      key={"user-fallback".concat(userObject?.email ?? "")}
                      firstName={userObject?.first_name}
                      lastName={userObject?.last_name}
                      displayName={userObject?.display_name}
                      email={userObject?.email}
                      // color={user?.?.color ?? ""}
                    />
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-[9999] min-w-56"
                ref={ref}
              >
                {(userObject?.first_name || userObject?.email) && (
                  <DropdownMenuLabel className="p-2">
                    <div className="flex w-full flex-col">
                      {userObject?.first_name && (
                        <p className="text-base font-medium text-ds-menu-text-primary">
                          {userObject?.first_name}
                        </p>
                      )}
                      {userObject.email && (
                        <p className="w-full max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal text-ds-menu-text-secondary">
                          {userObject.email}{" "}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                )}
                {/* TODO: Add the following items in future, when API is ready. */}
                {/* <DropdownMenuItem>
              Set yourself as&nbsp;<span className="font-bold">active</span>
            </DropdownMenuItem> */}
                {/* <PauseNotificationsSubMenu /> */}
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={(event) => event.preventDefault()}
                  disabled
                  className="pointer-events-none hover:bg-transparent data-[disabled]:opacity-100"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <TabThemeSwitcher selectedThemePreference={"light"} />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  startContent={
                    <ArrowBoxLeftThin size={16} className="text-default-500" />
                  }
                  onSelect={async (event) => {
                    event.preventDefault();
                    location.reload();

                    setAuth({
                      accessToken: null,
                      refreshToken: null,
                      user: null,
                    });
                  }}
                >
                  <div className="flex w-full justify-between">Logout</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Badge>
        </div>
      </div>
    </div>
  );
};

const TabThemeSwitcher = ({
  selectedThemePreference,
}: {
  selectedThemePreference: string;
}) => {
  // const { setTheme } = useTheme();
  // const { mutate: updatePreferences } = useUpdatePreferences();
  return (
    <Tabs
      className="pointer-events-auto"
      size="sm"
      variant="solid"
      selectedKey={selectedThemePreference}
      onSelectionChange={(key) => {
        // setTheme(key as ThemePreference);
        // updatePreferences({
        //   preference: {
        //     theme: key as ThemePreference,
        //   },
        // });
      }}
    >
      <Tab key="light" title={<SunThin width={16} height={16} />} />
      <Tab key="dark" title={<MoonStarThin width={16} height={16} />} />
      <Tab key="system" title={<MacbookThin width={16} height={16} />} />
    </Tabs>
  );
};

// TODO: Add this submenu in future when API is ready.

// const PauseNotificationsSubMenu = () => {
//   const tomorrow = dayjs().add(1, 'day');
//   const formattedTomorrow = tomorrow.format('Till Do MMMM');

//   return (
//     <DropdownMenuSub>
//       <DropdownMenuSubTrigger>
//         <div className="flex w-full items-center justify-between">
//           <p>Pause Notifications</p>
//           <ChevronRightSmallFilledThin width={20} height={20} />
//         </div>
//       </DropdownMenuSubTrigger>
//       <DropdownMenuPortal>
//         <DropdownMenuSubContent>
//           <DropdownMenuLabel>Pause notifications</DropdownMenuLabel>
//           <DropdownMenuGroup>
//             <DropdownMenuItem>For 30 minutes</DropdownMenuItem>
//             <DropdownMenuItem>For 1 hour</DropdownMenuItem>
//             <DropdownMenuItem>
//               <div className="flex w-full flex-col">
//                 <p>Until EOD</p>
//                 <p className="text-xs text-ds-menu-text-secondary">
//                   Till 5pm IST (India Standard Time)
//                 </p>
//               </div>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <div className="flex w-full flex-col">
//                 <p>Until tomorrow</p>
//                 <p className="text-xs text-ds-menu-text-secondary">{formattedTomorrow}, 9am IST</p>
//               </div>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <div className="flex w-full flex-col">
//                 <p>Until next week</p>
//                 <p className="text-xs text-ds-menu-text-secondary">Next Monday, 9am IST</p>
//               </div>
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         </DropdownMenuSubContent>
//       </DropdownMenuPortal>
//     </DropdownMenuSub>
//   );
// };
