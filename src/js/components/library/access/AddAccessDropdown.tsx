"use client";

import { useEffect, useMemo, useState } from "react";

import { DateValue } from "@internationalized/date";
import { useDebouncedValue } from "@mantine/hooks";
import { useDisclosure } from "@nextui-org/react";
import pluralize from "pluralize";
import { useInView } from "react-intersection-observer";

import {
  ChevronRightSmallFilled,
  Lock,
  People,
  PeopleAdd2,
} from "@tessact/icons";

import { Button } from "../../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../ui/RadixDropdown";
import { ScrollShadow } from "../../ui/ScrollShadow";
import { User } from "../../ui/User";

import { Searchbar } from "../../Searchbar";

import { useOrganization } from "../../../hooks/useOrganization";
import { useWorkspace } from "../../../hooks/useWorkspace";

import { useSecurityGroupsQuery } from "../../../api-integration/queries/security-groups";
import { useWorkspaceUsersQuery } from "../../../api-integration/queries/user-management";

// import { debounceTime } from "../../../data/inputs";

const debounceTime = 300;

type BooleanFilter = boolean;
type ArrayFilter = string[];
export type DateFilter = DateValue | null;

export interface FilterCollection {
  attachments: BooleanFilter;
  unread: BooleanFilter;
  markedDone: BooleanFilter;
  tags: ArrayFilter;
  mentions: ArrayFilter;
  commenter: ArrayFilter;
  createdDate: DateFilter;
}

const iconProps = {
  className: "text-default-500",
  size: 20,
};

export const AddAccessDropdown = ({
  handleAssignPersonToAsset,
  handleAssignSecurityGroupToAsset,
}: {
  handleAssignPersonToAsset: (userId: string) => void;
  handleAssignSecurityGroupToAsset: (securityGroupId: string) => void;
}) => {
  const { workspace } = useWorkspace();
  const { ref, inView } = useInView();
  const organization = useOrganization();

  const [searchSecurityGroup, setSearchSecurityGroup] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(
    searchSecurityGroup,
    debounceTime
  );

  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchUser] = useDebouncedValue(searchUser, debounceTime);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: securityGroups,
    fetchNextPage: fetchNextSecurityGroup,
    isSuccess: isSuccessSecurityGroup,
    hasNextPage: hasNextPageSecurityGroup,
    isFetchingNextPage: isFetchingNextPageSecurityGroup,
  } = useSecurityGroupsQuery(organization.id, debouncedSearchQuery);

  const groups = useMemo(() => {
    return securityGroups?.pages.flatMap((page) => page.results) || [];
  }, [securityGroups]);

  const {
    data: workspaceUsers,
    fetchNextPage: workspaceUsersFetchNextPage,
    isSuccess: isSuccessWorkspaceUsers,
    hasNextPage: hasNextPageWorkspaceUsers,
    isFetchingNextPage: isFetchingNextPageWorkspaceUsers,
  } = useWorkspaceUsersQuery(
    workspace?.id as string,
    debouncedSearchUser,
    !!workspace?.id,
    {
      key: "",
      order: "",
    }
  );

  const users = useMemo(() => {
    return workspaceUsers?.pages.flatMap((page) => page.results) || [];
  }, [workspaceUsers]);

  useEffect(() => {
    if (inView && isSuccessSecurityGroup) {
      fetchNextSecurityGroup();
    }
  }, [inView, fetchNextSecurityGroup, isSuccessSecurityGroup]);

  useEffect(() => {
    if (inView && isSuccessWorkspaceUsers) {
      workspaceUsersFetchNextPage();
    }
  }, [inView, workspaceUsersFetchNextPage, isSuccessWorkspaceUsers]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          isIconOnly
          onPress={onOpen}
          color="secondary"
          className="h-12 w-12"
          aria-label="Add access dropdown"
        >
          <PeopleAdd2 size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[10000]">
        <DropdownMenuGroup>
          <DropdownMenuSub key="security_groups">
            <DropdownMenuSubTrigger
              startContent={<Lock {...iconProps} />}
              endContent={<ChevronRightSmallFilled width={20} height={20} />}
            >
              <div className="flex items-center gap-2">Add Security group</div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="z-[10000] max-h-96 max-w-fit px-0">
                <DropdownMenuLabel>
                  <Searchbar
                    value={searchSecurityGroup}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchSecurityGroup(e.target.value);
                    }}
                    placeholder="Search security groups"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                  />
                </DropdownMenuLabel>
                <ScrollShadow className="h-full px-2">
                  <DropdownMenuGroup>
                    {groups?.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onSelect={() =>
                          handleAssignSecurityGroupToAsset(item.id)
                        }
                      >
                        <div className="flex w-full items-center justify-between gap-1">
                          <span className="text-base text-ds-text-primary">
                            {item?.title}
                          </span>
                          <div className="flex items-center gap-1 rounded-[32px] border border-default-200 px-[10px] py-[6px]">
                            <People size={20} />
                            <span className="text-sm text-ds-text-secondary">
                              {item?.users?.length}{" "}
                              {pluralize("user", item?.users?.length)}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {(hasNextPageSecurityGroup ||
                      isFetchingNextPageSecurityGroup) && (
                      <DropdownMenuItem inset>
                        <div ref={ref} />
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </ScrollShadow>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub key="users">
            <DropdownMenuSubTrigger
              startContent={<People {...iconProps} />}
              endContent={<ChevronRightSmallFilled width={20} height={20} />}
            >
              <div className="flex items-center gap-2">Add User</div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="z-[10000] max-h-96 max-w-fit px-0">
                <DropdownMenuLabel>
                  <Searchbar
                    value={searchUser}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchUser(e.target.value);
                    }}
                    placeholder="Search users"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                  />
                </DropdownMenuLabel>
                <ScrollShadow className="h-full px-2">
                  <DropdownMenuGroup>
                    {users?.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onSelect={() => handleAssignPersonToAsset(item.id)}
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
                          }}
                          description={item?.email}
                        />
                      </DropdownMenuItem>
                    ))}
                    {(hasNextPageWorkspaceUsers ||
                      isFetchingNextPageWorkspaceUsers) && (
                      <DropdownMenuItem inset>
                        <div ref={ref} />
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </ScrollShadow>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddAccessDropdown;
