export type GlobalCommandKey =
  | 'quick_search'
  | 'search_for_clips'
  | 'search_for_metadata'
  | 'ask_ai'
  | 'ai_search_for_clips'
  | 'navigate';

export type ProjectCommandKey = 'create_project' | 'view_projects_or_tasks' | 'project_view';

export type ProjectPageCommandKey =
  | 'add_new_member'
  | 'add_new_task'
  | 'change_status_project'
  | 'upload_file_in_project'
  | 'change_due_date'
  | 'upload'
  | 'create_new_folder'
  | 'create_new_connected_folder'
  | 'project_library_flatten_folder'
  | 'project_library_view'
  // | 'delete_assets'
  // | 'copy_assets'
  // | 'paste_assets'
  // | 'cut_assets'
  | 'project_library_thumbnail';

export type FilteredCommandKey =
  | 'filtered_quick_search'
  | 'filtered_ask_ai'
  | 'filtered_search_for_clips'
  | 'filtered_ai_search_for_clips';

export type HiddenCommandKey =
  | 'bug_report'
  | 'navigate_to_project'
  | 'navigate_to_user_management'
  | 'navigate_to_library'
  | 'appearance'
  | 'light_mode'
  | 'dark_mode'
  | 'navigate_to_settings'
  | 'navigate_to_views'
  | 'navigate_to_remixes'
  | 'navigate_to_workspace_teams'
  | 'navigate_to_workspace_members'
  | 'navigate_to_workspace_connections'
  | 'navigate_to_workspace_workflows'
  | 'navigate_to_workspace_metadata_templates'
  | 'navigate_to_preferences'
  | 'faster_search';

export type UserManagementCommandKey =
  | 'navigate'
  | 'go_back'
  | 'add_user'
  | 'create_workspace'
  | 'add_to_workspace'
  | 'add_to_security_groups'
  | 'add_to_team'
  | 'create_new_team'
  | 'invite_user'
  | 'download_csv'
  | 'create_security_group'
  | 'bug_report'
  | 'hidden';

export type LibraryCommandKey =
  | 'upload'
  | 'create_new_folder'
  | 'create_new_connected_folder'
  | 'flatten_folder'
  | 'view'
  | 'delete_assets'
  | 'copy_assets'
  | 'paste_assets'
  | 'cut_assets'
  | 'fit_fill_thumbnail'
  | 'aspect_ratio';

export type ReviewCommandKey =
  | 'add_comment'
  | 'export_comments'
  | 'change_status_of_file'
  | 'metadata_for_file'
  | 'comments_for_file'
  | 'add_in_time'
  | 'add_marker';

export type CommandKey =
  | GlobalCommandKey
  | HiddenCommandKey
  | FilteredCommandKey
  | LibraryCommandKey
  | ReviewCommandKey
  | UserManagementCommandKey
  | ProjectCommandKey
  | ProjectPageCommandKey;

export type Command = {
  label: string;
  description?: string;
  kbd: string[];
  key: CommandKey;
  placeholder?: string;
  keywords?: string[];
  commandType:
    | 'global'
    | 'filter'
    | 'hidden'
    | 'library'
    | 'project'
    | 'project_page'
    | 'review'
    | 'user_management'
    | 'faster_search';
  hasRightSection?: boolean;
  needsSelectedItems?: boolean;
  id?: string;
  joinKbdWithThen?: boolean;
  isToggleable?: boolean;
  file_extension?: string;
  project?: string;
};

// export const globalSearchCommands: Command[] = [
//   {
//     label: 'Quick Search',
//     description: 'Find files, folders and metadata instantly',
//     kbd: ['mod', 'F'],
//     key: 'quick_search',
//     placeholder: 'Search for files, metadata & folders',
//     commandType: 'global'
//   },
//   {
//     label: 'Search for Clips',
//     description: 'AI creates smart cuts from all your files',
//     kbd: ['mod', 'shift', 'F'],
//     key: 'search_for_clips',
//     placeholder: 'Search for scenes, clips and cuts across your files',
//     commandType: 'global'
//   },
//   {
//     label: 'Navigate',
//     description: 'Go anywhere in the product',
//     kbd: ['V'],
//     key: 'navigate',
//     commandType: 'global'
//   }

//   // {
//   //   label: 'Search for Metadata',
//   //   description: 'AI finds relevant metadata across all your files and folders',
//   //   kbd: ['mod', 'shift', 'M'],
//   //   key: 'search_for_metadata',
//   //   placeholder: 'Search for metadata across all your files and folders',
//   //   commandType: 'global'
//   // },
//   // {
//   //   label: 'Ask AI',
//   //   description: 'Anything about your workspace, projects or files',
//   //   kbd: ['mod', 'shift', 'A'],
//   //   key: 'ask_ai',
//   //   placeholder: 'Ask anything about your workspace, projects or files',
//   //   commandType: 'global'
//   // }
// ];

