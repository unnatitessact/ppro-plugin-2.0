import { Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Spacer } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';

import { Check, MagnifyingGlass, SlideAdd } from '@tessact/icons';

import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { useAddUserToTeamsWorkspaces } from '@/api-integration/mutations/user-management';
import { useWorkspacesWithTeamsListQuery } from '@/api-integration/queries/user-management';
import { User } from '@/api-integration/types/auth';
import { Team, Workspace } from '@/api-integration/types/user-management';

import { AssignWorkspacesTeamsSchema } from '@/schemas/user-management';

import { CreateNewTeamCard } from './CreateNewTeamCard';
import { CreateNewWorkspaceCard } from './CreateNewWorkspaceCard';
import { TeamsList } from './TeamsList';
import { UsersList } from './UsersList';
import { WorkspaceLabel } from './WorkspaceLabel';

export type DynamicCreationModalInputs = z.infer<typeof AssignWorkspacesTeamsSchema>;

interface DynamicCreationModalProps {
  users: User[];
  onSuccessfulCreation?: () => void;
  /** Hide the checkbox for selecting workspaces, workspace role selection, the searchbar, and the create workspace button. */
  hideWorkspaceActions?: boolean;
  /** Hide the list of users in the left sidebar. */
  hideUsersList?: boolean;
  /** Only render the following workspaces */
  selectiveWorkspaces?: string[];
  customHeader?: ReactNode;
  applyAction?: (
    workspaceSelections: WorkspaceWithTeamsSelection[],
    selectedUserId: string
  ) => void;
  hideTeamActions?: boolean;
}

export interface TeamSelection {
  teamId: Team['id'];
  teamRoleIds: string[];
}

export interface WorkspaceWithTeamsSelection {
  id: Workspace['id'];
  workspaceRoleIds: string[];
  teams: TeamSelection[];
}

