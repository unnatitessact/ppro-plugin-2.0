'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal, ModalContent } from '@/components/ui/Modal';

import UserDetails from '@/components/user-management/modals/user-profile/UserDetails';

import { UserWithRoles } from '@/api-integration/types/user-management';

import { EditUserSchema } from '@/schemas/user-management';

interface UserProfileModalProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
  onOpenChange: () => void;
  user: UserWithRoles | null;
}

const UserProfileModal = ({ isOpen, onOpenChange, user }: UserProfileModalProps) => {
  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      firstName: user?.profile.first_name || '',
      lastName: user?.profile.last_name || '',
      displayName: user?.profile.display_name || ''
    }
  });
  useEffect(() => {
    form.reset({
      firstName: user?.profile.first_name || '',
      lastName: user?.profile.last_name || '',
      displayName: user?.profile.display_name || ''
    });
  }, [form, user?.profile.first_name, user?.profile.last_name, user?.profile.display_name]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange} isKeyboardDismissDisabled={true} className='px-0'>
      <ModalContent>
        <UserDetails form={form} user={user as UserWithRoles} onOpenChange={onOpenChange} />
      </ModalContent>
    </Modal>
  );
};

export default UserProfileModal;