// export const filteredGlobalSearchCommands: Command[] = [
//   {
//     label: 'Quick Search',
//     description: 'Find files, folders and metadata instantly',
//     kbd: ['mod', 'F'],
//     key: 'filtered_quick_search',
//     placeholder: 'Search for files, metadata & folders',
//     commandType: 'filter'
//   },
//   {
//     label: 'Search for Clips',
//     description: 'AI creates smart cuts from all your files',
//     kbd: ['mod', 'shift', 'F'],
//     key: 'filtered_search_for_clips',
//     placeholder: 'Search for scenes, clips and cuts across your files',
//     commandType: 'filter'
//   }

//   // {
//   //   label: 'Ask AI',
//   //   description: 'Anything about your workspace, projects or files',
//   //   kbd: ['mod', 'shift', 'A'],
//   //   key: 'filtered_ask_ai',
//   //   placeholder: 'Ask anything about your workspace, projects or files',
//   //   commandType: 'filter'
//   // }
// ];

// export const hiddenCommands: Command[] = [
//   {
//     label: 'Light Mode',
//     kbd: ['ctrl ', 'I'],
//     key: 'light_mode',
//     description: 'In preferences',
//     commandType: 'hidden'
//   },
//   {
//     label: 'Dark Mode',
//     kbd: ['ctrl ', 'I'],
//     key: 'dark_mode',
//     description: 'In preferences',
//     commandType: 'hidden'
//   },
//   {
//     label: 'Settings',
//     kbd: ['ctrl', '.'],
//     key: 'navigate_to_settings',
//     description: 'Go to',
//     commandType: 'hidden',
//     keywords: ['settings', 'navigate']
//   },
//   {
//     label: 'Preferences',
//     kbd: ['ctrl', ','],
//     key: 'open_preferences',
//     description: 'Open',
//     commandType: 'hidden',
//     keywords: ['preferences', 'settings', 'navigate']
//   },
//   {
//     label: 'Projects',
//     kbd: ['V', 'P'],
//     key: 'navigate_to_project',
//     description: 'Go to',
//     commandType: 'hidden',
//     keywords: ['prjs', 'prj'],
//     joinKbdWithThen: true
//   },
//   {
//     label: 'Library',
//     kbd: ['V', 'L'],
//     keywords: ['file', 'folder'],
//     key: 'navigate_to_library',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true
//   },
//   {
//     label: 'User Management',
//     kbd: ['V', 'U'],
//     key: 'navigate_to_user_management',
//     description: 'Go to',
//     commandType: 'hidden',
//     keywords: [
//       'usermanagement',
//       'manage',
//       'admin',
//       'settings',
//       'organization',
//       'invite',
//       'navigate'
//     ],
//     joinKbdWithThen: true
//   },
//   {
//     label: 'Appearance',
//     kbd: [],
//     key: 'appearance',
//     description: 'In preferences',
//     commandType: 'hidden',
//     hasRightSection: true,
//     keywords: ['appearance', 'theme', 'mode']
//   },
//   {
//     label: 'Report',
//     kbd: [],
//     hasRightSection: true,
//     key: 'bug_report',
//     description: 'Report a bug',
//     commandType: 'hidden',
//     keywords: ['bugs', 'report', 'feedback', 'crash', 'bug', 'issue']
//   },
//   {
//     label: 'Views',
//     kbd: ['V', 'V'],
//     key: 'navigate_to_views',
//     description: 'Go to',
//     commandType: 'hidden',
//     keywords: ['views', 'view', 'navigate'],
//     joinKbdWithThen: true
//   },
//   {
//     label: 'Remixes',
//     kbd: ['V', 'R'],
//     key: 'navigate_to_remixes',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['remixes', 'remix', 'navigate']
//   },
//   {
//     label: 'Workspace Teams',
//     kbd: ['V', 'T'],
//     key: 'navigate_to_workspace_teams',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['teams', 'team', 'workspace teams', 'navigate']
//   },
//   {
//     label: 'Workspace Members',
//     kbd: ['V', 'M'],
//     key: 'navigate_to_workspace_members',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['members', 'member', 'workspace members', 'navigate']
//   },
//   {
//     label: 'Connections',
//     kbd: ['V', 'C'],
//     key: 'navigate_to_workspace_connections',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['connections', 'connection', 'navigate']
//   },
//   {
//     label: 'Workflows',
//     kbd: ['V', 'W'],
//     key: 'navigate_to_workspace_workflows',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['workflows', 'workflow', 'navigate']
//   },
//   {
//     label: 'Metadata Templates',
//     kbd: ['V', 'D'],
//     key: 'navigate_to_workspace_metadata_templates',
//     description: 'Go to',
//     commandType: 'hidden',
//     joinKbdWithThen: true,
//     keywords: ['metadata templates', 'metadata', 'templates', 'navigate']
//   }
// ];

