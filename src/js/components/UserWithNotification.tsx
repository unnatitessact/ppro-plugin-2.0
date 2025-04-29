import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/RadixDropdown";
import { Avatar } from "./ui/Avatar";
import { useState, useTransition } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { Divider } from "./ui/Divider";
import { Badge } from "./ui/Badge";
import { cn } from "@nextui-org/react";
import UserFallback from "./ui/UserFallback";
import {
  ArrowBoxLeftThin,
  ArrowLeftThin,
  MoonStarThin,
  SunThin,
} from "@tessact/icons";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Tabs, Tab } from "./ui/Tabs";

import { useClickOutside } from "@mantine/hooks";
import { ThemePreference } from "@/api-integration/types/preferences";
import NotificationBellWithRoomProvider from "./notifications/NotificationBell";

export const UserWithNotification = () => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const { auth, setAuth } = useAuth();

  const userObject = auth?.user;

  const handleOpen = (value: boolean) => {
    startTransition(() => {
      setIsOpen(value);
    });
  };

  const ref = useClickOutside(() => {
    handleOpen(false);
  });

  return (
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
                  <TabThemeSwitcher />
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
  );
};

const TabThemeSwitcher = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <Tabs
      className="pointer-events-auto"
      size="sm"
      variant="solid"
      selectedKey={theme}
      onSelectionChange={(key) => {
        // setTheme(key);
        // @ts-ignore: 2 themes onli
        toggleTheme(key as "dark" | "light");
        //   updatePreferences({
        //     preference: {
        //       theme: key as ThemePreference
        //     }
        //   });
      }}
    >
      <Tab key="light" title={<SunThin width={16} height={16} />} />
      <Tab key="dark" title={<MoonStarThin width={16} height={16} />} />
      {/* <Tab key="system" title={<MacbookThin width={16} height={16} />} /> */}
    </Tabs>
  );
};
