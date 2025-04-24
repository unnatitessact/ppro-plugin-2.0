import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

import { usePermissions } from '@/context/permissions';
import { useRoles } from '@/context/roles';
import { cn, Image } from '@nextui-org/react';
import { UserCheck2Icon, UserX2Icon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FloppyDisk1, Lock, PencilWave, PeopleAdd } from '@tessact/icons';

import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import ImageCropperModal from '@/components/ImageCropperModal';
import NotificationPreferences from '@/components/preferences/NotificationPreferences';
import { UserSecurityGroup } from '@/components/user-management/modals/user-profile/UserSecurityGroup';
import { UserTeam } from '@/components/user-management/modals/user-profile/UserTeam';
import { UserWorkspace } from '@/components/user-management/modals/user-profile/UserWorkspace';
import RoleChipDropdown from '@/components/user-management/RoleChipDropdown';
import { TabLabel } from '@/components/user-management/sidebar/Tabs';

import { useOrganization } from '@/hooks/useOrganization';

import {
  useDeactivateUserToggle,
  useUpdateOrganizationUserRoles,
  useUpdateUserProfile
} from '@/api-integration/mutations/user-management';
import { useUserSecurityGroupListQuery } from '@/api-integration/queries/security-groups';
import {
  useUserTeamListQuery,
  useUserWorkspaceListQuery
} from '@/api-integration/queries/user-management';
import { UserWithRoles } from '@/api-integration/types/user-management';

import { EditUserSchema } from '@/schemas/user-management';

import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

import { forgotPassword } from '@/actions/auth/forgot-password';

interface UserDetailsProps {
  form: UseFormReturn<z.infer<typeof EditUserSchema>>;
  user: UserWithRoles;
  onOpenChange: () => void;
}

