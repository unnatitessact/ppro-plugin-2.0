import { Dispatch, SetStateAction } from 'react';

import { useRoles } from '@/context/roles';
import { SelectedItems } from '@nextui-org/react';
// import { Select, SelectItem } from '@/components/ui/Select';
import { Select, SelectItem } from '@nextui-org/select';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { z } from 'zod';

import { ArrowRight } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { RoleChip } from '@/components/user-management/RoleChip';
import { RoleSelectionDropdownItemContent } from '@/components/user-management/RoleSelectionDropdown';

import { Role } from '@/api-integration/types/user-management';

import { AddUserToOrganisationSchema } from '@/schemas/user-management';

type Inputs = z.infer<typeof AddUserToOrganisationSchema>;

interface AddNewUserProps {
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  control: Control<Inputs>;
  next: () => Promise<void>;
  isLoading: boolean;
  setIsAutoCompletingDisplayName: Dispatch<SetStateAction<boolean>>;
}

export const AddNewUser = ({
  register,
  errors,
  next,
  control,
  isLoading,
  setIsAutoCompletingDisplayName
}: AddNewUserProps) => {
  const { roles: organizationRoles } = useRoles('organization');
  return (
    <>
      <ModalHeader className="mb-1 flex items-center gap-2 p-0 text-2xl font-bold">
        Invite user
      </ModalHeader>
      <ModalBody className="flex max-h-[60vh] flex-col gap-6 overflow-hidden p-0">
        {!!errors.root && <p className="text-sm font-medium text-danger">{errors.root?.message}</p>}
        <ScrollShadow>
          <div className="flex flex-col gap-6 py-9">
            <Input
              label="Email"
              placeholder="Enter user’s company email"
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              isRequired
              autoComplete="username"
              onValueChange={() => {}}
            />
            <div className="flex gap-6">
              <Input
                label="First name"
                placeholder="User’s first name"
                {...register('firstName')}
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName?.message}
                isRequired
              />
              <Input
                label="Last name"
                placeholder="User’s last name"
                {...register('lastName')}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />
            </div>
            <Controller
              name={'displayName'}
              defaultValue={''}
              control={control}
              render={({ field }) => (
                <Input
                  label="Display name"
                  placeholder="Enter user’s display name"
                  name={field.name}
                  value={field.value}
                  ref={field.ref}
                  onChange={(e) => {
                    setIsAutoCompletingDisplayName(false);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.displayName}
                  errorMessage={errors.displayName?.message}
                  isRequired
                />
              )}
            />

            <PasswordInput
              label="Password"
              placeholder="******"
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isRequired
              autoComplete="new-password"
            />
            <div className="flex flex-col">
              <Controller
                name={'organizationRoles'}
                defaultValue={''}
                control={control}
                render={({ field }) => (
                  <Select
                    size="lg"
                    items={organizationRoles}
                    label="Organization roles"
                    placeholder="Select a role"
                    name={field.name}
                    value={field.value}
                    disabled={field.disabled}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    renderValue={renderValue}
                    isInvalid={!!errors.organizationRoles}
                    errorMessage={errors.organizationRoles?.message}
                    labelPlacement="outside"
                    classNames={{
                      popoverContent: 'bg-ds-menu-bg border-ds-menu-border border-1 p-0'
                    }}
                    listboxProps={{
                      classNames: {
                        base: 'px-2 py-3'
                      },
                      itemClasses: {
                        base: 'bg-ds-menu-bg data-[hover=true]:bg-ds-menu-bg-hover text-ds-menu-text-primary',
                        description: 'text-ds-menu-text-secondary'
                      }
                    }}
                  >
                    {(role) => (
                      <SelectItem
                        aria-label={role.title}
                        key={role.id}
                        textValue={role.title}
                        variant="light"
                        className="data-[hover=true]:text-default-900 data-[selectable=true]:focus:text-default-900"
                        hideSelectedIcon
                      >
                        <RoleSelectionDropdownItemContent
                          title={role.title}
                          color={role.color}
                          hideCheckbox
                        />
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            </div>
          </div>
        </ScrollShadow>
      </ModalBody>
      <ModalFooter className="flex w-full items-center justify-end gap-3 p-0">
        <Button
          color="primary"
          isLoading={isLoading}
          onPress={next}
          endContent={<ArrowRight size={20} />}
          aria-label="Invite user"
        >
          Setup Workspaces
        </Button>
      </ModalFooter>
    </>
  );
};

const renderValue = (items: SelectedItems<Role>) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        item.data ? (
          <RoleChip key={item.key} label={item.data?.title} color={item.data.color} />
        ) : null
      )}
    </div>
  );
};
