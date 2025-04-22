import { useEffect, useState } from "react";

// import { useRouter } from 'next/navigation';

import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import { cn, useDisclosure } from "@nextui-org/react";
import { platform } from "@todesktop/client-core";

import { ChevronGrabberVertical } from "@tessact/icons";

import { Button } from "../ui/Button";
import { Kbd } from "../ui/Kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/RadixDropdown";

import WorkspaceIcon from "./WorkspaceIcon";

import { useOrganization } from "../../hooks/useOrganization";
import { useWorkspace } from "../../hooks/useWorkspace";

import { useSidebarStore } from "../../stores/sidebar-store";

// import { MOBILE_MEDIA_QUERY } from "../../utils/responsiveUtils";

export const WorkspaceSwitcher = () => {
  //   const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { workspace, isLoading, workspaces, setWorkspaceId } = useWorkspace();

  const [isOpenedFromHotkey, setIsOpenedFromHotkey] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //   const { toggle } = useSidebarStore();

  //   const router = useRouter();

  const organization = useOrganization();

  const handleAction = async (key: string) => {
    setWorkspaceId(workspaces.find((w) => w.id === key)!.id);
    await new Promise((resolve) => setTimeout(resolve, 100));
    // router.replace("/library");
    // if (isMobile) {
    //   toggle();
    // }
  };

  useHotkeys([
    [
      "alt+w",
      () => {
        onOpen();
        setIsOpenedFromHotkey(true);
      },
    ],
  ]);

  useHotkeys(
    workspaces
      ?.slice(0, 10)
      ?.map((workspace, index) => [
        `${index}`,
        () => isOpenedFromHotkey && handleAction(workspace?.id),
      ])
  );

  useEffect(() => {
    if (!isOpen) {
      setIsOpenedFromHotkey(false);
    }
  }, [isOpen]);

  return (
    <div
      id="workspace-switcher-container"
      className={cn(
        "grid w-full grid-cols-[1fr] relative z-100 w-full items-center border-2 border-red-400",
        platform.todesktop.isDesktopApp() && "grid-cols-[72px,1fr]"
      )}
    >
      <div
        id="workspace-switcher-spacer"
        className={cn(
          "-ml-[24px] h-full w-[96px]",
          platform.todesktop.isDesktopApp() ? "block h-10" : "hidden",
          platform.todesktop.isDesktopApp() && "[--webkit-app-region:drag]"
        )}
      ></div>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            onPress={onOpen}
            id="workspace-switcher"
            className="flex cursor-pointer items-center justify-between rounded-xl border border-ds-menu-border bg-ds-workspace-switcher-bg px-3 py-2 text-ds-workspace-switcher-text transition-colors hover:bg-ds-workspace-switcher-bg-hover active:bg-ds-workspace-switcher-bg-active"
            aria-label="Workspace switcher"
          >
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
              <div className="relative flex-shrink-0">
                <WorkspaceIcon
                  image={workspace.display_image}
                  title={workspace.title}
                  color={workspace.color}
                  rounded="lg"
                  size="md"
                />
                <div className="absolute left-0 top-0 h-full w-full rounded-lg border border-white/15"></div>
              </div>
              <h3 className="truncate text-sm font-medium">
                {isLoading ? " " : workspace.title}
              </h3>
            </div>
            <ChevronGrabberVertical
              size={20}
              className="flex-shrink-0 text-ds-text-secondary"
            />
          </Button>
        </DropdownMenuTrigger>
        {/* <ScrollShadow> */}
        <DropdownMenuContent
          side="bottom"
          align="center"
          className="max-h-80 overflow-y-auto"

          // classNames={{
          //   list: 'max-h-80 overflow-y-auto'
          // }}
          // onAction={(key) => handleAction(key as string)}
        >
          {organization?.title ? (
            <DropdownMenuLabel>{organization?.title}</DropdownMenuLabel>
          ) : null}
          {workspaces.map((workspace, index) => (
            <DropdownMenuItem
              key={workspace.id}
              onSelect={() => handleAction(workspace?.id)}
              startContent={
                <WorkspaceIcon
                  title={workspace?.title}
                  color={workspace?.color}
                  image={workspace?.display_image}
                  rounded={"md"}
                  size="sm"
                />
              }
              endContent={
                isOpenedFromHotkey && index < 10 ? (
                  <Kbd className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-xs font-medium">
                    {index}
                  </Kbd>
                ) : undefined
              }
            >
              {workspace.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
        {/* </ScrollShadow> */}
      </DropdownMenu>
    </div>
  );
};
