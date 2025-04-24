import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal, ModalContent } from '@/components/ui/Modal';

import CreateRoleDetails from '@/components/user-management/modals/create-role/CreateRoleDetails';
import CreateRolePermissions from '@/components/user-management/modals/create-role/CreateRolePermissions';

import { Role } from '@/api-integration/types/user-management';

import { RolesModalSchema } from '@/schemas/user-management';

interface CreateRoleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: 'organization' | 'workspace' | 'team';
  editRoleDetails?: Role;
  step: number;
  setStep: (step: number) => void;
  modalType: 'Create' | 'Edit';
}

const CreateRoleModal = ({
  isOpen,
  setIsOpen,
  type,
  editRoleDetails,
  step,
  setStep,
  modalType
}: CreateRoleModalProps) => {
  const form = useForm<z.infer<typeof RolesModalSchema>>({
    resolver: zodResolver(RolesModalSchema),
    defaultValues: {
      roleName: editRoleDetails?.title || '',
      description: editRoleDetails?.description || ''
    }
  });
  const reset = form.reset;

  useEffect(() => {
    if (isOpen) {
      reset({
        roleName: editRoleDetails?.title || '',
        description: editRoleDetails?.description || ''
      });
    } else {
      reset();
    }
  }, [editRoleDetails, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="sm">
      <ModalContent className="flex min-h-[512px] flex-col gap-8 p-8">
        {step === 1 && (
          <CreateRoleDetails
            type={type}
            step={step}
            setStep={setStep}
            form={form}
            name={editRoleDetails?.title}
            description={editRoleDetails?.description}
            modalType={modalType}
          />
        )}
        {step === 2 && (
          <CreateRolePermissions
            step={step}
            setStep={setStep}
            type={type}
            roleName={form.getValues().roleName}
            description={form.getValues().description || ''}
            setIsOpen={setIsOpen}
            editRoleDetails={editRoleDetails}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateRoleModal;
