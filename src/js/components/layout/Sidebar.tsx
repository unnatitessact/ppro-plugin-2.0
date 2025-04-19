import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@nextui-org/react";
import { Button } from "../ui/Button";

import { ChevronLeftSmall, ChevronRightSmall } from "@tessact/icons";

import { useClickOutside } from "@mantine/hooks";
import { useSidebarStore } from "../../store/sidebar-store";

import { Drawer } from "vaul";

export const Sidebar = () => {
  const { toggleSidebar } = useSidebarStore();
  const ref = useClickOutside(() => {
    toggleSidebar();
  });
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />

      <Drawer.Content
        ref={ref}
        style={
          { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
        }
        className="left-0 top-2 bottom-2 fixed z-10 outline-none w-[440px] flex"
      >
        <aside className="flex h-full min-w-40 bg-red-400 flex-col justify-between">
          <Drawer.Title>sheep</Drawer.Title>
          <div id="custom-drag-sidebar" className="h-4 w-full" />
          <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
            {/* {!isTagger && <WorkspaceSwitcher />} */}
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
              <AnimatePresence initial={false}>
                {/* {(lastViewedView || !isOnRootView) && buttonActionCategoryMappings[sidebarView] && ( */}
                <motion.div layout className="mb-5 space-x-2">
                  <Button
                    color="secondary"
                    className="px-8"
                    isIconOnly
                    // onPress={buttonActionCategoryMappings[sidebarView]?.back}
                    // isDisabled={isOnRootView}
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
                    // onPress={buttonActionCategoryMappings[sidebarView]?.forward}
                    // isDisabled={!lastViewedView}
                    aria-label="Forward on sidebar"
                  >
                    <span className="inline-block">
                      <ChevronRightSmall size={20} />
                    </span>
                  </Button>
                </motion.div>
                {/* )} */}
                {/* <Suspense fallback={<></>}> */}
                Component
                {/* {buttonActionCategoryMappings[sidebarView].Component} */}
                {/* </Suspense> */}
                {/* <ScrollShadow className="h-full overflow-x-hidden pr-2">
            <div className="flex h-full flex-col">
              {Array.from({ length: 200 }).map((_, index) => (
                <div key={index}>{index}</div>
              ))}
              <div className="pb-8" />
            </div>
          </ScrollShadow> */}
              </AnimatePresence>
            </div>
          </section>
          {/* {isNewVersionAvailable && (
      <div className="flex w-full">
        <AnimatePresence>
          <RefreshNudge reload={() => window.location.reload()} />
        </AnimatePresence>
      </div>
    )} */}
          <section className="relative flex flex-col gap-4">
            <AnimatePresence>
              {/* {isOnRootView && !isUserTagger && ( */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn("origin-bottom pb-5")}
              >
                {/* <NavLink label="Settings" secondary href="/settings" /> */}
                Settings
                {/* <NavLink label="Help Center" secondary /> */}
              </motion.div>
              {/* )} */}
            </AnimatePresence>
          </section>
        </aside>
      </Drawer.Content>
    </Drawer.Portal>
  );
};
