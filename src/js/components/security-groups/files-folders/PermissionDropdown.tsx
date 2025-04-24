import React, { useEffect, useState } from "react";

// import { useParams } from "next/navigation";

import { cn, useDisclosure } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";

import { Check, ChevronBottom } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";
import { Divider } from "../../../components/ui/Divider";
// import { Link } from "../../../components/ui/NextLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/Popover";
import { Switch } from "../../../components/ui/Switch";

import { SecurityGroupPermissionConfimation } from "../../../components/security-groups/modals/SecurityGroupPermissionConfimationModal/SecurityGroupPermissionConfirmationModal";

import { useOrganization } from "../../../hooks/useOrganization";
import { useParamsStateStore } from "../../../stores/params-state-store";
import {
  useAssignPermissionsToSecurityGroup,
  useAssignPersonToAsset,
} from "../../../api-integration/mutations/security-groups";
import { ResourceType } from "../../../api-integration/types/library";

import { useSecurityGroupStore } from "../../../stores/security-store";

export type Permission = "read" | "write" | "delete" | "";

export type PermissionPayload =
  | "can_view_asset"
  | "can_edit_asset"
  | "can_delete_asset";

type Permissions = {
  title: string;
  permissions: PermissionPayload[];
};

interface PermissionDropdownProps {
  selectedItems: {
    id: string;
    children_count: number;
    resourcetype: ResourceType;
    permissions: PermissionPayload[];
  }[];
  permissions?: PermissionPayload[];
  isLoading?: boolean;
  isMultiAsset?: boolean;
  selectedItem?: {
    id: string;
    children_count: number;
    resourcetype: ResourceType;
  };
  hasEditPermission: boolean;
  parentId?: string;
  customSecurityGroupId?: string;
  onSuccess?: () => void;
  showViewGroupLink?: boolean;
  customUserId?: string;
}

