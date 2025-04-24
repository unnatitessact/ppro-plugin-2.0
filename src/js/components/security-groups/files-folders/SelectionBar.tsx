"use client";

import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import pluralize from "pluralize";

import { CrossSmall } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";

import PermissionDropdown from "./PermissionDropdown";

import { useSecurityGroupStore } from "../../../stores/security-store";

export const SelectionBar = ({
  hasEditPermission,
}: {
  hasEditPermission: boolean;
}) => {
  const { seletedTreeNode, clearSelectedTreeNode } = useSecurityGroupStore();

  const selectedItems = seletedTreeNode?.map((node) => ({
    id: node.id,
    children_count: node.children_count,
    resourcetype: node.resourcetype,
    permissions: node.permissions,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: -20 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "rounded-2xl px-4 py-2",
        "flex items-center justify-between gap-5",
        "bg-ds-button-default-bg text-ds-button-default-text",
        "absolute bottom-0 z-50 w-full",
        "transition-colors"
      )}
    >
      <p>
        {seletedTreeNode.length} {pluralize("item", seletedTreeNode.length)}{" "}
      </p>
      <div className="flex items-center gap-2">
        <>
          <PermissionDropdown
            selectedItems={selectedItems}
            isMultiAsset={true}
            hasEditPermission={hasEditPermission}
          />
          <Button
            color="default"
            isIconOnly
            onPress={clearSelectedTreeNode}
            key="cancel"
            aria-label="Clear selection"
          >
            <CrossSmall size={20} />
          </Button>
        </>
      </div>
    </motion.div>
  );
};
