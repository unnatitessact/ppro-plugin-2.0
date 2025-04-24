"use client";

import React, { useEffect, useState } from "react";

// import { useParams } from "next/navigation";

import { cn, Skeleton } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";

import {
  Audio,
  ChevronRight,
  Files,
  Folder1,
  ImageAltText,
  VideoClip,
} from "@tessact/icons";

import { Checkbox } from "../../../components/ui/Checkbox";
import { ScrollShadow } from "../../../components/ui/ScrollShadow";

import PermissionDropdown, { PermissionPayload } from "./PermissionDropdown";

import { useLibraryTreeListQuery } from "../../../api-integration/queries/security-groups";
import { ResourceType } from "../../../api-integration/types/library";

import { useSecurityGroupStore } from "../../../stores/security-store";

import { ModifiedTreeView } from "../../../types/security-group";

import { useParamsStateStore } from "../../../stores/params-state-store";

const RecursiveTreeNode = ({
  name,
  id,
  searchQuery,
  css,
  resourcetype,
  permissions,
  isRoot,
  children_count,
  hasEditPermission,
}: {
  name: string;
  id?: string;
  searchQuery?: string;
  css?: string;
  resourcetype?: ResourceType;
  permissions?: PermissionPayload[];
  isRoot?: boolean;
  children_count?: number | 0;
  hasEditPermission: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(id ? false : true);
  const [isSelected, setIsSelected] = useState(false);
  const { ref, inView } = useInView();
  // const { groupId } = useParams();
  const { selectedWorkspace, seletedTreeNode, setSelectedTreeNode } =
    useSecurityGroupStore();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { groupId } = useParamsStateStore();
  const { data, fetchNextPage, isSuccess, isLoading, isFetching } =
    useLibraryTreeListQuery(
      groupId as string,
      selectedWorkspace as string,
      id ?? "",
      !!isRoot || resourcetype === "Folder",
      searchQuery
    );

  const results = data?.pages.flatMap((tree) => tree?.results) || [];

  const updateCheckBoxState = (
    id: string,
    resourcetype: ResourceType,
    children_count: number
  ) => {
    setIsSelected(!isSelected);
    if (seletedTreeNode.some((node) => node.id === id)) {
      const updatedSelectedTreeNode = seletedTreeNode.filter(
        (node) => node.id !== id
      );
      setSelectedTreeNode(updatedSelectedTreeNode);
    } else {
      const selectedNode: ModifiedTreeView = {
        id,
        resourcetype: resourcetype,
        children_count,
        permissions: permissions ?? [],
      };
      setSelectedTreeNode([...seletedTreeNode, selectedNode]);
    }
  };

  useEffect(() => {
    if (inView && isSuccess) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isSuccess]);

  useEffect(() => {
    if (!isRoot) {
      setIsOpen(false);
    }
  }, [selectedWorkspace, isRoot]);

  const getResourceTypeIcon = (resourcetype: ResourceType) => {
    switch (resourcetype) {
      case "Folder":
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <Folder1
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
      case "File":
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <Files
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
      case "ImageFile":
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <ImageAltText
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
      case "AudioFile":
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <Audio
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
      case "VideoFile":
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <VideoClip
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
      default:
        return (
          <div className="rounded-xl bg-default-200 p-3.5 dark:bg-default-200">
            <Files
              size={20}
              className="text-ds-button-secondary-text-disabled"
            />
          </div>
        );
    }
  };

  return (
    <div
      ref={parentRef}
      className={cn(
        "flex w-full flex-col",
        isRoot ? "border-b-1 border-default-100 last:border-b-0" : ""
      )}
    >
      <div className={cn("flex items-center justify-between p-4", css)}>
        <div
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            if (children_count ?? 0 > 0) {
              setIsOpen(!isOpen);
            }
          }}
        >
          {children_count ?? 0 > 0 ? (
            <ChevronRight
              size={14}
              className={cn(
                "cursor-pointer text-default-500 transition-all transform",
                {
                  "rotate-90": isOpen,
                }
              )}
            />
          ) : (
            <span className="w-[14px]" />
          )}
          {id && resourcetype ? (
            <Checkbox
              isSelected={seletedTreeNode.some((node) => node.id === id)}
              onValueChange={() =>
                updateCheckBoxState(id, resourcetype, children_count ?? 0)
              }
              variant="default"
            />
          ) : (
            <span className="w-5" />
          )}
          {resourcetype ? getResourceTypeIcon(resourcetype || "") : null}
          <span className="cursor-pointer text-sm font-medium text-default-900">
            {name}
          </span>
        </div>
        {id && (
          <PermissionDropdown
            key={id}
            selectedItems={[
              {
                id: id as string,
                children_count: children_count as number,
                resourcetype: resourcetype as ResourceType,
                permissions: permissions ?? [],
              },
            ]}
            isLoading={isLoading}
            permissions={permissions ?? []}
            isMultiAsset={false}
            selectedItem={{
              id: id as string,
              children_count: children_count as number,
              resourcetype: resourcetype as ResourceType,
            }}
            hasEditPermission={hasEditPermission}
            parentId={id}
          />
        )}
      </div>
      {isOpen && (
        <div className={cn("flex overflow-hidden", id ? "pl-12" : "")}>
          <ScrollShadow className="w-full">
            {!isLoading &&
              results?.map((item, i) => {
                const resource =
                  item?.resourcetype === "VersionStack"
                    ? item?.versions?.[0]?.file
                    : item;
                return (
                  <RecursiveTreeNode
                    key={i}
                    name={resource?.name}
                    id={item?.id}
                    resourcetype={resource?.resourcetype}
                    permissions={item?.permissions}
                    children_count={item?.children_count}
                    hasEditPermission={hasEditPermission}
                  />
                );
              })}
            {(isLoading || isFetching) &&
              Array.from({ length: 5 }).map((_, i) => {
                return (
                  <div
                    key={i}
                    className="flex h-20 items-center justify-between border-b-1 border-default-100 p-4"
                  >
                    <div className="ml-12 flex items-center gap-2">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-5 w-[100px] rounded-lg" />
                    </div>
                    <Skeleton className="h-6 w-[150px] rounded-lg" />
                  </div>
                );
              })}
            {!isLoading && results?.length === 0 && (
              <div
                className="flex w-full items-center justify-center"
                style={{
                  height: "50vh",
                }}
              >
                <span className="text-ds-text-secondary">
                  No files or folders found
                </span>
              </div>
            )}
            <div className="h-1 w-full" ref={ref} />
            {/* This is to make sure user can check last item from the list */}
            {/* {seletedTreeNode?.length > 0 && <div className="h-[70px] w-full"></div>} */}
          </ScrollShadow>
        </div>
      )}
    </div>
  );
};
export default RecursiveTreeNode;