const PermissionDropdown = ({
  selectedItems,
  permissions,
  isMultiAsset,
  selectedItem,
  hasEditPermission,
  parentId,
  customSecurityGroupId,
  onSuccess,
  showViewGroupLink,
  customUserId,
}: PermissionDropdownProps) => {
  const [selected, setSelected] = useState<Permissions | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isOpen: isModalOpen, onOpenChange: onModalOpenChange } =
    useDisclosure();
  // const params = useParams();
  const { selectedWorkspace } = useSecurityGroupStore();
  const [isRecursive, setIsRecursive] = useState(false);
  const [loading, setLoading] = useState(false);

  const { groupId } = useParamsStateStore();

  // useEffect(() => {
  //   const permissions = selectedItems?.flatMap((item) => item?.permissions);
  //   if (permissions.includes('can_delete_asset')) {
  //     setSelected({
  //       title: 'Read, write & delete',
  //       permissions: ['can_view_asset', 'can_edit_asset', 'can_delete_asset']
  //     });
  //   } else if (permissions.includes('can_edit_asset')) {
  //     setSelected({ title: 'Read & write', permissions: ['can_view_asset', 'can_edit_asset'] });
  //   } else if (permissions.includes('can_view_asset')) {
  //     setSelected({ title: 'Read only', permissions: ['can_view_asset'] });
  //   } else {
  //     setSelected(null);
  //   }
  // }, [selectedItems]);

  // const dropdownValue = useMemo(() => {
  //   let label = 'No Access';
  //   const countView = selectedItems.filter((item) =>
  //     item.permissions?.includes('can_view_asset')
  //   ).length;
  //   const countEdit = selectedItems.filter((item) =>
  //     item.permissions?.includes('can_edit_asset')
  //   ).length;
  //   const countDelete = selectedItems.filter((item) =>
  //     item.permissions?.includes('can_delete_asset')
  //   ).length;

  //   if (countView) {
  //     if (countEdit === 0 && countDelete === 0) {
  //       label = 'Read only';
  //     } else if (countEdit === countView) {
  //       label = 'Read & write';
  //       if (countDelete === countEdit) {
  //         label = 'Read, write & delete';
  //       }
  //     } else {
  //       label = 'Mixed';
  //     }
  //   }
  //   return label;
  // }, [selectedItems]);

  const queryClient = useQueryClient();
  const organization = useOrganization();

  // const groupId = customSecurityGroupId || (params.groupId as string);

  const { mutateAsync: assignPermissionsToSecurityGroup } =
    useAssignPermissionsToSecurityGroup({
      securityId: groupId,
      workspaceId: selectedWorkspace as string,
    });

  const { mutateAsync: assignPersonToAsset } = useAssignPersonToAsset();

  const dropdownContent = [
    {
      title: "Read only",
      permissions: ["can_view_asset"],
    },
    {
      title: "Read & write",
      permissions: ["can_view_asset", "can_edit_asset"],
    },
    {
      title: "Read, write & delete",
      permissions: ["can_view_asset", "can_edit_asset", "can_delete_asset"],
    },
  ];

  const updatePermissions = (selectedPermission: Permissions) => {
    if (!hasEditPermission) return;
    setSelected(selectedPermission);
    if (!isMultiAsset) {
      setLoading(true);
      if (customUserId) {
        assignPersonToAsset(
          {
            userId: customUserId,
            payload: {
              asset: selectedItem?.id as string,
              permissions: selectedPermission.permissions,
              organization: organization?.id as string,
            },
          },
          {
            onSuccess: () => {
              setIsRecursive(false);
              setLoading(false);
              onSuccess?.();
            },
          }
        );
      } else {
        assignPermissionsToSecurityGroup(
          {
            assets: [selectedItem?.id as string],
            permissions: selectedPermission.permissions,
            is_recursive: isRecursive,
          },
          {
            onSuccess: () => {
              setIsRecursive(false);
              setLoading(false);
              if (parentId) {
                queryClient.invalidateQueries({
                  queryKey: [
                    "libraryTree",
                    "group",
                    groupId,
                    "workspace",
                    selectedWorkspace,
                    "parent",
                    parentId,
                  ],
                });
              }
              onSuccess?.();
            },
          }
        );
      }
    } else {
      setDropdownOpen(false);
      onModalOpenChange();
    }
  };

  const removePermissions = (id: string) => {
    if (!hasEditPermission) return;
    setSelected(null);
    if (!isMultiAsset) {
      setLoading(true);
      if (customUserId) {
        assignPersonToAsset(
          {
            userId: customUserId,
            payload: {
              asset: selectedItem?.id as string,
              permissions: [],
              organization: organization?.id as string,
            },
          },
          {
            onSuccess: () => {
              setIsRecursive(false);
              setLoading(false);
              onSuccess?.();
            },
          }
        );
      } else {
        assignPermissionsToSecurityGroup(
          {
            assets: [id as string],
            permissions: [],
            is_recursive: isRecursive,
          },
          {
            onSuccess: () => {
              setIsRecursive(false);
              setLoading(false);
              if (parentId) {
                queryClient.invalidateQueries({
                  queryKey: [
                    "libraryTree",
                    "group",
                    groupId || customSecurityGroupId,
                    "workspace",
                    selectedWorkspace,
                    "parent",
                    parentId,
                  ],
                });
              }
              onSuccess?.();
            },
          }
        );
      }
    } else {
      setDropdownOpen(false);
      onModalOpenChange();
    }
  };
  useEffect(() => {
    if (permissions) {
      if (permissions.includes("can_delete_asset")) {
        setSelected({
          title: "Read, write & delete",
          permissions: ["can_view_asset", "can_edit_asset", "can_delete_asset"],
        });
      } else if (permissions.includes("can_edit_asset")) {
        setSelected({
          title: "Read & write",
          permissions: ["can_view_asset", "can_edit_asset"],
        });
      } else if (permissions.includes("can_view_asset")) {
        setSelected({ title: "Read only", permissions: ["can_view_asset"] });
      } else {
        setSelected(null);
      }
    }
  }, [permissions]);

  return (
    <>
      <Popover
        shouldBlockScroll
        classNames={{
          content: "p-0",
        }}
        onOpenChange={(open) => setDropdownOpen(open)}
        isOpen={isDropdownOpen}
      >
        <PopoverTrigger>
          {/* <div className="flex h-5 cursor-pointer items-center gap-2 text-sm font-medium text-ds-text-secondary">
            <span className="text-sm font-medium text-ds-text-secondary">
              {selected?.title || 'No access'}
            </span>
            <ChevronBottom size={14} />
          </div> */}
          <Button
            variant="light"
            endContent={<ChevronBottom size={14} />}
            isLoading={loading}
            className={cn(
              "text-sm font-medium text-ds-text-secondary",
              isMultiAsset && "text-ds-button-default-text"
            )}
            aria-label="Select permission"
          >
            <span
              className={cn(
                "text-sm font-medium text-ds-text-secondary",
                isMultiAsset && "text-ds-button-default-text"
              )}
            >
              {/* {dropdownVa} */}
              {selected?.title
                ? selected?.title
                : isMultiAsset
                ? "Select a permission"
                : "No Access"}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <div className="flex flex-col gap-1 rounded-2xl bg-default-100 p-2">
            {selectedItem && selectedItem.children_count > 0 && (
              <div className="flex items-center rounded-xl bg-default-200 p-3">
                <div className="flex items-center gap-4">
                  <Switch
                    size="sm"
                    isSelected={isRecursive}
                    onValueChange={setIsRecursive}
                  ></Switch>
                  <span className="text-sm font-medium text-ds-text-primary">
                    Apply to nested items
                  </span>
                </div>
              </div>
            )}
            {dropdownContent.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex cursor-pointer items-center gap-10 rounded-lg p-2 font-medium text-ds-menu-text-primary hover:bg-default-200",
                  {
                    "bg-default-200": selected?.title === item.title,
                  }
                )}
                onClick={() => {
                  updatePermissions(item as Permissions);
                  setDropdownOpen(false);
                }}
              >
                <span className="cursor-pointer font-medium text-ds-menu-text-primary">
                  {item.title}
                </span>
                {selected?.title === item.title && (
                  <Check
                    size={14}
                    className="text-default-900 -translate-y-[2px]"
                  />
                )}
              </div>
            ))}
            <Divider className="bg-default-200" />
            <span
              className="cursor-pointer rounded-lg p-2 font-medium text-ds-menu-text-primary hover:bg-default-200"
              onClick={() => {
                removePermissions(selectedItem?.id as string);
                setDropdownOpen(false);
              }}
            >
              Remove access
            </span>
            {showViewGroupLink && (
              <>
                <Divider className="bg-default-200" />
                {/* <Link
                  href={`/admin/security-groups/${groupId}`}
                  className="cursor-pointer rounded-lg p-2 font-medium text-ds-menu-text-primary hover:bg-default-200"
                > */}
                View Security Group
                {/* </Link> */}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SecurityGroupPermissionConfimation
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        selectedItems={selectedItems}
        selectedPermissions={selected as Permissions}
      />
    </>
  );
};

export default PermissionDropdown;
