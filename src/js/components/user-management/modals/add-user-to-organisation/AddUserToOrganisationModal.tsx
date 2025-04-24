import { useEffect, useState } from 'react';

import { usePermissions } from '@/context/permissions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Modal, ModalContent } from '@/components/ui/Modal';

import { AddNewUser } from '@/components/user-management/modals/add-user-to-organisation/AddNewUser';
import { DynamicCreationModal } from '@/components/user-management/modals/dynamic-creation-modal/DynamicCreationModal';

import { useOrganization } from '@/hooks/useOrganization';

import { useCheckUser } from '@/api-integration/mutations/auth';
import { useAddNewUser } from '@/api-integration/mutations/user-management';
import { organizationUsersQueryKey } from '@/api-integration/queries/user-management';

import { AddUserToOrganisationSchema } from '@/schemas/user-management';

import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

type Inputs = z.infer<typeof AddUserToOrganisationSchema>;

enum ModalStep {
  UserDetails = 0,
  DynamicCreation = 1
}

interface AddUserToOrganisationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AddUserToOrganisationModal = ({
  isOpen,
  setIsOpen
}: AddUserToOrganisationModalProps) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.UserDetails);
  const {
    setValue,
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setError,
    reset
  } = useForm<Inputs>({
    resolver: zodResolver(AddUserToOrganisationSchema)
  });

  const { mutateAsync: addUser, isPending: addUserPending } = useAddNewUser();
  const { mutateAsync: checkUser } = useCheckUser();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [isAutoCompletingDisplayName, setIsAutoCompletingDisplayName] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(ModalStep.UserDetails);
      setCreatedUserId(null);
      reset();
    }
  }, [isOpen, setCurrentStep, reset, setCreatedUserId]);

  const { email, displayName } = getValues();
  const firstName = watch('firstName') ?? '';
  const lastName = watch('lastName') ?? '';

  useEffect(() => {
    const displayName = firstName.concat(' ', lastName).trim();
    if (isAutoCompletingDisplayName && displayName) {
      setValue('displayName', displayName);
    }
  }, [firstName, lastName, isAutoCompletingDisplayName, setValue]);

  const onSubmit = handleSubmit(
    async ({ email, password, organizationRoles, firstName, lastName, displayName }) => {
      await checkUser(email, {
        onSuccess: (exists) => {
          if (exists) {
            setError('email', { message: 'Email already exists!' });
          } else {
            addUser(
              {
                user_data: {
                  email,
                  password,
                  profile: {
                    first_name: firstName,
                    last_name: lastName ?? '',
                    display_name: displayName
                  }
                },
                role_ids: organizationRoles.split(',')
              },
              {
                onSuccess: ({ data }) => {
                  setCreatedUserId(data?.id);
                  setCurrentStep(ModalStep.DynamicCreation);
                }
              }
            );
          }
        }
      });
    }
  );

  const { organizationPermissions } = usePermissions();

  return (
    <Modal
      size={currentStep === ModalStep.UserDetails ? 'sm' : 'md'}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => setCurrentStep(ModalStep.UserDetails)}
    >
      <ModalContent className="flex flex-col p-8">
        {currentStep === ModalStep.UserDetails && (
          <AddNewUser
            isLoading={addUserPending}
            register={register}
            errors={errors}
            control={control}
            next={onSubmit}
            setIsAutoCompletingDisplayName={setIsAutoCompletingDisplayName}
          />
        )}
        {currentStep === ModalStep.DynamicCreation && !!createdUserId && (
          <DynamicCreationModal
            hideTeamActions={
              !checkPermission(
                PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_TEAMS,
                organizationPermissions ?? []
              )
            }
            onSuccessfulCreation={() => {
              setIsOpen(false);
              queryClient.invalidateQueries({
                queryKey: organizationUsersQueryKey(organization?.id)
              });
            }}
            users={[
              {
                id: createdUserId ?? '',
                email,
                profile: {
                  first_name: firstName,
                  last_name: lastName,
                  display_name: displayName
                }
              }
            ]}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
