import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@nextui-org/react";

import { useClickOutside } from "@mantine/hooks";
import { useSidebarStore } from "../../stores/sidebar-store";
import { Button } from "../ui/Button";
import { DotGrid1X3Horizontal } from "@tessact/icons";
import { WorkspaceSwitcher } from "../user-management/WorkspaceSwitcher";

import {
  Drawer,
  DrawerContent,
  DrawerItem,
  // DrawerNested,
  DrawerNestedItem,
  DrawerTrigger,
} from "../../components/ui/Drawer";

import { LibrarySidebar } from "../sidebar/LibrarySidebar";

export const Sidebar = () => {
  const { toggle, isOpen } = useSidebarStore();

  return (
    <AnimatePresence initial={false}>
      <Drawer direction="left" open={isOpen} onOpenChange={toggle}>
        <DrawerContent className="!inset-y-0 !left-0 !mt-0 !h-full  w-[280px] rounded-none ">
          <div className="flex !h-full min-h-full flex-col justify-between">
            <div id="custom-drag-sidebar" className="h-4 max-w-20" />
            <section className="flex min-h-0 h-full w-full flex-1 flex-col gap-5 overflow-hidden">
              {/* <div> */}
              <WorkspaceSwitcher />
              {/* </div> */}
              <div className="relative flex h-full min-h-0 left-0 top-0 flex-col overflow-hidden">
                <LibrarySidebar />
              </div>
            </section>
          </div>
        </DrawerContent>
      </Drawer>
    </AnimatePresence>
  );
};
