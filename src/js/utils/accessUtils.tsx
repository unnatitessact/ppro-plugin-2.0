export const PERMISSIONS = {
  ORGANIZATION: {
    CAN_CREATE_EDIT_DELETE_WORKSPACES: 'can_create_edit_and_delete_workspaces',
    CAN_CREATE_EDIT_DELETE_TEAMS: 'can_create_edit_and_delete_teams',
    CAN_CREATE_EDIT_DELETE_USERS: 'can_create_edit_and_delete_users',
    CAN_RESET_PASSWORD_FOR_USERS: 'can_reset_passwords_for_users',
    CAN_CREATE_EDIT_DELETE_ROLES: 'can_create_edit_and_delete_roles',
    CAN_MANAGE_SECURITY_GROUPS_PERMISSIONS_TO_CONTENT_ACROSS_WORKSPACES:
      'can_manage_security_group_permissions_to_content_across_workspaces',
    CAN_CREATE_EDIT_DELETE_SECURITY_GROUPS: 'can_create_edit_and_delete_security_groups'
  },
  WORKSPACE: {
    CAN_CREATE_EDIT_DELETE_TEAMS: 'can_create_edit_and_delete_teams',
    CAN_ADD_REMOVE_USERS_FROM_WORKSPACE: 'can_add_and_remove_users_from_workspace',
    CAN_MANAGE_SECURITY_GROUP_PERMISSIONS_TO_CONTENT_IN_WORKSPACE:
      'can_manage_security_group_permissions_to_content_in_workspace',
    CAN_DOWNLOAD_ASSETS: 'can_download_assets'
  },
  TEAM: {}
};

type PermissionType = typeof PERMISSIONS;

export const checkPermission = (
  permission:
    | PermissionType['ORGANIZATION'][keyof PermissionType['ORGANIZATION']]
    | PermissionType['WORKSPACE'][keyof PermissionType['WORKSPACE']]
    | PermissionType['TEAM'][keyof PermissionType['TEAM']],
  userPermissions: string[]
) => {
  return userPermissions?.includes(permission);
};

export const checkIsRolesChanged = (prevRoles: string[], currentRoles: string[]) => {
  return prevRoles.toSorted().join(',') !== currentRoles.toSorted().join(',');
};

export const checkIfHasAnyOrgPermission = (permissions: string[]) => {
  return Object.values(PERMISSIONS.ORGANIZATION).some((permission) =>
    permissions.includes(permission)
  );
};