export const DynamicCreationModal = ({
  users,
  hideWorkspaceActions,
  hideTeamActions,
  hideUsersList,
  selectiveWorkspaces = [],
  onSuccessfulCreation,
  customHeader,
  applyAction
}: DynamicCreationModalProps) => {
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateWorkspaceCardVisible, setIsCreateWorkspaceCardVisible] = useState(false);
  const [workspaceSelections, setWorkspaceSelections] = useState<WorkspaceWithTeamsSelection[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<Key>(users?.[0]?.id);
  const [openedWorkspaces, setOpenedWorkspaces] = useState<Set<string>>(
    new Set([...selectiveWorkspaces])
  );

  // API data
  // const { data: workspaceListData } = useWorkspacesQuery(organization?.id as string);
  const { data: workspaceListData } = useWorkspacesWithTeamsListQuery();

  const { mutate: addUserToTeamsWorkspaces, isPending } = useAddUserToTeamsWorkspaces();

  // Form data
  const userDisplayName = useMemo(
    () => users.find((user) => user.id === selectedUserId)?.profile.display_name,
    [selectedUserId, users]
  );

  const toggleWorkspaceSelection = useCallback(
    (workspaceId: Workspace['id'], isSelected: boolean) =>
      setWorkspaceSelections((currentSelections) => {
        if (isSelected) {
          // Add workspace to selection.
          return [...currentSelections, { id: workspaceId, teams: [], workspaceRoleIds: [] }];
        } else {
          // Remove workspace from selection.
          return currentSelections.filter((selection) => selection.id !== workspaceId);
        }
      }),
    [setWorkspaceSelections]
  );

  const toggleTeamSelection = useCallback(
    (teamId: Team['id'], workspaceId: Workspace['id'], isSelected: boolean) => {
      setWorkspaceSelections((currentSelections) => {
        // Find the index of the workspace to be updated.
        const workspaceIndex = currentSelections?.findIndex(
          (selection) => selection.id === workspaceId
        );

        // If adding a team and the workspace does not exist, add both the workspace and the team.
        if (isSelected && workspaceIndex === -1) {
          return [
            ...currentSelections,
            { id: workspaceId, workspaceRoleIds: [], teams: [{ teamId, teamRoleIds: [] }] }
          ];
        }

        // Map through the current state to update the teams array for the targeted workspace.
        // return
        const selections = currentSelections?.map((selection, index) => {
          if (index === workspaceIndex) {
            const updatedTeams = isSelected
              ? [...selection.teams, { teamId, teamRoleIds: [] }] // Add team if value is true.
              : selection.teams.filter((team) => team.teamId !== teamId); // Remove team if value is false.

            return { ...selection, teams: updatedTeams };
          }
          return selection;
        });
        if (hideWorkspaceActions) {
          return selections.filter((selection) => selection.teams.length > 0);
        } else {
          return selections;
        }
      });
    },
    [hideWorkspaceActions, setWorkspaceSelections]
  );

  const handleChangeWorkspaceRole = useCallback(
    (workspaceId: Workspace['id'], roleIds: string[]) => {
      setWorkspaceSelections((currentSelections) =>
        currentSelections?.map((selection) =>
          selection.id === workspaceId ? { ...selection, workspaceRoleIds: roleIds } : selection
        )
      );
    },
    [setWorkspaceSelections]
  );

  const handleChangeTeamRole = useCallback(
    (teamId: Team['id'], workspaceId: Workspace['id'], roleIds: string[]) => {
      setWorkspaceSelections((currentSelections) =>
        currentSelections?.map((selection) =>
          selection.id === workspaceId
            ? {
                ...selection,
                teams: selection.teams.map((team) =>
                  team.teamId === teamId ? { ...team, teamRoleIds: roleIds } : team
                )
              }
            : selection
        )
      );
    },
    [setWorkspaceSelections]
  );

  const handleAddToTeamsWorkspace = useCallback(() => {
    addUserToTeamsWorkspaces(
      {
        user_id: selectedUserId as string,
        workspaces: workspaceSelections?.map((selection) => ({
          workspace_id: selection.id,
          role_ids: selection.workspaceRoleIds
        })),
        teams: workspaceSelections?.flatMap((selection) =>
          selection.teams.map((team) => ({
            team_id: team.teamId,
            role_ids: team.teamRoleIds
          }))
        )
      },
      {
        onSuccess: () => {
          onSuccessfulCreation?.();
        }
      }
    );
  }, [addUserToTeamsWorkspaces, onSuccessfulCreation, selectedUserId, workspaceSelections]);

  const handleApply = useCallback(() => {
    // Check if all roles are selected
    const allRolesSelected = workspaceSelections?.every(
      (selection) =>
        (hideWorkspaceActions || selection.workspaceRoleIds.length > 0) &&
        selection.teams.every((team) => team.teamRoleIds.length > 0)
    );
    if (!allRolesSelected) {
      if (hideWorkspaceActions) {
        toast.error(`Select a role`, {
          description: `User should have atleast one role for every team.`
        });
      } else {
        toast.error(`Select a role`, {
          description: `User should have atleast one role for every workspace and team.`
        });
      }
      return;
    }
    if (applyAction) {
      applyAction(workspaceSelections, selectedUserId as string);
    } else {
      handleAddToTeamsWorkspace();
    }
  }, [
    applyAction,
    handleAddToTeamsWorkspace,
    selectedUserId,
    workspaceSelections,
    hideWorkspaceActions
  ]);

  const searchFilteredWorkspaces = useMemo(
    () =>
      workspaceListData?.filter(
        (workspace) =>
          workspace.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectiveWorkspaces.length === 0 || selectiveWorkspaces.includes(workspace.id))
      ),
    [workspaceListData, searchQuery, selectiveWorkspaces]
  );

  const totalSelectedTeams = useMemo(
    () => workspaceSelections?.reduce((acc, workspace) => acc + workspace.teams.length, 0),
    [workspaceSelections]
  );

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top when the create workspace card is opened.
    if (ref?.current && isCreateWorkspaceCardVisible) {
      ref?.current?.scrollTo({
        top: 0
      });
    }
  }, [isCreateWorkspaceCardVisible]);

  useEffect(() => {
    if (!users?.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(users?.[0]?.id);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    // auto open a workspace if it is selected
    setOpenedWorkspaces((prevOpenedWorkspaces) => {
      const newOpenedWorkspaces = new Set(prevOpenedWorkspaces);
      workspaceSelections?.forEach((selection) => {
        newOpenedWorkspaces.add(selection.id);
      });
      return newOpenedWorkspaces;
    });
  }, [setOpenedWorkspaces, workspaceSelections]);

  return (
    <div className="flex max-h-[60vh] gap-8">
      {!hideUsersList && users?.length > 1 ? (
        <UsersList selected={selectedUserId} setSelected={setSelectedUserId} users={users} />
      ) : null}
      <div className="flex flex-grow flex-col">
        <ModalHeader className="mb-0 flex flex-col justify-start p-0">
          {customHeader ?? (
            <>
              <p className="text-base font-medium text-default-500">Workspaces for</p>
              <p className="text-2xl font-bold ">{userDisplayName}</p>
            </>
          )}
        </ModalHeader>
        <ModalBody className="min-h-unit-3xl mt-10 flex overflow-hidden p-0">
          <div className="flex min-h-0 flex-col">
            {hideWorkspaceActions ? null : (
              <div className="flex w-full items-center gap-2 p-0">
                <Input
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<MagnifyingGlass size={24} />}
                  classNames={{
                    innerWrapper: 'flex items-center gap-0.5 p-3',
                    inputWrapper: 'p-0 h-12'
                  }}
                  placeholder="Search workspaces"
                />

                <Button
                  fullWidth
                  color="secondary"
                  startContent={<SlideAdd size={24} />}
                  size="lg"
                  className="flex w-full max-w-max items-center p-4"
                  onPress={() => setIsCreateWorkspaceCardVisible((prev) => !prev)}
                  aria-label="New workspace"
                >
                  New Workspace
                </Button>
              </div>
            )}
            <Spacer y={2} />
            <AnimatePresence>
              {workspaceSelections?.length > 0 && users?.length > 1 && (
                <motion.div
                  key="motion-card"
                  layout="preserve-aspect"
                  className="flex-shrink-0 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex flex-row items-center justify-between rounded-xl bg-ds-button-primary-bg px-3 py-2 text-ds-button-primary-text">
                    <p className="text-sm font-medium">
                      {totalSelectedTeams > 0
                        ? `${workspaceSelections?.length} workspace and ${totalSelectedTeams} team selected`
                        : `${workspaceSelections?.length} workspace selected`}
                    </p>
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      startContent={<Check size={20} />}
                      className="text-sm font-medium "
                      onPress={handleApply}
                      isLoading={isPending}
                      aria-label="Apply"
                    >
                      Apply
                    </Button>
                  </div>
                  <Spacer y={2} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex min-h-0 flex-col">
              <ScrollShadow ref={ref} className="h-full">
                <div className="flex flex-col">
                  <AnimatePresence>
                    {isCreateWorkspaceCardVisible && !hideWorkspaceActions && (
                      <CreateNewWorkspaceCard
                        toggleWorkspaceSelection={toggleWorkspaceSelection}
                        cancel={() => setIsCreateWorkspaceCardVisible(false)}
                      />
                    )}
                  </AnimatePresence>
                  <div className="flex flex-col gap-2">
                    <Accordion
                      showDivider={false}
                      className="flex flex-col gap-2 p-0"
                      itemClasses={{
                        base: 'p-0',
                        trigger: 'w-full p-0',
                        content: 'p-0'
                      }}
                      hideIndicator
                      selectionMode="multiple"
                      selectedKeys={
                        selectiveWorkspaces?.length > 0 ? selectiveWorkspaces : openedWorkspaces
                        // : workspaceSelections?.map((w) => w.id)
                      }
                      onSelectionChange={(keys) => setOpenedWorkspaces(keys as Set<string>)}
                      // onSelectionChange={setOpenedWorkspaces}
                    >
                      {searchFilteredWorkspaces?.map((workspace) => (
                        <AccordionItem
                          key={workspace.id}
                          textValue={workspace.title}
                          aria-label={workspace.title}
                          title={
                            <WorkspaceLabel
                              isOpened={openedWorkspaces.has(workspace.id)}
                              hideActions={hideWorkspaceActions}
                              workspace={workspace}
                              isSelected={workspaceSelections?.some(
                                (selected) => selected.id === workspace.id
                              )}
                              setIsSelected={(value) =>
                                toggleWorkspaceSelection(workspace?.id, value)
                              }
                              setWorkspaceRole={handleChangeWorkspaceRole}
                            />
                          }
                        >
                          {!hideTeamActions && (
                            <div className="flex flex-col">
                              <CreateNewTeamCard
                                workspaceId={workspace.id}
                                toggleTeamSelection={toggleTeamSelection}
                                teamCount={workspace.teams.length}
                              />
                              <div className="flex flex-col-reverse">
                                <TeamsList
                                  workspace={workspace}
                                  selectedWorkspacesWithTeams={workspaceSelections}
                                  handleToggleTeam={toggleTeamSelection}
                                  setTeamRole={(teamId, roleIds) =>
                                    handleChangeTeamRole(teamId, workspace.id, roleIds)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </ScrollShadow>
            </div>
          </div>
        </ModalBody>
        <AnimatePresence>
          {workspaceSelections?.length > 0 && users?.length === 1 && (
            <motion.div
              className="overflow-hidden"
              layout
              initial={{
                opacity: 0,
                height: 0
              }}
              animate={{
                opacity: 1,
                height: 'auto'
              }}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <ModalFooter className="flex items-start justify-end p-8 pt-0">
                <Button
                  size="md"
                  color="primary"
                  onPress={handleApply}
                  isLoading={isPending}
                  aria-label="Assign"
                >
                  Assign to{' '}
                  {totalSelectedTeams > 0
                    ? `${workspaceSelections?.length} workspace${workspaceSelections?.length > 1 ? 's' : ''} and ${totalSelectedTeams} team${totalSelectedTeams > 1 ? 's' : ''} `
                    : `${workspaceSelections?.length} workspace${workspaceSelections?.length > 1 ? 's' : ''}`}
                </Button>
              </ModalFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