// export const librarySearchCommands: Command[] = [
//   {
//     label: 'Upload',
//     kbd: ['mod', 'U'],
//     key: 'upload',
//     description: '',
//     commandType: 'library'
//   },
//   {
//     label: 'Create new folder',
//     kbd: ['mod', 'alt', 'N'],
//     key: 'create_new_folder',
//     description: '',
//     commandType: 'library'
//   },
//   {
//     label: 'Create new connected folder',
//     kbd: ['mod', 'alt', 'C'],
//     key: 'create_new_connected_folder',
//     description: '',
//     commandType: 'library'
//   },
//   {
//     label: 'Flatten folder',
//     kbd: ['mod', 'alt', 'F'],
//     key: 'flatten_folder',
//     description: '',
//     commandType: 'library'
//   },
//   {
//     label: 'Grid view',
//     kbd: ['mod', 'alt', 'G'],
//     key: 'view',
//     description: '',
//     commandType: 'library'
//   },
//   {
//     label: 'List view',
//     kbd: ['mod', 'alt', 'L'],
//     key: 'view',
//     description: '',
//     commandType: 'library'
//   }
// ];

// export const reviewSearchCommands: Command[] = [
//   {
//     label: 'Add a comment',
//     kbd: ['mod', 'shift', 'C'],
//     key: 'add_comment',
//     description: '',
//     commandType: 'review'
//   },
//   {
//     label: 'Change status of file',
//     kbd: ['mod', 'alt', 'I'],
//     key: 'change_status_of_file',
//     description: '',
//     commandType: 'review'
//   },
//   {
//     label: 'Export comments',
//     kbd: ['mod', 'shift', 'E'],
//     key: 'export_comments',
//     description: '',
//     commandType: 'review'
//   },
//   {
//     label: 'View Metadata',
//     kbd: ['mod', 'alt', 'M'],
//     key: 'metadata_for_file',
//     description: '',
//     commandType: 'review'
//   },
//   {
//     label: 'Comments',
//     kbd: ['mod', 'alt', 'C'],
//     key: 'comments_for_file',
//     description: '',
//     commandType: 'review'
//   },
//   {
//     label: 'Add marker',
//     kbd: ['mod', 'M'],
//     key: 'add_marker',
//     description: '',
//     commandType: 'review'
//   }
// ];

// export const projectsSearchCommands: Command[] = [
//   {
//     label: 'Create Project',
//     kbd: ['mod', 'P'],
//     key: 'create_project',
//     description: '',
//     commandType: 'project'
//   }
// ];

// export const projectsPageCommands: Command[] = [
//   // {
//   //   label: 'View Metadata',
//   //   kbd: [']'],
//   //   key: 'view_metadata',
//   //   description: '',
//   //   commandType: 'project'
//   // },
//   // {
//   //   label: 'Escape Modal',
//   //   kbd: ['esc'],
//   //   key: 'escape_modal',
//   //   description: '',
//   //   commandType: 'project'
//   // }
// ];

export const userManagementAllUsersPageCommands: Command[] = [
  {
    label: 'Invite User',
    kbd: ['mod', 'U'],
    key: 'invite_user',
    description: '',
    commandType: 'user_management'
  },
  {
    label: 'Create Workspace',
    kbd: ['mod', 'alt', 'W'],
    key: 'create_workspace',
    description: '',
    commandType: 'user_management'
  },
  {
    label: 'Create Security Group',
    kbd: ['mod', 'alt', 'S'],
    key: 'create_security_group',
    description: '',
    commandType: 'user_management'
  },
  {
    label: 'Add to security groups',
    kbd: ['mod', 'alt', 'A'],
    key: 'add_to_security_groups',
    description: '',
    commandType: 'user_management',
    needsSelectedItems: true
  },
  {
    label: 'Add to workspace',
    kbd: ['mod', 'shift', 'A'],
    key: 'add_to_workspace',
    description: '',
    commandType: 'user_management',
    needsSelectedItems: true
  },
  {
    label: 'Download workspace users',
    kbd: ['mod', 'shift', 'E'],
    key: 'download_csv',
    description: '',
    commandType: 'user_management',
    needsSelectedItems: true
  }
];

export const userManagementWorkspacesPageCommands: Command[] = [
  {
    label: 'Add to team',
    kbd: ['mod', 'alt', 'T'],
    key: 'add_to_team',
    description: '',
    commandType: 'user_management',
    needsSelectedItems: true
  },
  {
    label: 'Download workspace users',
    kbd: ['mod', 'shift', 'E'],
    key: 'download_csv',
    description: '',
    commandType: 'user_management'
  },
  {
    label: 'Create new team',
    kbd: ['mod', 'shift', 'T'],
    key: 'create_new_team',
    description: '',
    commandType: 'user_management'
  }
];

export const userManagementHiddenCommands: Command[] = [
  {
    label: 'Report',
    kbd: [],
    hasRightSection: true,
    key: 'bug_report',
    description: 'Report a bug',
    commandType: 'hidden',
    keywords: ['bugs', 'report', 'feedback', 'crash', 'bug', 'issue']
  }
];
