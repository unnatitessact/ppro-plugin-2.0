"use client";

import { useEffect, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";

import { ChevronBottom, MagnifyingGlass } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/Popover";
import { Searchbar } from "../../../components/ui/Searchbar";

import RecursiveTreeNode from "./RecursiveTreeNode";

import { useOrganization } from "../../../hooks/useOrganization";

import {
  useUserWorkspacePermissionListQuery,
  useWorkspacesQuery,
} from "../../../api-integration/queries/user-management";

import { useSecurityGroupStore } from "../../../stores/security-store";

import { checkPermission, PERMISSIONS } from "../../../utils/accessUtils";

// import { debounceTime } from "../../../data/inputs";

const debounceTime = 300;

import { SelectionBar } from "./SelectionBar";
import { usePermissions } from "../../../context/permissions";

const FilesFolders = () => {
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    seletedTreeNode,
    clearSelectedTreeNode,
  } = useSecurityGroupStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchWorkspaceQuery, setSearchWorkspaceQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
  const [debouncedSearchWorkspaceQuery] = useDebouncedValue(
    searchWorkspaceQuery,
    debounceTime
  );
  // const [selectedWorkspaceName, setSelectedWorkspaceName] = useState('');
  const [isWorkspaceSelectionOpen, setIsWorkspaceSelectionOpen] =
    useState(false);

  const organization = useOrganization();
  const { data: workspaceListData } = useWorkspacesQuery(
    organization?.id as string,
    debouncedSearchWorkspaceQuery as string
  );

  useEffect(() => {
    if (!selectedWorkspace)
      setSelectedWorkspace(workspaceListData?.[0]?.id ?? "");
    // if (!selectedWorkspaceName) setSelectedWorkspaceName(workspaceListData?.[0]?.title ?? '');
  }, [workspaceListData, selectedWorkspace, setSelectedWorkspace]);

  const selectedWorkspaceName =
    workspaceListData?.find((workspace) => workspace?.id === selectedWorkspace)
      ?.title ?? "";

  const { organizationPermissions } = usePermissions();

  const { data: workspacePermissions } = useUserWorkspacePermissionListQuery(
    selectedWorkspace as string
  );

  const hasEditPermission =
    checkPermission(
      PERMISSIONS.ORGANIZATION
        .CAN_MANAGE_SECURITY_GROUPS_PERMISSIONS_TO_CONTENT_ACROSS_WORKSPACES,
      organizationPermissions ?? []
    ) ||
    checkPermission(
      PERMISSIONS.WORKSPACE
        .CAN_MANAGE_SECURITY_GROUP_PERMISSIONS_TO_CONTENT_IN_WORKSPACE,
      workspacePermissions ?? []
    );

  return (
    <div className="flex h-full flex-col gap-4 pb-5">
      <div className="absolute right-5 top-0 grid grid-cols-[auto,300px] items-center gap-2">
        <Popover
          placement="bottom-end"
          isOpen={isWorkspaceSelectionOpen}
          onOpenChange={(open) => setIsWorkspaceSelectionOpen(open)}
        >
          <PopoverTrigger>
            <Button
              color="secondary"
              endContent={<ChevronBottom size={12} />}
              aria-label="Show more workspaces"
            >
              {selectedWorkspaceName}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2 rounded-2xl bg-default-100 p-3">
              <Searchbar
                placeholder="Search workspaces"
                value={searchWorkspaceQuery}
                onChange={setSearchWorkspaceQuery}
              />
              <div className="max-h-80 min-h-20 overflow-hidden overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {workspaceListData?.map((option) => (
                    <span
                      className="text-ds-button-text-primary cursor-pointer rounded-lg p-2 text-sm font-medium hover:bg-default-200"
                      key={option.id}
                      onClick={() => {
                        setSelectedWorkspace(option.id);
                        setIsWorkspaceSelectionOpen(false);
                        clearSelectedTreeNode();
                      }}
                    >
                      {option.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          startContent={<MagnifyingGlass size={20} />}
          placeholder="Search through files and folders"
          value={searchQuery}
          onValueChange={setSearchQuery}
          size="md"
        />
      </div>

      <div className="flex w-full overflow-hidden rounded-xl border border-default-100">
        <RecursiveTreeNode
          name="All content"
          searchQuery={debouncedSearchQuery}
          css="bg-ds-table-header-bg pr-4 py-[30px]"
          hasEditPermission={hasEditPermission}
          isRoot
        />
        {seletedTreeNode?.length > 0 && (
          <SelectionBar hasEditPermission={hasEditPermission} />
        )}
      </div>
    </div>
  );
};

export default FilesFolders;
