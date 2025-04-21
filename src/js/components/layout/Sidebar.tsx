import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@nextui-org/react";

import { useClickOutside } from "@mantine/hooks";
import { useSidebarStore } from "../../stores/sidebar-store";
import { Drawer } from "vaul";
import { LibrarySidebar } from "../sidebar/LibrarySidebar";

export const Sidebar = () => {
  const { toggleSidebar } = useSidebarStore();
  const ref = useClickOutside(() => {
    alert("click otuside");
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
              <LibrarySidebar />
            </AnimatePresence>
          </section>
        </aside>
      </Drawer.Content>
    </Drawer.Portal>
  );
};
