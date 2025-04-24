import { useParams } from 'next/navigation';

import { Modal, ModalContent } from '@/components/ui/Modal';

import {
  DynamicCreationModal,
  WorkspaceWithTeamsSelection
} from '@/components/user-management/modals/dynamic-creation-modal/DynamicCreationModal';

import { useAddUsersToTeams } from '@/api-integration/mutations/user-management';
import { User } from '@/api-integration/types/auth';

interface AddToExistingTeamsModalProps {
  users: User[];
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddToExistingTeamsModal = ({
  users,
  isOpen,
  onOpenChange
}: AddToExistingTeamsModalProps) => {
  const params = useParams<{ workspaceId: string }>();
  const { mutateAsync: addUsersToTeams } = useAddUsersToTeams();
  const handleAddUsersToTeams = async (workspaceSelections: WorkspaceWithTeamsSelection[]) => {
    await addUsersToTeams(
      // Mapping through each user and creating an array of team assignments
      users.flatMap((user) =>
        // For each user, map through the teams selected in the first workspace selection
        workspaceSelections?.[0]?.teams.map((team) => ({
          user_id: user.id,
          team_id: team.teamId,
          role_ids: team.teamRoleIds
        }))
      )
    );

    onOpenChange();
  };
  return (
    <Modal size="md" className="min-h-unit-9xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="flex flex-col p-8">
        <DynamicCreationModal
          users={users}
          hideUsersList
          hideWorkspaceActions
          selectiveWorkspaces={[params.workspaceId]}
          customHeader={<p className="text-2xl font-bold ">Add to teams</p>}
          applyAction={handleAddUsersToTeams}
        />
      </ModalContent>
    </Modal>
  );
};
