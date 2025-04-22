import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@nextui-org/react";

import { useClickOutside } from "@mantine/hooks";
import { useSidebarStore } from "../../stores/sidebar-store";
import { Button } from "../ui/Button";
import { DotGrid1X3Horizontal } from "@tessact/icons";
import { WorkspaceSwitcher } from "../workspace-switcher/WorkspaceSwitcher";

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
  const { toggleSidebar, isOpen } = useSidebarStore();

  return (
    <aside className="flex h-full flex-col justify-between">
      <div id="custom-drag-sidebar" className="h-4 max-w-20" />
      <section className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-hidden">
        <div className="p-4">
          <WorkspaceSwitcher />
        </div>
        <div className="relative flex h-full min-h-0 left-0 top-0 max-w-20 flex-col overflow-hidden">
          <AnimatePresence initial={false}>
            <Drawer direction="left" open={isOpen} onOpenChange={toggleSidebar}>
              <DrawerContent className="!inset-y-0 !left-0 !mt-0 h-full w-[280px] rounded-none ">
                <LibrarySidebar />
              </DrawerContent>
            </Drawer>
          </AnimatePresence>
        </div>
      </section>
    </aside>
  );
};