const UserDetails = ({ form, user, onOpenChange }: UserDetailsProps) => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const {
    id: userId,
    profile: {
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      profile_picture: profilePicture
    },
    roles,
    email
  } = user;

  const {
    register,
    formState: { errors },
    handleSubmit
  } = form;

  const { mutate } = useUpdateOrganizationUserRoles();
  const { roles: orgRoles } = useRoles('organization');
  const selectedOrgRoles = useMemo(() => new Set(roles.map((role) => role.id)), [roles]);
  const setSelectedOrgRoles = useCallback(
    (newRoles: Set<string>) => {
      mutate([
        {
          user_id: userId as string,
          role_ids: Array.from(newRoles)
        }
      ]);
    },
    [mutate, userId]
  );

  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [isImageCroppingModalOpen, setIsImageCroppingModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { mutate: updateUserProfile, isPending: isUpdateUserProfilePending } = useUpdateUserProfile(
    userId as string
  );

  const imageButtonRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
      setIsImageCroppingModalOpen(true);
      event.target.value = '';
    }
  };

  const organization = useOrganization();

  const { data: teamList } = useUserTeamListQuery(user?.id as string, organization?.id as string);

  const { data: workspaceList } = useUserWorkspaceListQuery(
    user?.id as string,
    organization?.id as string
  );

  const { data: securityGroupList } = useUserSecurityGroupListQuery(
    user?.id as string,
    organization?.id as string
  );

  const { mutate: deactivateUser, isPending: isDeactivatingUser } = useDeactivateUserToggle();

  const { organizationPermissions } = usePermissions();

  const croppedImageURL = useMemo(
    () => (croppedImage ? URL.createObjectURL(croppedImage) : ''),
    [croppedImage]
  );

  const canEditUser = checkPermission(
    PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_USERS,
    organizationPermissions || []
  );

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit((values) => {
        canEditUser &&
          updateUserProfile({
            first_name: values.firstName,
            last_name: values.lastName,
            display_name: values.displayName,
            profile_picture: croppedImage
          });
        onOpenChange();
      })}
    >
      <ModalHeader className="px-6">
        <span className="text-lg font-medium text-default-900">User details</span>
      </ModalHeader>
      <ModalBody>
        <div className="flex max-h-[60vh] flex-col">
          <ScrollShadow>
            <div className="flex flex-col gap-8 px-6">
              <>
                <div className="rel ative flex w-full items-center gap-16">
                  <input
                    disabled={!canEditUser}
                    hidden
                    type="file"
                    ref={imageButtonRef}
                    onChange={onSelectFile}
                    accept="image/*"
                  />
                  <div
                    onClick={() => {
                      canEditUser && imageButtonRef.current?.click();
                    }}
                    className={cn(
                      'group relative flex h-[100px] w-[100px] shrink-0  items-center justify-center rounded-full bg-default-300',
                      !croppedImage && 'border border-dashed border-default-500',
                      canEditUser && 'cursor-pointer'
                    )}
                  >
                    {!profilePicture && !croppedImage && <PeopleAdd size={44} />}
                    {(profilePicture || croppedImage) && (
                      <>
                        <Image
                          src={(croppedImageURL || profilePicture) ?? ''}
                          alt="Picture"
                          width={100}
                          height={100}
                          className={cn(
                            'h-[100px] w-[100px] rounded-full bg-default-300 transition-opacity ',
                            canEditUser && 'group-hover:opacity-60'
                          )}
                        />
                        <div
                          className={cn(
                            'pointer-events-none absolute left-1/2 top-1/2 z-10 text-default-900 opacity-0 transition-opacity -translate-x-1/2 -translate-y-1/2',
                            canEditUser && 'group-hover:opacity-60'
                          )}
                        >
                          <PencilWave size={30} />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {checkPermission(
                      PERMISSIONS.ORGANIZATION.CAN_RESET_PASSWORD_FOR_USERS,
                      organizationPermissions || []
                    ) && (
                      <Button
                        isDisabled={isResettingPassword}
                        isLoading={isResettingPassword}
                        color="secondary"
                        startContent={<Lock size={20} />}
                        aria-label="Reset password"
                        onPress={async () => {
                          setIsResettingPassword(true);
                          try {
                            await forgotPassword({ email });
                            toast.success('Password reset link sent to the user email');
                          } catch (error) {
                            toast.error('Unable to send password reset link');
                          } finally {
                            setIsResettingPassword(false);
                          }
                        }}
                      >
                        Reset Password
                      </Button>
                    )}
                    {checkPermission(
                      PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_USERS,
                      organizationPermissions || []
                    ) && (
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={
                          user.is_active ? <UserX2Icon size={20} /> : <UserCheck2Icon size={20} />
                        }
                        aria-label="Deactivate user"
                        className="text-danger"
                        onPress={() => {
                          deactivateUser({
                            userId: userId as string,
                            isActive: !user.is_active
                          });
                        }}
                        isDisabled={isDeactivatingUser}
                        isLoading={isDeactivatingUser}
                      >
                        {user.is_active ? 'Deactivate User' : 'Activate User'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    {...register('firstName')}
                    label="Fist Name"
                    labelPlacement="outside"
                    placeholder="First Name"
                    classNames={{
                      label: 'text-default-900 capitalize font-medium'
                    }}
                    defaultValue={firstName}
                    autoComplete="false"
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                    isDisabled={!canEditUser}
                  />
                  <Input
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="Last Name"
                    classNames={{
                      label: 'text-default-900 capitalize font-medium'
                    }}
                    defaultValue={lastName}
                    autoComplete="false"
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                    isDisabled={!canEditUser}
                  />
                  <Input
                    {...register('displayName')}
                    label="Display Name"
                    placeholder="Display Name"
                    classNames={{
                      label: 'text-default-900 capitalize font-medium'
                    }}
                    defaultValue={displayName}
                    autoComplete="false"
                    isInvalid={!!errors.displayName}
                    errorMessage={errors.displayName?.message}
                    isDisabled={!canEditUser}
                  />
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Email"
                    classNames={{
                      label: 'text-default-900 capitalize font-medium'
                    }}
                    defaultValue={email}
                    autoComplete="false"
                    disabled
                    isDisabled
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-medium font-medium text-default-900">
                      Organization Role
                    </span>

                    <RoleChipDropdown
                      roles={orgRoles ?? []}
                      selectedRoles={selectedOrgRoles}
                      setSelectedRoles={setSelectedOrgRoles}
                      readOnly={!canEditUser}
                    />
                  </div>
                </div>
                {canEditUser && (
                  <ImageCropperModal
                    isOpen={isImageCroppingModalOpen}
                    onClose={() => setIsImageCroppingModalOpen(false)}
                    title="Crop your profile picture"
                    inputImage={profileImage || ''}
                    setCroppedImage={(image) => {
                      setCroppedImage(image);
                      setIsImageCroppingModalOpen(false);
                    }}
                    shape="rect"
                  />
                )}
              </>
              {securityGroupList && securityGroupList?.length > 0 && (
                <Accordion
                  selectionMode="multiple"
                  isCompact
                  defaultSelectedKeys="all"
                  className="flex flex-col gap-5 p-0"
                  showDivider={false}
                  itemClasses={{
                    base: 'p-0 ',
                    title: 'text-xs font-medium text-default-500 uppercase',
                    trigger: 'pb-3 flex flex-row-reverse',
                    indicator: 'rotate-180 data-[open=true]:rotate-[270deg] text-default-500'
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="security-groups"
                    title={<TabLabel>Security groups</TabLabel>}
                  >
                    <UserSecurityGroup
                      userId={user.id}
                      securityGroupList={securityGroupList}
                      hasAccess={checkPermission(
                        PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_SECURITY_GROUPS,
                        organizationPermissions || []
                      )}
                    />
                  </AccordionItem>
                </Accordion>
              )}

              {workspaceList && workspaceList?.length > 0 && (
                <Accordion
                  selectionMode="multiple"
                  isCompact
                  defaultSelectedKeys="all"
                  className="flex flex-col gap-5 p-0"
                  showDivider={false}
                  itemClasses={{
                    base: 'p-0 ',
                    title: 'text-xs font-medium text-default-500 uppercase',
                    trigger: 'pb-3 flex flex-row-reverse',
                    indicator: 'rotate-180 data-[open=true]:rotate-[270deg] text-default-500'
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="security-groups"
                    title={<TabLabel>Workspace details</TabLabel>}
                  >
                    <UserWorkspace
                      userId={user.id}
                      workspaceList={workspaceList}
                      hasAccess={checkPermission(
                        PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_WORKSPACES,
                        organizationPermissions || []
                      )}
                    />
                  </AccordionItem>
                </Accordion>
              )}

              {teamList && teamList?.length > 0 && (
                <Accordion
                  selectionMode="multiple"
                  isCompact
                  defaultSelectedKeys="all"
                  className="flex flex-col gap-5 p-0"
                  showDivider={false}
                  itemClasses={{
                    base: 'p-0 ',
                    title: 'text-xs font-medium text-default-500 uppercase',
                    trigger: 'pb-3 flex flex-row-reverse',
                    indicator: 'rotate-180 data-[open=true]:rotate-[270deg] text-default-500'
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="security-groups"
                    title={<TabLabel>Team details</TabLabel>}
                  >
                    <UserTeam
                      userId={userId}
                      teamList={teamList}
                      hasAccess={checkPermission(
                        PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_TEAMS,
                        organizationPermissions || []
                      )}
                    />
                  </AccordionItem>
                </Accordion>
              )}
              {canEditUser && (
                <Accordion
                  selectionMode="multiple"
                  isCompact
                  defaultSelectedKeys="all"
                  className="flex flex-col gap-5 p-0"
                  showDivider={false}
                  itemClasses={{
                    base: 'p-0 ',
                    title: 'text-xs font-medium text-default-500 uppercase',
                    trigger: 'pb-3 flex flex-row-reverse',
                    indicator: 'rotate-180 data-[open=true]:rotate-[270deg] text-default-500'
                  }}
                >
                  <AccordionItem
                    key="1"
                    aria-label="notification"
                    title={<TabLabel>Notification</TabLabel>}
                  >
                    <NotificationPreferences userId={user?.id} isUserProfile={true} />
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </ScrollShadow>
        </div>
      </ModalBody>
      <ModalFooter className="mt-0 px-6">
        <Button
          size="md"
          color="primary"
          radius="sm"
          type="submit"
          startContent={<FloppyDisk1 size={24} />}
          isLoading={isUpdateUserProfilePending}
          aria-label="Save"
        >
          Save
        </Button>
      </ModalFooter>
    </form>
  );
};

export default UserDetails;
