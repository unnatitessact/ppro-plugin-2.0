import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import { useRoles } from '@/context/roles';
import { motion } from 'framer-motion';

import { CrossSmall } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { User } from '@/components/ui/User';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';

import { BulkUsers } from '@/api-integration/types/user-management';

interface UsersListProps {
  list: BulkUsers[];
  setList: Dispatch<SetStateAction<BulkUsers[]>>;
}

const UsersList = ({ list, setList }: UsersListProps) => {
  const handleRoleChange = useCallback(
    (userEmail: string, roleIds: string[]) => {
      setList((prevList) =>
        prevList.map((user) => (user.email === userEmail ? { ...user, role_ids: roleIds } : user))
      );
    },
    [setList]
  );

  return (
    <motion.div
      key="users-list"
      layout="position"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      // exit={{ opacity: 0, height: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
    >
      <div className="grid grid-cols-12">
        <p className="col-span-6 py-3 text-sm font-medium text-default-400">NAME</p>
        <p className="col-span-5 p-3 text-sm font-medium text-default-400">ORGANIZATION ROLE</p>
        <p className="col-span-1"></p>
      </div>
      <ScrollShadow>
        <div className="flex max-h-[350px] w-full flex-col gap-2">
          {list?.map((user) => (
            <UserItem
              onRoleChange={(roleIds: string[]) => handleRoleChange(user.email, roleIds)}
              user={user}
              key={user.email}
              removeUser={(user: BulkUsers) => {
                setList((prevList) => prevList.filter((u) => u.email !== user.email));
              }}
            />
          ))}
        </div>
      </ScrollShadow>
    </motion.div>
  );
};

export default UsersList;

const UserItem = ({
  user,
  onRoleChange,
  removeUser
}: {
  user: BulkUsers;
  onRoleChange: (roleIds: string[]) => void;
  removeUser: (user: BulkUsers) => void;
}) => {
  const { roles: orgRoles } = useRoles('organization');
  const selectedRoles = useMemo(() => new Set(user.role_ids), [user.role_ids]);
  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      onRoleChange(Array.from(newRoles));
    },
    [onRoleChange]
  );

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-6 flex items-center justify-start">
        <User
          name={user?.profile?.display_name || 'No display name'}
          description={user?.email}
          avatarProps={{
            src: undefined,
            alt: user?.profile?.display_name,
            size: 'md'
          }}
        />
      </div>
      <div className="col-span-5 flex items-center justify-start">
        {user?.user_exists ? (
          <div className="mx-3 rounded-xl bg-amber-900 p-3">
            <span className="text-sm font-medium text-amber-600">In Organization</span>
          </div>
        ) : (
          <div className="mx-3">
            <RoleChipDropdownWithDefault
              roles={orgRoles ?? []}
              selectedRoles={selectedRoles}
              setSelectedRoles={setSelectedRoles}
            />
          </div>
        )}
      </div>
      <div className="col-span-1 flex items-center justify-end [&>span]:cursor-pointer">
        <Button
          size="sm"
          radius="sm"
          onPress={() => {
            removeUser(user);
          }}
          isIconOnly
          aria-label="Remove user"
        >
          <CrossSmall size={20} />
        </Button>
      </div>
    </div>
  );
};
