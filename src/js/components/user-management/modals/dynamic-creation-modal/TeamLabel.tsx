import { useCallback, useState } from 'react';

import { useRoles } from '@/context/roles';
import { motion } from 'framer-motion';

import { Checkbox } from '@/components/ui/Checkbox';
import { Chip } from '@/components/ui/Chip';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';
import { TeamIcon } from '@/components/user-management/TeamIcon';

import { motionVariants } from './CreateNewTeamCard';

interface TeamLabelProps {
  teamName: string;
  isSelected: boolean;
  setSelected: (value: boolean) => void;
  setTeamRole: (roleIds: string[]) => void;
  color?: string;
}

export const TeamLabel = ({
  teamName,
  isSelected,
  setSelected,
  setTeamRole,
  color
}: TeamLabelProps) => {
  const { roles: teamRoles } = useRoles('team');
  const defaultRole = teamRoles?.find((role) => role.is_default) ?? teamRoles[0];
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set([defaultRole.id]));
  const updateRoles = useCallback(
    (newRoles: Set<string>) => {
      setSelectedRoles(newRoles);
      setTeamRole(Array.from(newRoles));
    },
    [setTeamRole]
  );
  return (
    <motion.div
      className="flex w-full flex-1 flex-row items-center justify-between px-3 py-1"
      {...motionVariants}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          radius="sm"
          height={20}
          width={20}
          isSelected={isSelected}
          onValueChange={setSelected}
          className="flex items-center"
        >
          <div className="flex px-3 py-2">
            <Chip
              startContent={
                <TeamIcon size="sm" name={teamName} color={color} colorVariant="subtle" />
              }
              size="lg"
              classNames={{
                base: 'bg-ds-table-pills-bg rounded-xl py-2 pl-2 pr-3 flex items-center gap-2',
                content: 'flex p-0 text-sm font-medium'
              }}
            >
              {teamName}
            </Chip>
          </div>
        </Checkbox>
        {isSelected && (
          <RoleChipDropdownWithDefault
            roles={teamRoles ?? []}
            selectedRoles={selectedRoles}
            setSelectedRoles={updateRoles}
          />
        )}
      </div>
    </motion.div>
  );
};
