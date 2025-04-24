import { useDisclosure } from "@nextui-org/react";

import { ArrowRight, TriangleExclamation } from "@tessact/icons";

import { Button } from "../../components/ui/Button";

import { OrphanUsersModal } from "../../components/user-management/modals/orphan-users-modal/OrphanUsersModal";

import { useOrganization } from "../../hooks/useOrganization";

import { useOrphanUsersQuery } from "../../api-integration/queries/user-management";
import { GetOrphanUsersResponse } from "../../api-integration/types/user-management";

export const OrphanUsersWarningCard = () => {
  const organization = useOrganization();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: orphanUsers } = useOrphanUsersQuery(organization?.id);

  if (!orphanUsers || orphanUsers?.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border-ds-combination-amber-subtle-border bg-ds-combination-amber-subtle-bg p-4 text-ds-combination-amber-subtle-text">
        <div className="flex flex-col">
          <div className="flex gap-2">
            <TriangleExclamation
              size={24}
              className="text-ds-combination-amber-subtle-text"
            />
            <p className="text-base font-medium ">{getTitle(orphanUsers)}</p>
          </div>
          <p className="ml-8 text-sm font-normal">
            If users are not part of workspace, they do not get to access
            Tessact fully.
          </p>
        </div>
        <Button
          className="text- rounded-md bg-transparent px-4 py-2 data-[hover=true]:bg-transparent"
          variant="light"
          endContent={<ArrowRight size={20} />}
          onPress={onOpen}
          aria-label="Add to workspaces"
        >
          Add to workspaces
        </Button>
      </div>
      <OrphanUsersModal isOpen={isOpen} setIsOpen={onOpenChange} />
    </>
  );
};

const getTitle = (orphanUsers: GetOrphanUsersResponse) => {
  if (orphanUsers.length === 0) return null;
  if (orphanUsers.length === 1)
    return `${orphanUsers[0].profile.display_name} is not part of any workspaces!`;
  if (orphanUsers.length === 2)
    return `${orphanUsers[0].profile.display_name} and ${orphanUsers[1].profile.display_name} are not part of any workspaces!`;
  return `${orphanUsers[0].profile.display_name}, ${
    orphanUsers[1].profile.display_name
  } and ${orphanUsers.length - 2} other${
    orphanUsers.length > 3 ? "s" : ""
  } are not part of any workspaces!`;
};
