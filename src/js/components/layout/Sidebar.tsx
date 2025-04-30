import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSidebarStore } from "../../stores/sidebar-store";
import { Button } from "../ui/Button";
import { WorkspaceSwitcher } from "../user-management/WorkspaceSwitcher";
import { useEffect } from "react";
import { Suspense } from "react";
import { HomeSidebar } from "../sidebar/HomeSidebar";
import { ChevronLeftSmall, ChevronRightSmall } from "@tessact/icons";

import { useLocation } from "react-router-dom";

import { Drawer, DrawerContent } from "../../components/ui/Drawer";

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

  const { pathname } = useLocation();

  const [sidebarView, setSidebarView] = useState<SidebarView>("root");
  const [lastViewed, setLastViewed] = useState<SidebarView[]>([]);

  const isOnRootView =
    sidebarView === "root" || sidebarView === "preset-dashboard";

  const lastViewedView = lastViewed[lastViewed?.length - 1];

  useEffect(() => {
    setLastViewed([]);

    if (pathname === "/") {
      setSidebarView("root");
    }

    if (pathname.startsWith("/folder")) {
      setSidebarView("library");
    }

    if (pathname.startsWith("/asset")) {
      setSidebarView("library");
    }
  }, [pathname]);

  const handleBackButton = (view: SidebarView, parentView: SidebarView) => {
    // When user clicks back, we need to set the parent view as the current view
    // and push the current view to the last viewed array
    // so that we can use it when user clicks forward

    setSidebarView(parentView);
    setLastViewed((prev) => [...prev, view]);
  };

  const handleForwardButton = () => {
    // When user clicks forward, we need to set the last view as the current view
    // and remove the last view from the last viewed array

    if (lastViewedView) {
      setLastViewed((prev) => prev.slice(0, prev.length - 1));
      setSidebarView(lastViewedView);
    }
  };

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
      forward: handleForwardButton,
      level: 0,
    },
    library: {
      Component: <LibrarySidebar />,
      back: () => handleBackButton("library", "root"),
      forward: handleForwardButton,
      level: 0,
    },
    settings: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    workflows: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    views: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    projects: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    "project-overview": {
      Component: null,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    "project-task-file": {
      Component: null,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    "project-file-preview": {
      Component: null,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    teams: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    tagging: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    "marathon-cameras": {
      Component: null,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    "preset-dashboard": {
      Component: null,
      back: () => {},
      forward: () => {},
      level: 0,
    },
    preset: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    editor: { Component: null, back: () => {}, forward: () => {}, level: 0 },
    "editor-v2": {
      Component: null,
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
