import type { User as UserType } from "../../../api-integration/types/auth";

import { useEffect, useState } from "react";

import { useClickOutside, useDebouncedValue } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { ChevronBottom, CrossLarge, MagnifyingGlass } from "@tessact/icons";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Listbox, ListboxItem } from "../../../components/ui/Listbox";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../../components/ui/Modal";
import { ScrollShadow } from "../../../components/ui/ScrollShadow";
import { User } from "../../../components/ui/User";
import UserFallback from "../../../components/ui/UserFallback";

import { useOrganization } from "../../../hooks/useOrganization";

import { useAddMembersToSecurityGroup } from "../../../api-integration/mutations/security-groups";
import { useOrganizationUsersQuery } from "../../../api-integration/queries/user-management";

import { PROFILE_COMBINATIONS } from "../../../constants/data-colors/data-colors";
// import { debounceTime } from '../../../data/inputs';

const debounceTime = 300;

interface AddMembersToExistingGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
}

export const AddMembersToExistingGroupModal = ({
  isOpen,
  onClose,
  groupName,
  groupId,
}: AddMembersToExistingGroupModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [openUsersList, setOpenUsersList] = useState(false);

  const organization = useOrganization();

  const { data, fetchNextPage } = useOrganizationUsersQuery(
    organization.id,
    debouncedSearchQuery
  );

  const { mutateAsync: addMembersToSecurityGroup, isPending } =
    useAddMembersToSecurityGroup(groupId);

  const users = data?.pages?.flatMap((page) => page.results) || [];

  const handleAddUser = (userId: string) => {
    setSelectedUsers((prev) => [
      ...prev,
      users.find((user) => user.id === userId) as UserType,
    ]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const outsideRef = useClickOutside(() => setOpenUsersList(false));

  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        setSelectedUsers([]);
        onClose();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Adding members to {groupName}</h2>
          <p className="text-base font-normal text-ds-text-secondary">
            Browse and add organisation members
          </p>
        </ModalHeader>
        <ModalBody>
          {/* <Autocomplete
            placeholder="Search for users in organization"
            startContent={<MagnifyingGlass size={20} />}
            multiple
            items={
              users?.filter(
                (user) => !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
              ) || []
            }
            onInputChange={setSearchQuery}
            onSelectionChange={(key) => handleAddUser(key as string)}
            allowsCustomValue
          >
            {(user) => (
              <AutocompleteItem key={user.id} onPress={() => handleAddUser(user.id)}>
                <User
                  name={user.profile.display_name}
                  description={user.email}
                  avatarProps={{
                    src: user.profile.profile_picture as string,
                    showFallback: true,
                    classNames: {
                      base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
                    },
                    fallback: (
                      <UserFallback
                        firstName={user.profile.first_name}
                        lastName={user.profile?.last_name}
                        displayName={user.profile?.display_name}
                        email={user.email}
                        color={user.profile?.color}
                      />
                    )
                  }}
                />
              </AutocompleteItem>
            )}
          </Autocomplete> */}

          <div className="max-h-80">
            <div className="relative flex flex-col gap-2">
              <Input
                placeholder="Search for users"
                value={searchQuery}
                onChange={(e) => {
                  if (!openUsersList) {
                    setOpenUsersList(true);
                  }
                  setSearchQuery(e.target.value);
                }}
                startContent={<MagnifyingGlass size={20} />}
                endContent={
                  <motion.div
                    initial={{
                      rotate: 0,
                    }}
                    animate={{
                      rotate: openUsersList ? 180 : 0,
                    }}
                    className="text-default-400"
                  >
                    <ChevronBottom size={14} />
                  </motion.div>
                }
                onFocus={() => setOpenUsersList(true)}
              />

              <div
                className={cn({
                  "absolute top-11 z-10 h-2/3 w-full overflow-hidden rounded-xl bg-default-100":
                    openUsersList,
                  hidden: !openUsersList,
                })}
              >
                <ScrollShadow className="h-full">
                  <Listbox
                    ref={outsideRef}
                    className={cn({
                      "flex flex-col gap-2 transition-all duration-300 ease-in-out":
                        openUsersList,
                      hidden: !openUsersList,
                    })}
                  >
                    {users
                      ?.filter(
                        (user) =>
                          !selectedUsers?.some(
                            (selectedUser) => selectedUser.id === user.id
                          )
                      )
                      ?.map((user) => (
                        <ListboxItem
                          key={user.id}
                          onPress={() => handleAddUser(user.id)}
                        >
                          <User
                            name={
                              user.profile?.display_name || "No display name"
                            }
                            description={user.email}
                            avatarProps={{
                              src: user.profile?.profile_picture || undefined,
                              alt: user.profile?.display_name,
                              size: "md",
                              showFallback: true,
                              classNames: {
                                base: cn(
                                  PROFILE_COMBINATIONS[
                                    user?.profile?.color || 0
                                  ]
                                ),
                              },
                              fallback: (
                                <UserFallback
                                  firstName={user.profile.first_name}
                                  lastName={user.profile?.last_name}
                                  displayName={user.profile?.display_name}
                                  email={user.email}
                                  color={user.profile?.color}
                                />
                              ),
                            }}
                            classNames={{
                              name: "cursor-pointer",
                            }}
                          />
                        </ListboxItem>
                      ))}
                  </Listbox>
                  <div ref={ref} />
                </ScrollShadow>
              </div>

              <ScrollShadow className="flex h-60 flex-col">
                <div className={cn("flex max-h-72 flex-col py-2")}>
                  {selectedUsers.map((user) => (
                    <div
                      className="flex items-center justify-between p-2"
                      key={user.id}
                    >
                      <User
                        name={user.profile.display_name}
                        description={user.email}
                        avatarProps={{
                          src: user.profile.profile_picture as string,
                          showFallback: true,
                          classNames: {
                            base: cn(
                              PROFILE_COMBINATIONS[user?.profile?.color || 0]
                            ),
                          },
                          fallback: (
                            <UserFallback
                              firstName={user.profile.first_name}
                              lastName={user.profile?.last_name}
                              displayName={user.profile?.display_name}
                              email={user.email}
                              color={user.profile?.color}
                            />
                          ),
                        }}
                      />
                      <Button
                        isIconOnly
                        onPress={() => handleRemoveUser(user.id)}
                        variant="light"
                        aria-label="Remove user"
                      >
                        <CrossLarge size={20} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </div>

            {/* <ScrollShadow className="flex max-h-60 min-h-60 flex-col" size={80} offset={2}>
              {selectedUsers.map((user) => (
                <div className="flex items-center justify-between p-2" key={user.id}>
                  <User
                    name={user.profile.display_name}
                    description={user.email}
                    avatarProps={{
                      src: user.profile.profile_picture as string,
                      showFallback: true,
                      classNames: {
                        base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
                      },
                      fallback: (
                        <UserFallback
                          firstName={user.profile.first_name}
                          lastName={user.profile?.last_name}
                          displayName={user.profile?.display_name}
                          email={user.email}
                          color={user.profile?.color}
                        />
                      )
                    }}
                  />
                  <Button isIconOnly onPress={() => handleRemoveUser(user.id)} variant="light">
                    <CrossLarge size={20} />
                  </Button>
                </div>
              ))}
            </ScrollShadow> */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            size="lg"
            fullWidth
            isDisabled={selectedUsers.length === 0}
            isLoading={isPending}
            onPress={async () => {
              await addMembersToSecurityGroup(
                selectedUsers.map((user) => user.id)
              );
              setSelectedUsers([]);
              onClose();
            }}
            aria-label="Add members to security group"
          >
            Add members to {groupName}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
