import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSidebarStore } from "../../stores/sidebar-store";
import { Button } from "../ui/Button";
import { WorkspaceSwitcher } from "../user-management/WorkspaceSwitcher";
import { useEffect } from "react";
import { Suspense } from "react";
import { useParamsStateStore } from "@/stores/params-state-store";
import { HomeSidebar } from "../sidebar/HomeSidebar";
import { ChevronLeftSmall, ChevronRightSmall } from "@tessact/icons";

import {
  Drawer,
  DrawerContent,
  DrawerItem,
  // DrawerNested,
  DrawerNestedItem,
  DrawerTrigger,
} from "../../components/ui/Drawer";

export const transition = {
  // type: 'spring',
  // mass: 1,
  // stiffness: 235,
  // damping: 34.2
  ease: "easeInOut",
  duration: 0.3,
};

import { LibrarySidebar } from "../sidebar/LibrarySidebar";

export type SidebarView =
  | "root"
  | "library"
  | "settings"
  | "workflows"
  | "views"
  | "projects"
  | "project-overview"
  | "project-task-file"
  | "project-file-preview"
  | "teams"
  | "tagging"
  | "marathon-cameras"
  | "preset-dashboard"
  | "preset"
  | "editor"
  | "editor-v2";

export const Sidebar = () => {
  const { toggle, isOpen } = useSidebarStore();

  const [sidebarView, setSidebarView] = useState<SidebarView>("root");
  const [lastViewed, setLastViewed] = useState<SidebarView[]>([]);

  const isOnRootView =
    sidebarView === "root" || sidebarView === "preset-dashboard";

  const lastViewedView = lastViewed[lastViewed?.length - 1];

  const { currentPage } = useParamsStateStore();

  useEffect(() => {
    setLastViewed([]);

    // if (pathname.startsWith("/library/editor/")) {
    //   setSidebarView("editor-v2");
    //   return;
    // }

    if (currentPage === "library") {
      setSidebarView("root");
    }
    // if (pathname === "/settings") {
    //   setSidebarView("root");
    // }
    // if (pathname.startsWith('/settings/')) {
    //   setSidebarView('settings');
    // }
    // if (pathname.startsWith('/settings/workflows/')) {
    //   setSidebarView('workflows');
    // }

    if (currentPage === "library") {
      // setSidebarView("library");
    }
    // if (pathname === '/views') {
    //   setSidebarView('root');
    // }
    // if (pathname.startsWith('/views/')) {
    //   setSidebarView('views');
    // }
    if (currentPage === "projects") {
      setSidebarView("root");
    }
    // if (pathname.startsWith('/settings/teams/')) {
    //   setSidebarView('teams');
    // }
    if (currentPage === "projects") {
      setSidebarView("projects");
    }
    // if (
    //   pathname === `/projects/${projectId}/tasks/${taskId}` ||
    //   pathname === `/projects/${projectId}/tasks/${taskId}/` ||
    //   pathname === `/projects/${projectId}/files` ||
    //   pathname === `/projects/${projectId}/files/` ||
    //   pathname === `/projects/${projectId}/members` ||
    //   pathname === `/projects/${projectId}/settings` ||
    //   pathname === `/projects/${projectId}/settings/`
    // ) {
    //   setSidebarView("project-overview");
    // }
    // if (
    //   pathname === `/projects/${projectId}/files/asset/${assetId}` ||
    //   pathname === `/projects/${projectId}/files/folder/${folderId}` ||
    //   pathname === `/projects/${projectId}/files/asset/${assetId}/` ||
    //   pathname === `/projects/${projectId}/files/folder/${folderId}/` ||
    //   pathname === `/projects/${projectId}/files/video/${assetId}` ||
    //   pathname === `/projects/${projectId}/files/video/${assetId}/`
    // ) {
    //   setSidebarView("project-file-preview");
    // }
    // if (
    //   pathname === `/projects/${projectId}/tasks/${taskId}/files/${assetId}` ||
    //   pathname ===
    //     `/projects/${projectId}/tasks/${taskId}/files/folder/${folderId}` ||
    //   pathname === `/projects/${projectId}/tasks/${taskId}/files/${assetId}/` ||
    //   pathname ===
    //     `/projects/${projectId}/tasks/${taskId}/files/folder/${folderId}/` ||
    //   pathname ===
    //     `/projects/${projectId}/tasks/${taskId}/files/video/${assetId}` ||
    //   pathname ===
    //     `/projects/${projectId}/tasks/${taskId}/files/video/${assetId}/`
    // ) {
    //   setSidebarView("project-task-file");
    // }
    // if (pathname === `/preset` || pathname === `/preset/`) {
    //   setSidebarView("preset-dashboard");
    // }
    // if (
    //   pathname === `/preset/${presetId}` ||
    //   pathname === `/preset/${presetId}/`
    // ) {
    //   setSidebarView("preset");
    // }
  }, [currentPage]);

  const buttonActionCategoryMappings: Record<
    SidebarView,
    {
      Component: React.ReactNode;
      back: () => void;
      forward: () => void;
      level: number;
    }
  > = {
    root: {
      Component: <HomeSidebar isUserTagger={false} isInternalUser={false} />,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    library: {
      Component: <LibrarySidebar />,
      back: () => {},
      forward: () => {},
      level: 0,
    },
  };

  return (
    <AnimatePresence initial={false}>
      <Drawer direction="left" open={isOpen} onOpenChange={toggle}>
        <DrawerContent className="!inset-y-0 !left-0 !mt-0 !h-full  w-[280px] rounded-none ">
          <div className="flex !h-full min-h-full flex-col justify-between">
            <div id="custom-drag-sidebar" className="h-4 max-w-20" />
            <section className="flex min-h-0 h-full w-full flex-1 flex-col gap-5 overflow-hidden">
              <WorkspaceSwitcher />
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                <AnimatePresence initial={false}>
                  {(lastViewedView || !isOnRootView) &&
                    buttonActionCategoryMappings[sidebarView] && (
                      <motion.div layout className="mb-5 space-x-2">
                        <Button
                          color="secondary"
                          className="px-8"
                          isIconOnly
                          onPress={
                            buttonActionCategoryMappings[sidebarView]?.back
                          }
                          isDisabled={isOnRootView}
                          aria-label="Back on sidebar"
                        >
                          <span className="inline-block">
                            <ChevronLeftSmall size={20} />
                          </span>
                        </Button>
                        <Button
                          color="secondary"
                          className="px-8"
                          isIconOnly
                          onPress={
                            buttonActionCategoryMappings[sidebarView]?.forward
                          }
                          isDisabled={!lastViewedView}
                          aria-label="Forward on sidebar"
                        >
                          <span className="inline-block">
                            <ChevronRightSmall size={20} />
                          </span>
                        </Button>
                      </motion.div>
                    )}
                  <Suspense fallback={<></>}>
                    {buttonActionCategoryMappings[sidebarView].Component}
                  </Suspense>
                </AnimatePresence>
              </div>
              {/* <div className="relative flex h-full min-h-0 left-0 top-0 flex-col overflow-hidden">
                <LibrarySidebar />
              </div> */}
            </section>
          </div>
        </DrawerContent>
      </Drawer>
    </AnimatePresence>
  );
};
