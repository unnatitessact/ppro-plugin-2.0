import { Dispatch, Key, SetStateAction } from 'react';

import { cn } from '@nextui-org/react';

import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { User } from '@/components/ui/User';

import { User as IUser } from '@/api-integration/types/auth';

interface UsersListProps {
  selected: Key;
  setSelected: Dispatch<SetStateAction<Key>>;
  users: IUser[];
}

export const UsersList = ({ selected, setSelected, users }: UsersListProps) => {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium text-default-500">{`${users.length} user${users.length > 1 ? 's' : ''} selected`}</p>
      <ScrollShadow>
        <Listbox
          onAction={setSelected}
          classNames={{
            base: 'p-0 bg-transparent',
            list: 'w-full flex flex-col gap-2'
          }}
        >
          {users.map((user) => (
            <ListboxItem
              textValue={user.profile.display_name}
              key={user.id}
              aria-label={user.profile.display_name}
              classNames={{
                base: cn('p-0 w-full', user.id === selected && 'bg-default-100'),
                wrapper: 'p-0'
              }}
            >
              <User
                name={
                  user.profile.display_name ??
                  user.profile.first_name?.concat(' ', user.profile.last_name ?? '') ??
                  'Unknown User'
                }
                description={user.email}
                classNames={{
                  base: 'py-2 px-3 flex gap-2 w-full justify-start items-center',
                  name: 'text-base font-medium text-default-900',
                  description: 'text-default-500 text-sm font-normal'
                }}
                avatarProps={{
                  src: user.profile?.profile_picture || undefined,
                  size: 'sm',
                  radius: 'full'
                }}
              />
            </ListboxItem>
          ))}
        </Listbox>
      </ScrollShadow>
    </div>
  );
};
