"use client";

import type { ReactNode } from "react";

import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { platform } from "@todesktop/client-core";

import { LayoutLeft } from "@tessact/icons";

import { Button } from "@/components/ui/Button";

// import { UserWithNotifications } from "@/components/UserWithNotifications";

import { useSidebarStore } from "@/stores/sidebar-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

export const RootActionbar = ({ children }: { children: ReactNode }) => {
  const { toggle, isOpen } = useSidebarStore();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <header
      id="actionbar-header"
      className={cn(
        "relative flex items-center  p-2 pr-6",
        platform.todesktop.isDesktopApp() && !isOpen ? "ml-20" : "",
        isMobile && "flex-col items-start sticky  top-0 gap-2 pl-4 pr-4"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2",
          isMobile && "h-10 justify-between "
        )}
      >
        <Button
          isIconOnly
          color="secondary"
          onPress={toggle}
          aria-label="Toggle sidebar"
        >
          <LayoutLeft size={20} />
        </Button>
        {!isMobile && <div className="flex-1 overflow-hidden">{children}</div>}
        {/* <UserWithNotifications /> */}
      </div>
      {isMobile && (
        <div className="pointer-events-none h-10 w-full">
          {/* This above div needs pointer-events-none because it overlaps sidebar switch and user dropdown */}
          <div className="absolute top-0 w-full overflow-hidden pr-8">
            {children}
          </div>
        </div>
      )}
    </header>
  );
};
