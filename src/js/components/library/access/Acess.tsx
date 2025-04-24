import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import pluralize from "pluralize";
import { useInView } from "react-intersection-observer";

import { ScrollShadow } from "../../ui/ScrollShadow";
import { Tab, Tabs } from "../../ui/Tabs";
import { User } from "../../ui/User";

import { AddAccessDropdown } from "./AddAccessDropdown";
import { SecurityGroupLoadingState, UserLoadingState } from "./LoadingState";
import { Searchbar } from "../../Searchbar";
import PermissionDropdown from "../../security-groups/files-folders/PermissionDropdown";

import { useOrganization } from "../../../hooks/useOrganization";
import { useWorkspace } from "../../../hooks/useWorkspace";

import {
  useAssignPermissionsToSecurityGroup,
  useAssignPersonToAsset,
} from "../../../api-integration/mutations/security-groups";
import { getAssetDetailsQueryKey } from "../../../api-integration/queries/library";
import {
  getSecurityGroupAccessToAssetQueryKey,
  getUserAccessToAssetQueryKey,
  useSecurityGroupAccessToAsset,
  useUserAccessToAsset,
} from "../../../api-integration/queries/security-groups";

// import { debounceTime } from '../../../data/inputs';

const debounceTime = 300;

export const Access = ({ assetId }: { assetId: string }) => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { workspace } = useWorkspace();
  const organization = useOrganization();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchValue, debounceTime);
  const [selectedSecurityGroup, setSelectedSecurityGroup] = useState<
    string | null
  >(null);

  const [selected, setSelected] = useState<"groups" | "users">("groups");

  const {
    data: securityGroups,
    isFetching: isFetchingSecurityGroup,
    fetchNextPage: fetchNextSecurityGroup,
    isSuccess: isSuccessSecurityGroup,
    hasNextPage: hasNextPageSecurityGroup,
    isFetchingNextPage: isFetchingNextPageSecurityGroup,
  } = useSecurityGroupAccessToAsset(assetId, debouncedSearchQuery);

  const {
    data: usersWithAccess,
    isFetching: isFetchingUser,
    fetchNextPage: fetchNextUser,
    isSuccess: isSuccessUser,
    hasNextPage: hasNextPageUser,
    isFetchingNextPage: isFetchingNextPageUser,
  } = useUserAccessToAsset(assetId, debouncedSearchQuery);

  const groups = useMemo(() => {
    return securityGroups?.pages.flatMap((page) => page.results) || [];
  }, [securityGroups]);

  const users = useMemo(() => {
    return usersWithAccess?.pages.flatMap((page) => page.results) || [];
  }, [usersWithAccess]);

  const { mutate: assignPersonToAsset } = useAssignPersonToAsset();

  const { mutate: assignSecurityGroupToAsset } =
    useAssignPermissionsToSecurityGroup({
      securityId: selectedSecurityGroup as string,
      workspaceId: workspace?.id as string,
    });

  useEffect(() => {
    if (inView && isSuccessSecurityGroup) {
      fetchNextSecurityGroup();
    }
  }, [inView, fetchNextSecurityGroup, isSuccessSecurityGroup]);

  useEffect(() => {
    if (inView && isSuccessUser) {
      fetchNextUser();
    }
  }, [inView, fetchNextUser, isSuccessUser]);

  const handleAssignPersonToAsset = (userId: string) => {
    if (userId) {
      assignPersonToAsset(
        {
          userId,
          payload: {
            asset: assetId,
            permissions: [
              "can_view_asset",
              "can_edit_asset",
              "can_delete_asset",
            ],
            organization: organization?.id as string,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getUserAccessToAssetQueryKey(
                assetId,
                debouncedSearchQuery
              ),
            });
            queryClient.invalidateQueries({
              queryKey: getAssetDetailsQueryKey(assetId),
            });
            setSelected("users");
          },
        }
      );
    }
  };
  const handleAssignSecurityGroupToAsset = (securityGroupId: string) => {
    if (securityGroupId) {
      setSelectedSecurityGroup(securityGroupId);
      assignSecurityGroupToAsset(
        {
          assets: [assetId],
          permissions: ["can_view_asset", "can_edit_asset", "can_delete_asset"],
          is_recursive: false,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getSecurityGroupAccessToAssetQueryKey(
                assetId,
                debouncedSearchQuery
              ),
            });
            queryClient.invalidateQueries({
              queryKey: getAssetDetailsQueryKey(assetId),
            });
            setSelected("groups");
          },
        }
      );
    }
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pt-5">
      <div className="flex h-full min-h-0 w-full flex-col gap-4">
        <div className="grid w-full basis-12 grid-cols-[1fr,auto] items-center gap-2 px-3">
          <Searchbar
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Find security groups & users"
          />
          <AddAccessDropdown
            handleAssignPersonToAsset={handleAssignPersonToAsset}
            handleAssignSecurityGroupToAsset={handleAssignSecurityGroupToAsset}
          />
        </div>
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as "groups" | "users")}
          classNames={{
            panel: "px-0 min-h-0 flex flex-col",
            base: "px-3",
          }}
        >
          <Tab title="Security Groups" key="groups">
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              {/* <span className="px-3 text-sm text-ds-text-secondary">Security Groups</span> */}
              <ScrollShadow className="h-full ">
                {groups?.length > 0 &&
                  groups?.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between gap-1 border-b-1 border-default-200 px-[26px] py-[10px]"
                      >
                        <div className="flex flex-col">
                          <span className="text-base text-ds-text-primary">
                            {item.title}
                          </span>
                          <span className="text-xs text-ds-text-secondary">
                            {item?.users_count}{" "}
                            {pluralize("user", item?.users_count)}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <PermissionDropdown
                            key={item.id}
                            selectedItems={[
                              {
                                id: assetId as string,
                                children_count: 0, // hides the apply to nested items
                                resourcetype: "Folder",
                                permissions: item.permissions ?? [],
                              },
                            ]}
                            permissions={item.permissions ?? []}
                            isMultiAsset={false}
                            selectedItem={{
                              id: assetId,
                              children_count: 0,
                              resourcetype: "Folder",
                            }}
                            hasEditPermission={true}
                            customSecurityGroupId={item.id}
                            onSuccess={() => {
                              queryClient.invalidateQueries({
                                queryKey: getSecurityGroupAccessToAssetQueryKey(
                                  assetId,
                                  debouncedSearchQuery
                                ),
                              });
                              queryClient.invalidateQueries({
                                queryKey: getAssetDetailsQueryKey(assetId),
                              });
                            }}
                            showViewGroupLink
                          />
                        </div>
                      </div>
                    );
                  })}
                {groups?.length === 0 && !isFetchingSecurityGroup && (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-ds-text-secondary">
                      No security groups found
                    </span>
                  </div>
                )}
                {isFetchingSecurityGroup && <SecurityGroupLoadingState />}
                {(hasNextPageSecurityGroup ||
                  isFetchingNextPageSecurityGroup) && <div ref={ref} />}
              </ScrollShadow>
            </div>
          </Tab>
          <Tab title="User Access" key="users">
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              {/* <span className="px-3 text-sm text-ds-text-secondary">Users</span> */}
              <ScrollShadow className="h-full">
                {users?.length > 0 &&
                  users?.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between gap-1 border-b-1 border-default-200 px-3 py-[10px]"
                      >
                        <User
                          name={
                            item?.profile?.display_name ||
                            item?.profile?.first_name ||
                            ""
                          }
                          avatarProps={{
                            src: item?.profile?.profile_picture ?? "",
                            size: "sm",
                            className: "flex-shrink-0",
                          }}
                          description={item?.email}
                          classNames={{
                            description: "min-w-0 truncate w-full",
                            name: "min-w-0 truncate w-full",
                            base: "min-w-0",
                            wrapper: "min-w-0",
                          }}
                        />
                        <div className="flex-shrink-0">
                          <PermissionDropdown
                            key={item.id}
                            selectedItems={[
                              {
                                id: assetId as string,
                                children_count: 0, // hides the apply to nested items
                                resourcetype: "Folder",
                                permissions: item.permissions ?? [],
                              },
                            ]}
                            permissions={item.permissions ?? []}
                            isMultiAsset={false}
                            selectedItem={{
                              id: assetId,
                              children_count: 0,
                              resourcetype: "Folder",
                            }}
                            hasEditPermission={true}
                            customUserId={item.id}
                            onSuccess={() => {
                              queryClient.invalidateQueries({
                                queryKey: getUserAccessToAssetQueryKey(
                                  assetId,
                                  debouncedSearchQuery
                                ),
                              });
                              queryClient.invalidateQueries({
                                queryKey: getAssetDetailsQueryKey(assetId),
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                {!isFetchingUser && users?.length === 0 && (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-ds-text-secondary">
                      No users found
                    </span>
                  </div>
                )}
                {isFetchingUser && <UserLoadingState />}
                {(hasNextPageUser || isFetchingNextPageUser) && (
                  <div ref={ref} />
                )}
              </ScrollShadow>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
