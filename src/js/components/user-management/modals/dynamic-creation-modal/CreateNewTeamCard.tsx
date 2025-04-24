import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@nextui-org/react';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Check, CirclePlus } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { TeamIcon } from '@/components/user-management/TeamIcon';

import { useCreateTeam } from '@/api-integration/mutations/user-management';

import { CreateNewTeamCardSchema } from '@/schemas/user-management';

export const motionVariants: HTMLMotionProps<'div'> = {
  layout: 'preserve-aspect',
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { ease: 'easeInOut', duration: 0.2 }
};

export const CreateNewTeamCard = ({
  workspaceId,
  toggleTeamSelection,
  teamCount
}: {
  workspaceId: string;
  toggleTeamSelection: (teamId: string, id: string, isSelected: boolean) => void;
  teamCount: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<z.infer<typeof CreateNewTeamCardSchema>>({
    resolver: zodResolver(CreateNewTeamCardSchema)
  });
  const { mutateAsync: createTeam } = useCreateTeam(workspaceId);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { data: createdTeam } = await createTeam(
          {
            workspace: workspaceId,
            title: data.teamName
          },
          {
            onSuccess: () => {
              setIsEditing(false);
              reset();
            }
          }
        );
        toggleTeamSelection(createdTeam.id, workspaceId, true);
      })}
      className={cn(
        'flex w-full flex-1 flex-row items-center justify-between border border-t-0 border-dashed border-ds-table-row-border px-3 py-1',
        teamCount === 0 && 'rounded-b-xl'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-2 py-2">
          <AnimatePresence>
            {isEditing ? (
              <motion.div {...motionVariants}>
                <Input
                  autoFocus
                  size="md"
                  placeholder="Enter team name"
                  startContent={
                    <TeamIcon
                      size="sm"
                      name={watch('teamName')?.charAt(0) ?? ''}
                      colorVariant="subtle"
                    />
                  }
                  {...register('teamName')}
                  isInvalid={!!errors.teamName}
                />
              </motion.div>
            ) : (
              <motion.div {...motionVariants}>
                <Button
                  className="bg-ds-button-secondary-bg"
                  size="md"
                  startContent={<CirclePlus size={20} />}
                  onPress={() => setIsEditing(true)}
                  aria-label="Create team"
                >
                  Create Team
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isEditing ? (
          <motion.div className="flex items-center gap-1" {...motionVariants}>
            <Button size="sm" onPress={() => setIsEditing(false)} aria-label="Cancel">
              Cancel
            </Button>
            <Button
              size="sm"
              color="primary"
              startContent={<Check size={16} />}
              type="submit"
              aria-label="Create"
            >
              Create
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
};
