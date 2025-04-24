import { usePermissions } from '@/context/permissions';
import { useQueryClient } from '@tanstack/react-query';

import { Modal, ModalContent } from '@/components/ui/Modal';

import { DynamicCreationModal } from '@/components/user-management/modals/dynamic-creation-modal/DynamicCreationModal';

import { useOrganization } from '@/hooks/useOrganization';

import {
  orphanUsersQueryKey,
  useOrphanUsersQuery
} from '@/api-integration/queries/user-management';

import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

interface OrphanUsersModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const OrphanUsersModal = ({ isOpen, setIsOpen }: OrphanUsersModalProps) => {
  const organization = useOrganization();
  const { data: orphanUsers } = useOrphanUsersQuery(organization?.id);
  const queryClient = useQueryClient();
  const { organizationPermissions } = usePermissions();
  if (!orphanUsers) return null;
  return (
    <Modal size={orphanUsers?.length > 1 ? 'lg' : 'md'} isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="flex flex-col p-8">
        <DynamicCreationModal
          hideTeamActions={
            !checkPermission(
              PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_TEAMS,
              organizationPermissions ?? []
            )
          }
          onSuccessfulCreation={() => {
            if (orphanUsers?.length === 0) {
              setIsOpen(false);
            }
            queryClient.invalidateQueries({
              queryKey: orphanUsersQueryKey(organization?.id)
            });
          }}
          users={orphanUsers ?? []}
        />
      </ModalContent>
    </Modal>
  );
};
