// import { Key, useCallback, useMemo } from 'react';

// import { useParams, usePathname, useRouter } from 'next/navigation';

// import { ADD_VIDEO, dispatcher } from '@/packages/@tessact/editor';
// import { useLocalStorage } from '@mantine/hooks';
// import { nanoid } from 'nanoid';
// import { useTheme } from 'next-themes';
// import { toast } from 'sonner';

// import { LayoutThird, LayoutWindow } from '@tessact/icons';

// import { Tab, Tabs } from '@/components/ui/Tabs';
// import { ToastError, ToastProcess, ToastSuccess } from '@/components/ui/ToastContent';

// import { useProjectLibraryFilterState } from '@/hooks/useProjectLibraryFilterState';

// import { useCopyAssets, useDeleteAssets, useMoveAssets } from '@/api-integration/mutations/library';
// import {
//   useExportSelectedUsers,
//   useExportWorkspaceUsers
// } from '@/api-integration/mutations/user-management';

// import { Thumbnail, useLibraryStore, View } from '@/stores/library-store';
// // import { useLibraryStore } from '@/stores/library-store';
// import { usePreferencesStore } from '@/stores/preferences-store';
// import { useProjectStore } from '@/stores/project-store';
// import { useSearchActionsStore } from '@/stores/search-actions-store';
// import { useSearchStore } from '@/stores/search-store';
// // import { useUserPreferencesStore } from '@/stores/user-preferences-store';
// import { useUserStore } from '@/stores/users-store';
// import useWorkspaceStore from '@/stores/workspaces';

// import {
//   Command,
//   CommandKey,
//   HiddenCommandKey,
//   LibraryCommandKey,
//   ProjectCommandKey,
//   ProjectPageCommandKey,
//   ReviewCommandKey,
//   UserManagementCommandKey
// } from '@/utils/searchUtils';

// import {
//   addComment,
//   addMarker,
//   addNewMember,
//   addNewTask,
//   addToSecurityGroups,
//   addToTeam,
//   addToWorkspace,
//   changeFileStatus,
//   changeProjectStatus,
//   commentsForFile,
//   createNewConnectedFolder,
//   createNewFolder,
//   createNewTeam,
//   createProject,
//   createSecurityGroup,
//   createWorkspace,
//   darkMode,
//   downloadWorkspaceUsers,
//   exportComments,
//   fitFillThumbnail,
//   flattenFolder,
//   gridView,
//   inviteUser,
//   lightMode,
//   listView,
//   navigate,
//   preferences,
//   quickSearch,
//   searchForClips,
//   settings as settingsKey,
//   upload,
//   uploadFileInProject,
//   viewMetadata,
//   viewProjectsOrTasks
// } from '../utils/hotkeysUtils';
// import { useApi } from './useApi';

// type AspectRatio = 'vertical' | 'horizontal';

// export function useLocationRoutes() {
//   const pathname = usePathname();
//   const params = useParams();

//   const isOnLibrary = useMemo(
//     () =>
//       pathname.includes('/library') &&
//       !pathname.includes('/library/asset') &&
//       !pathname.includes('/library/folder') &&
//       !pathname.includes('/library/video') &&
//       !pathname.includes('/library/editor'),
//     [pathname]
//   );

//   const isOnProjects = useMemo(
//     () => pathname.includes('/projects') && !params.projectId,
//     [pathname, params.projectId]
//   );

//   const isOnSingleProject = useMemo(
//     () =>
//       pathname.includes('/projects/') &&
//       params.projectId &&
//       !params.folderId &&
//       !pathname.includes('/files') &&
//       !pathname.includes('/files/video'),
//     [pathname, params.projectId, params.folderId]
//   );

//   const isOnFolder = useMemo(
//     () => pathname.includes('/library/folder') && params.folderId,
//     [pathname, params.folderId]
//   );

//   const isOnAssetPage = useMemo(
//     () => pathname.includes('/library/asset') && params.assetId,
//     [pathname, params.assetId]
//   );

//   const isOnProjectFoldersPage = useMemo(
//     () => pathname.includes('/projects/') && !!params.projectId && !!params.folderId,
//     [pathname, params.projectId, params.folderId]
//   );

//   const isOnProjectFilesPage = useMemo(
//     () =>
//       pathname.includes('/projects/') &&
//       !!params.projectId &&
//       pathname.includes('/files') &&
//       !params.folderId,
//     [pathname, params.projectId, params.folderId]
//   );

//   const isOnEditorsPage = useMemo(
//     () =>
//       pathname.includes('/files/video') ||
//       pathname.includes('/library/video') ||
//       pathname.includes('/library/editor'),
//     [pathname]
//   );

//   const isOnViewsPage = useMemo(() => pathname.includes('/views'), [pathname]);

//   const isOnSettings = useMemo(() => pathname.includes('/settings'), [pathname]);

//   const isOnUserManagement = useMemo(() => pathname.includes('/admin'), [pathname]);

//   const isAllUsersPage = useMemo(
//     () =>
//       pathname === '/admin/users' ||
//       pathname === '/admin/security-groups' ||
//       pathname === '/admin/roles',
//     [pathname]
//   );

//   const isWorkspacesPage = useMemo(() => pathname?.includes('workspaces'), [pathname]);
//   const isTeamPage = useMemo(() => pathname?.includes('team'), [pathname]);

//   const routes = {
//     library: isOnLibrary,
//     projects: isOnProjects,
//     singleProject: isOnSingleProject,
//     folder: isOnFolder,
//     asset: isOnAssetPage,
//     admin: isOnUserManagement,
//     settings: isOnSettings,
//     projectFolders: isOnProjectFoldersPage,
//     allUsers: isAllUsersPage,
//     workspaces: isWorkspacesPage,
//     team: isTeamPage,
//     views: isOnViewsPage,
//     editors: isOnEditorsPage,
//     projectFiles: isOnProjectFilesPage
//   };

//   return {
//     routes
//   };
// }

// export function useSearchActions() {
//   const router = useRouter();
//   const params = useParams();
//   const { theme, setTheme } = useTheme();

//   const {
//     setIsSearchOpen,
//     setIsSecondarySearchOpen,
//     setShowBugReportPage,
//     reset,
//     setIsChangeFileStatusEnabled,
//     selectedQuickSearchItem,
//     setIsProjectFileStatusEnabled,
//     setIsUserManagementSearchOpen,
//     setUserManagementSearchInput,
//     setIsSecondarySearchForUserManagementOpen,
//     resetUserManagementStates
//   } = useSearchStore();

//   const {
//     onNewFolderOpenChange,
//     onNewConnectedFolderOpenChange,
//     inputFileRef,
//     setIsCommentInputFocusChange,
//     setSelectedPanelTab,
//     setIsExportCommentsOpen,
//     setIsMarkersVisible,
//     onInviteUserOpenChange,
//     onCreateWorkspaceOpenChange,
//     onCreateSecurityGroupOpenChange,
//     onAddToExistingWorkspaceOpenChange,
//     onCreateTeamOpenChange,
//     onNewTeamWithSelectionOpenChange
//   } = useSearchActionsStore();

//   const { setIsPreferencesModalOpen } = usePreferencesStore();

//   const closeUserManagementSearch = () => {
//     setIsUserManagementSearchOpen(false);
//     setUserManagementSearchInput('');
//   };

//   const [lastProductRoute] = useLocalStorage({
//     key: 'last-product-route'
//   });

//   const { mutate: exportSelectedUsers } = useExportSelectedUsers();
//   const { mutate: exportWorkspaceUsers } = useExportWorkspaceUsers(params.workspaceId as string);

//   // const selectedWorkspaceUsers = useWorkspaceStore((state) => state.selectedItems);
//   const selectedAllUsers = useUserStore((state) => state.selectedItems);

//   const {
//     setView,
//     // setFlattenFolders,
//     // flattenFolders,
//     view,
//     setSelectedClipboardAction,
//     selectedItems,
//     clearSelectedItems,
//     selectedClipboardAction,
//     setThumbnail,
//     thumbnail,
//     aspectRatio,
//     setAspectRatio
//   } = useLibraryStore();

//   const { setIsFlattened, isFlattened } = useProjectLibraryFilterState();

//   const { mutateAsync: copyAssets } = useCopyAssets(params.folderId as string);
//   const { mutateAsync: moveAssets } = useMoveAssets();
//   const { mutateAsync: deleteAssets } = useDeleteAssets();

//   const {
//     setProjectView: setProjectsView,
//     projectView: projectsView,
//     setIsCreateNewProjectModalOpen,
//     setIsNewTaskCreationModalOpen,
//     setIsAddProjectUserModalOpen,
//     setIsFilePickerOpen,
//     projectsSelectedTab: selectedProjectPanelTab,
//     setProjectsSelectedTab: setSelectedProjectPanelTab,
//     setProjectLibraryView,
//     flattenFolders: projectLibraryFlattenFolders,
//     setFlattenFolders: setProjectLibraryFlattenFolders,
//     thumbnail: projectLibraryThumbnail,
//     setThumbnail: setProjectLibraryThumbnail,
//     projectLibraryView
//   } = useProjectStore();

//   // const {} = useUserPreferencesStore();

//   const hiddenCommandActions = (command: HiddenCommandKey) => {
//     switch (command) {
//       case 'appearance':
//         setTheme(theme === 'dark' ? 'light' : 'dark');
//         break;
//       case 'dark_mode':
//         setTheme('dark');
//         reset();
//         break;

//       case 'navigate_to_settings':
//         router.push('/settings');
//         setIsSearchOpen(false);
//         reset();
//         break;

//       case 'bug_report':
//         setShowBugReportPage(true);
//         setIsSecondarySearchOpen(true);
//         break;

//       case 'light_mode':
//         setTheme('light');
//         reset();
//         break;

//       case 'navigate_to_library':
//         router.push('/library');
//         reset();

//         break;
//       case 'navigate_to_user_management':
//         router.push('/admin/users');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_project':
//         router.push('/projects');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_views':
//         router.push('/views');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_remixes':
//         router.push('/remixes');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_workspace_connections':
//         router.push('/settings/connections');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_workspace_members':
//         router.push('/settings/members');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_workspace_metadata_templates':
//         router.push('/settings/metadata-templates');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_workspace_teams':
//         router.push('/settings/teams');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_workspace_workflows':
//         router.push('/settings/workflows');
//         setIsSearchOpen(false);
//         reset();
//         break;
//       case 'navigate_to_preferences':
//         setIsPreferencesModalOpen(true);
//         setIsSearchOpen(false);
//         reset();
//         break;
//       // case 'appearance':
//       //   setTheme(theme === 'dark' ? 'light' : 'dark');
//       //   break;
//       // case 'dark_mode':
//       //   setTheme('dark');
//       //   break;

//       // case 'light_mode':
//       //   setTheme('light');
//       //   break;

//       // case 'navigate_to_library':
//       //   router.push('/library');
//       //   setIsSearchOpen(false);
//       //   reset();
//       //   break;
//       // case 'navigate_to_user_management':
//       //   router.push('/admin/users');
//       //   setIsSearchOpen(false);
//       //   reset();
//       //   break;
//       // case 'navigate_to_project':
//       //   router.push('/projects');
//       //   setIsSearchOpen(false);
//       //   reset();
//       //   break;
//       // case 'navigate_to_settings':
//       //   router.push('/settings/metadata-templates');
//       //   reset();
//       //   break;

//       // case 'navigate_to_views':
//       //   router.push('/views');
//       //   reset();
//       //   break;
//     }
//   };

//   const closeModal = () => {
//     setIsSearchOpen(false);
//     reset();
//   };

//   const onLibraryAction = (commandKey: LibraryCommandKey) => {
//     switch (commandKey) {
//       case 'create_new_folder': {
//         onNewFolderOpenChange();
//         closeModal();
//         break;
//       }
//       case 'create_new_connected_folder': {
//         onNewConnectedFolderOpenChange();
//         closeModal();
//         break;
//       }
//       case 'upload': {
//         inputFileRef.current?.click();
//         // setIsSearchOpen(false);
//         break;
//       }

//       case 'view': {
//         if (view === 'grid') {
//           setView('list');
//         } else {
//           setView('grid');
//         }
//         // closeModal();
//         break;
//       }

//       case 'flatten_folder': {
//         if (isFlattened) {
//           setIsFlattened(false);
//         } else {
//           setIsFlattened(true);
//         }
//         // closeModal();
//         break;
//       }

//       case 'aspect_ratio': {
//         if (aspectRatio === 'horizontal') {
//           setAspectRatio('vertical');
//         } else {
//           setAspectRatio('horizontal');
//         }
//         break;
//       }

//       case 'fit_fill_thumbnail': {
//         setThumbnail(thumbnail === 'fit' ? 'fill' : 'fit');
//         // closeModal();
//         break;
//       }

//       case 'delete_assets': {
//         (async () => {
//           await deleteAssets(selectedItems.map((item) => item.id));
//           clearSelectedItems();
//         })();

//         break;
//       }
//       case 'paste_assets': {
//         if (selectedClipboardAction === 'copy') {
//           toast.promise(copyAssets(selectedItems.map((item) => item.id)), {
//             loading: <ToastProcess title="Copying assets" />,
//             success: <ToastSuccess title="Assets copied" />,
//             error: <ToastError title="Failed to copy assets" />
//           });
//         } else {
//           toast.promise(
//             moveAssets({
//               items: selectedItems.map((item) => item.id),
//               destinationFolderId: params.folderId as string
//             }),
//             {
//               loading: <ToastProcess title="Moving assets" />,
//               success: <ToastSuccess title="Assets moved" />,
//               error: <ToastError title="Failed to move assets" />
//             }
//           );
//         }
//         clearSelectedItems();
//         setSelectedClipboardAction(null);
//         break;
//       }
//       case 'copy_assets': {
//         setSelectedClipboardAction('copy');
//         break;
//       }
//       case 'cut_assets': {
//         setSelectedClipboardAction('cut');
//         break;
//       }
//     }
//   };

//   const onReviewAction = (commandKey: ReviewCommandKey) => {
//     switch (commandKey) {
//       case 'add_comment': {
//         // onNewFolderOpenChange();
//         // setIsSearchOpen(false);
//         setSelectedPanelTab('comments');
//         setIsCommentInputFocusChange(true);
//         closeModal();
//         break;
//       }
//       case 'change_status_of_file': {
//         setIsSecondarySearchOpen(true);
//         setIsChangeFileStatusEnabled(true);
//         break;
//       }
//       case 'metadata_for_file': {
//         setSelectedPanelTab('metadata');
//         closeModal();
//         break;
//       }

//       case 'add_marker': {
//         setSelectedPanelTab('comments');
//         setIsMarkersVisible(true);
//         closeModal();
//         break;
//       }

//       case 'comments_for_file': {
//         setSelectedPanelTab('comments');
//         closeModal();
//         break;
//       }

//       case 'export_comments': {
//         setIsExportCommentsOpen(true);
//         setSelectedPanelTab('comments');
//         closeModal();
//         break;
//       }
//     }
//   };

//   const onProjectPageAction = (commandKey: ProjectCommandKey) => {
//     switch (commandKey) {
//       case 'create_project': {
//         setIsCreateNewProjectModalOpen(true);
//         setSelectedProjectPanelTab('all-projects');
//         reset();

//         break;
//       }

//       case 'view_projects_or_tasks': {
//         setSelectedProjectPanelTab(
//           selectedProjectPanelTab === 'all-projects' ? 'all-tasks' : 'all-projects'
//         );
//         reset();
//         break;
//       }

//       case 'project_view': {
//         setProjectsView(projectsView === 'grid' ? 'list' : 'grid');
//         break;
//       }
//     }
//   };

//   const onSingleProjectPageAction = (commandKey: ProjectPageCommandKey) => {
//     switch (commandKey) {
//       case 'add_new_member': {
//         setIsAddProjectUserModalOpen(true);
//         router.push(`/projects/${params?.projectId}/members`);
//         reset();
//         break;
//       }
//       case 'add_new_task': {
//         router.push(`/projects/${params?.projectId}/`);
//         setIsNewTaskCreationModalOpen(true);
//         reset();
//         break;
//       }

//       case 'change_status_project': {
//         setIsSecondarySearchOpen(true);
//         setIsProjectFileStatusEnabled(true);
//         break;
//       }

//       case 'upload_file_in_project': {
//         //
//         setIsFilePickerOpen(true);
//         router.push(`/projects/${params?.projectId}/files`);
//         reset();
//         break;
//       }

//       case 'upload': {
//         inputFileRef.current?.click();
//         break;
//       }

//       case 'create_new_folder': {
//         onNewFolderOpenChange();
//         // router.push(`/projects/${params?.projectId}/files/folder`);
//         reset();
//         break;
//       }

//       case 'create_new_connected_folder': {
//         onNewConnectedFolderOpenChange();
//         // router.push(`/projects/${params?.projectId}/files/folder`);
//         reset();
//         break;
//       }

//       case 'project_library_flatten_folder': {
//         if (projectLibraryFlattenFolders) {
//           setProjectLibraryFlattenFolders(false);
//         } else {
//           setProjectLibraryFlattenFolders(true);
//         }
//         break;
//       }

//       case 'project_library_view': {
//         console.log('view');
//         if (projectLibraryView === 'grid') {
//           setProjectLibraryView('list');
//         } else {
//           setProjectLibraryView('grid');
//         }
//         break;
//       }

//       case 'project_library_thumbnail': {
//         //
//         setProjectLibraryThumbnail(projectLibraryThumbnail === 'fit' ? 'fill' : 'fit');
//         break;
//       }

//       case 'change_due_date': {
//         //
//         break;
//       }
//     }
//   };

//   const {
//     routes: { admin, workspaces }
//   } = useLocationRoutes();

//   const { setSelectedCommandForUserManagement } = useSearchStore();
//   const { globalCommandsForUserManagement } = useSearchCommands();

//   const onUserManagementCommandSelect = useCallback(
//     (commandKey: UserManagementCommandKey | HiddenCommandKey) => {
//       switch (commandKey) {
//         // case 'hidden':
//         //   hiddenCommandActions(commandKey as HiddenCommandKey);
//         //

//         case 'navigate_to_settings':
//           router.push('/settings');
//           resetUserManagementStates();
//           break;

//         case 'navigate_to_library':
//           router.push('/library');
//           resetUserManagementStates();

//           break;
//         case 'navigate_to_user_management':
//           router.push('/admin/users');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_project':
//           router.push('/projects');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_views':
//           router.push('/views');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_remixes':
//           router.push('/remixes');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_workspace_connections':
//           router.push('/settings/connections');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_workspace_members':
//           router.push('/settings/members');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_workspace_metadata_templates':
//           router.push('/settings/metadata-templates');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_workspace_teams':
//           router.push('/settings/teams');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_workspace_workflows':
//           router.push('/settings/workflows');
//           resetUserManagementStates();
//           break;
//         case 'navigate_to_preferences':
//           setIsPreferencesModalOpen(true);
//           resetUserManagementStates();
//           break;

//         case 'navigate':
//           setSelectedCommandForUserManagement(
//             globalCommandsForUserManagement.find((command) => command.key === 'navigate') ?? null
//           );
//           break;
//         case 'go_back':
//           router.push(lastProductRoute || '/library');
//           closeUserManagementSearch();
//           break;
//         case 'bug_report':
//           setIsSecondarySearchForUserManagementOpen(true);
//           break;
//         // all users page commands
//         case 'invite_user':
//           router.push('/admin/users');
//           onInviteUserOpenChange();
//           closeUserManagementSearch();
//           break;
//         case 'create_workspace':
//           onCreateWorkspaceOpenChange();
//           closeUserManagementSearch();
//           break;
//         case 'create_security_group':
//           router.push('/admin/security-groups/');
//           onCreateSecurityGroupOpenChange();
//           closeUserManagementSearch();
//           break;
//         case 'add_to_workspace':
//           onAddToExistingWorkspaceOpenChange();
//           closeUserManagementSearch();
//           break;
//         case 'add_to_security_groups':
//           break;
//         case 'download_csv':
//           if (selectedAllUsers.length > 0 && admin) {
//             exportSelectedUsers(selectedAllUsers.map((user) => user.id));
//           }
//           if (workspaces) {
//             exportWorkspaceUsers();
//           }
//           closeUserManagementSearch();
//           break;

//         // workspace page commands
//         case 'add_to_team':
//           onNewTeamWithSelectionOpenChange();
//           closeUserManagementSearch();
//           break;

//         case 'create_new_team':
//           onCreateTeamOpenChange();
//           closeUserManagementSearch();
//           break;
//         default:
//           break;
//       }
//     },
//     [
//       onInviteUserOpenChange,
//       onCreateWorkspaceOpenChange,
//       lastProductRoute,
//       onAddToExistingWorkspaceOpenChange,
//       onCreateTeamOpenChange,
//       onCreateSecurityGroupOpenChange,
//       exportSelectedUsers,
//       exportWorkspaceUsers,
//       admin,
//       workspaces,
//       onNewTeamWithSelectionOpenChange,
//       router,
//       selectedAllUsers
//     ]
//   );

//   // open for quick search

//   const isOpenButtondisabledInFooter = useMemo(() => {
//     if (selectedQuickSearchItem) {
//       return false;
//     }

//     return true;
//   }, [selectedQuickSearchItem]);

//   // only for quick search
//   const onOpenButtonClick = useCallback(() => {
//     if (selectedQuickSearchItem?.resourcetype === 'Folder') {
//       router.push(`/library/folder/${selectedQuickSearchItem.id}`);
//     } else if (
//       selectedQuickSearchItem?.resourcetype === 'VideoFile' ||
//       selectedQuickSearchItem?.resourcetype === 'ImageFile' ||
//       selectedQuickSearchItem?.resourcetype === 'AudioFile' ||
//       selectedQuickSearchItem?.resourcetype === 'PhysicalAsset' ||
//       selectedQuickSearchItem?.resourcetype === 'File'
//     ) {
//       if (
//         selectedQuickSearchItem.file_type === 'draft' &&
//         selectedQuickSearchItem.file_extension === '.tdraft'
//       ) {
//         router.push(`/library/video/${selectedQuickSearchItem.id}`);
//       } else {
//         router.push(`/library/asset/${selectedQuickSearchItem.id}`);
//       }
//     } else if (selectedQuickSearchItem?.resourcetype === 'Project') {
//       router.push(`/projects/${selectedQuickSearchItem.id}/files`);
//     } else if (
//       selectedQuickSearchItem?.resourcetype === 'ProjectAudioFile' ||
//       selectedQuickSearchItem?.resourcetype === 'ProjectVideoFile' ||
//       selectedQuickSearchItem?.resourcetype === 'ProjectImageFile' ||
//       selectedQuickSearchItem?.resourcetype === 'ProjectFile' ||
//       selectedQuickSearchItem?.resourcetype === 'ProjectPhysicalAsset'
//     ) {
//       //

//       if (
//         selectedQuickSearchItem.file_extension === '.tdraft' &&
//         selectedQuickSearchItem.file_type === 'draft'
//       ) {
//         router.push(
//           `/projects/${selectedQuickSearchItem.project}/files/video/${selectedQuickSearchItem.id}`
//         );
//       } else {
//         router.push(
//           `/projects/${selectedQuickSearchItem.project}/files/asset/${selectedQuickSearchItem.id}`
//         );
//       }
//     } else if (selectedQuickSearchItem?.resourcetype === 'ProjectFolder') {
//       //
//       router.push(
//         `/projects/${selectedQuickSearchItem.project}/files/folder/${selectedQuickSearchItem.id}`
//       );
//     }

//     reset();
//   }, [selectedQuickSearchItem, reset, router]);

//   return {
//     hiddenCommandActions,
//     onLibraryAction,
//     onReviewAction,
//     isOpenButtondisabledInFooter,
//     onOpenButtonClick,
//     onProjectPageAction,
//     onSingleProjectPageAction,
//     onUserManagementCommandSelect,
//     closeUserManagementSearch
//   };
// }

// export function useSearchCommands() {
//   const {
//     routes: {
//       library,
//       folder,
//       projects,
//       singleProject,
//       asset,
//       admin,
//       workspaces,
//       settings,
//       team,
//       views,
//       projectFolders,
//       projectFiles
//     }
//   } = useLocationRoutes();

//   const selectedWorkspaceUsers = useWorkspaceStore((state) => state.selectedItems);
//   const selectedAllUsers = useUserStore((state) => state.selectedItems);

//   const { view } = useLibraryStore();
//   const { isFlattened } = useProjectLibraryFilterState();
//   const { projectView: projectsView, projectsSelectedTab: selectedProjectsTab } = useProjectStore();
//   // const {} = useUserPreferencesStore();

//   const { userManagementSearchInput, selectedCommand, selectedCommandForUserManagement } =
//     useSearchStore();
//   const { selectedItems } = useLibraryStore();

//   const [lastProductRoute] = useLocalStorage({
//     key: 'last-product-route'
//   });

//   const globalSearchCommands: Command[] = [
//     {
//       label: 'Quick Search',
//       description: 'Find files, folders and metadata instantly',
//       kbd: quickSearch,
//       key: 'quick_search',
//       placeholder: 'Search for files, metadata & folders',
//       commandType: 'global',
//       id: 'quick_search'
//     },
//     {
//       label: 'Smart Search for Clips',
//       description: 'AI creates smart cuts from all your files',
//       kbd: searchForClips,
//       key: 'search_for_clips',
//       placeholder: 'Search for scenes, clips and cuts across your files',
//       commandType: 'global',
//       id: 'smart_clips'
//     },
//     {
//       label: 'Go to',
//       description: 'Navigate anywhere in the product',
//       kbd: navigate,
//       key: 'navigate',
//       commandType: 'global',
//       id: 'navigate'
//     }
//   ];

//   const filteredGlobalSearchCommands: Command[] = [
//     {
//       label: 'Quick Search',
//       description: 'Find files, folders and metadata instantly',
//       kbd: [],
//       // kbd: ['mod', 'F'],
//       key: 'filtered_quick_search',
//       placeholder: 'Search for files, metadata & folders',
//       commandType: 'filter'
//     },
//     {
//       label: 'Smart Search for Clips',
//       description: 'AI creates smart cuts from all your files',
//       kbd: [],
//       // kbd: ['mod', 'shift', 'F'],
//       key: 'filtered_search_for_clips',
//       placeholder: 'Search for scenes, clips and cuts across your files',
//       commandType: 'filter'
//     }

//     // {
//     //   label: 'Ask AI',
//     //   description: 'Anything about your workspace, projects or files',
//     //   kbd: ['mod', 'shift', 'A'],
//     //   key: 'filtered_ask_ai',
//     //   placeholder: 'Ask anything about your workspace, projects or files',
//     //   commandType: 'filter'
//     // }
//   ];

//   const hiddenCommands: Command[] = [
//     {
//       label: 'Light Mode',
//       kbd: lightMode,
//       key: 'light_mode',
//       description: 'In preferences',
//       commandType: 'hidden'
//     },
//     {
//       label: 'Dark Mode',
//       kbd: darkMode,
//       key: 'dark_mode',
//       description: 'In preferences',
//       commandType: 'hidden'
//     },
//     {
//       label: 'Settings',
//       kbd: settingsKey,
//       key: 'navigate_to_settings',
//       description: '',
//       commandType: 'hidden',
//       keywords: ['settings', 'navigate']
//     },
//     {
//       label: 'Preferences',
//       kbd: preferences,
//       key: 'navigate_to_preferences',
//       description: 'Open',
//       commandType: 'hidden',
//       keywords: ['preferences', 'settings', 'navigate']
//     },
//     {
//       label: 'Projects',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['P']
//           : ['G', 'P'],
//       key: 'navigate_to_project',
//       description: '',
//       commandType: 'hidden',
//       keywords: ['prjs', 'prj'],
//       joinKbdWithThen: true
//     },
//     {
//       label: 'Library',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['L']
//           : ['G', 'L'],
//       keywords: ['file', 'folder'],
//       key: 'navigate_to_library',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true
//     },
//     {
//       label: 'User Management',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['U']
//           : ['G', 'U'],
//       key: 'navigate_to_user_management',
//       description: '',
//       // description: 'Navigate to',
//       commandType: 'hidden',
//       keywords: [
//         'usermanagement',
//         'manage',
//         'admin',
//         'settings',
//         'organization',
//         'invite',
//         'navigate'
//       ],
//       joinKbdWithThen: true
//     },
//     {
//       label: 'Appearance',
//       kbd: [],
//       key: 'appearance',
//       description: 'In preferences',
//       commandType: 'hidden',
//       hasRightSection: true,
//       keywords: ['appearance', 'theme', 'mode']
//     },
//     {
//       label: 'Report',
//       kbd: [],
//       hasRightSection: true,
//       key: 'bug_report',
//       description: 'Report a bug',
//       commandType: 'hidden',
//       keywords: ['bugs', 'report', 'feedback', 'crash', 'bug', 'issue']
//     },
//     {
//       label: 'Views',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['V']
//           : ['G', 'V'],
//       key: 'navigate_to_views',
//       description: '',
//       commandType: 'hidden',
//       keywords: ['views', 'view', 'navigate'],
//       joinKbdWithThen: true
//     },
//     {
//       label: 'Remixes',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['R']
//           : ['G', 'R'],
//       key: 'navigate_to_remixes',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['remixes', 'remix', 'navigate']
//     },
//     {
//       label: 'Workspace Teams',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['T']
//           : ['G', 'T'],
//       key: 'navigate_to_workspace_teams',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['teams', 'team', 'workspace teams', 'navigate']
//     },
//     {
//       label: 'Workspace Members',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['M']
//           : ['G', 'M'],
//       key: 'navigate_to_workspace_members',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['members', 'member', 'workspace members', 'navigate']
//     },
//     {
//       label: 'Connections',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['C']
//           : ['G', 'C'],
//       key: 'navigate_to_workspace_connections',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['connections', 'connection', 'navigate']
//     },
//     {
//       label: 'Workflows',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['W']
//           : ['G', 'W'],
//       key: 'navigate_to_workspace_workflows',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['workflows', 'workflow', 'navigate']
//     },
//     {
//       label: 'Metadata Templates',
//       kbd:
//         selectedCommandForUserManagement?.key === 'navigate' || selectedCommand?.key === 'navigate'
//           ? ['D']
//           : ['G', 'D'],
//       key: 'navigate_to_workspace_metadata_templates',
//       description: '',
//       commandType: 'hidden',
//       joinKbdWithThen: true,
//       keywords: ['metadata templates', 'metadata', 'templates', 'navigate']
//     }
//   ];

//   const librarySearchCommands: Command[] = [
//     {
//       label: 'Upload',
//       kbd: upload,
//       key: 'upload',
//       description: '',
//       commandType: 'library'
//     },
//     {
//       label: 'Create new folder',
//       kbd: createNewFolder,
//       key: 'create_new_folder',
//       description: '',
//       commandType: 'library'
//     },
//     {
//       label: 'Create new connected folder',
//       kbd: createNewConnectedFolder,
//       key: 'create_new_connected_folder',
//       description: '',
//       commandType: 'library'
//     },
//     {
//       label: isFlattened ? 'Unflatten folder' : 'Flatten folder',
//       kbd: flattenFolder,
//       key: 'flatten_folder',
//       description: '',
//       keywords: ['flatten', 'folder', 'unflatten'],
//       commandType: 'library',
//       hasRightSection: true
//     },
//     {
//       label: view === 'grid' ? 'List View' : 'Grid View',
//       kbd: view === 'grid' ? listView : gridView,
//       key: 'view',
//       description: '',
//       commandType: 'library',
//       keywords: ['view', 'list', 'grid'],
//       hasRightSection: true
//     },
//     {
//       label: 'Aspect Ratio',
//       kbd: [],
//       key: 'aspect_ratio',
//       description: '',
//       commandType: 'library',
//       hasRightSection: true,
//       keywords: ['aspect', 'ratio', 'card']
//     },
//     // {
//     //   label: 'Delete selected assets',
//     //   kbd: ['mod', 'alt', 'D'],
//     //   key: 'delete_assets',
//     //   description: '',
//     //   commandType: 'library',
//     //   needsSelectedItems: true
//     // },
//     // {
//     //   label: 'Copy selected assets',
//     //   kbd: ['alt', 'C'],
//     //   key: 'copy_assets',
//     //   description: '',
//     //   commandType: 'library',
//     //   needsSelectedItems: true
//     // },
//     // {
//     //   label: 'Paste selected assets',
//     //   kbd: ['mod', 'alt', 'V'],
//     //   key: 'paste_assets',
//     //   description: '',
//     //   commandType: 'library',
//     //   needsSelectedItems: true
//     // },
//     {
//       label: 'Thumbnail',
//       kbd: fitFillThumbnail,
//       key: 'fit_fill_thumbnail',
//       keywords: ['thumbnail', 'fit', 'fill'],
//       description: '',
//       commandType: 'library',
//       hasRightSection: true
//     }
//   ];

//   const reviewSearchCommands: Command[] = [
//     {
//       label: 'Add a comment',
//       kbd: addComment,
//       key: 'add_comment',
//       description: '',
//       commandType: 'review'
//     },
//     {
//       label: 'Change status of file',
//       kbd: changeFileStatus,
//       key: 'change_status_of_file',
//       description: '',
//       commandType: 'review'
//     },
//     {
//       label: 'Export comments',
//       kbd: exportComments,
//       key: 'export_comments',
//       description: '',
//       commandType: 'review'
//     },
//     {
//       label: 'View Metadata',
//       kbd: viewMetadata,
//       key: 'metadata_for_file',
//       description: '',
//       commandType: 'review'
//     },
//     {
//       label: 'Comments',
//       kbd: commentsForFile,
//       key: 'comments_for_file',
//       description: '',
//       commandType: 'review'
//     },
//     {
//       label: 'Add marker',
//       kbd: addMarker,
//       key: 'add_marker',
//       description: '',
//       commandType: 'review'
//     }
//   ];

//   const projectsSearchCommands: Command[] = [
//     {
//       label: 'Create Project',
//       kbd: createProject,
//       key: 'create_project',
//       description: '',
//       commandType: 'project'
//     },
//     {
//       label: projectsView === 'grid' ? 'List View' : 'Grid View',
//       kbd: projectsView === 'grid' ? listView : gridView,
//       key: 'project_view',
//       description: '',
//       commandType: 'project',
//       keywords: ['grid', 'list', 'view'],
//       hasRightSection: true
//     },
//     {
//       label: selectedProjectsTab === 'all-tasks' ? 'View all projects' : 'View all tasks',
//       kbd: viewProjectsOrTasks,
//       key: 'view_projects_or_tasks',
//       description: '',
//       commandType: 'project',
//       keywords: ['tasks', 'projects', 'tasks']
//     }
//   ];

//   const projectsPageCommands: Command[] = [
//     {
//       label: 'Add new task',
//       kbd: addNewTask,
//       key: 'add_new_task',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: 'Upload files',
//       kbd: uploadFileInProject,
//       key: 'upload_file_in_project',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: 'Add new member',
//       kbd: addNewMember,
//       key: 'add_new_member',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: 'Change status of project',
//       kbd: changeProjectStatus,
//       key: 'change_status_project',
//       description: '',
//       commandType: 'project_page'
//     }
//   ];

//   const projectLibraryCommands: Command[] = [
//     {
//       label: 'Upload',
//       kbd: upload,
//       key: 'upload',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: 'Create new folder',
//       kbd: createNewFolder,
//       key: 'create_new_folder',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: 'Create new connected folder',
//       kbd: createNewConnectedFolder,
//       key: 'create_new_connected_folder',
//       description: '',
//       commandType: 'project_page'
//     },
//     {
//       label: isFlattened ? 'Unflatten folder' : 'Flatten folder',
//       kbd: flattenFolder,
//       key: 'project_library_flatten_folder',
//       description: '',
//       keywords: ['flatten', 'folder', 'unflatten'],
//       commandType: 'project_page',
//       hasRightSection: true
//     },
//     {
//       label: view === 'grid' ? 'List View' : 'Grid View',
//       kbd: view === 'grid' ? listView : gridView,
//       key: 'project_library_view',
//       description: '',
//       commandType: 'project_page',
//       keywords: ['view', 'list', 'grid'],
//       hasRightSection: true
//     },
//     {
//       label: 'Thumbnail',
//       kbd: fitFillThumbnail,
//       key: 'project_library_thumbnail',
//       keywords: ['thumbnail', 'fit', 'fill'],
//       description: '',
//       commandType: 'project_page',
//       hasRightSection: true
//     }
//   ];

//   const allSearchCommands = useMemo(() => {
//     if (library || folder) {
//       if (selectedItems.length > 0) {
//         return [...globalSearchCommands, ...librarySearchCommands];
//       } else {
//         return [
//           ...globalSearchCommands,
//           ...librarySearchCommands.filter((command) => !command?.needsSelectedItems)
//         ];
//       }
//     } else if (asset) {
//       return [...globalSearchCommands, ...reviewSearchCommands];
//     } else if (projects) {
//       return [...globalSearchCommands, ...projectsSearchCommands];
//     } else if (singleProject) {
//       return [...globalSearchCommands, ...projectsPageCommands];
//     } else if (projectFiles || projectFolders) {
//       return [...globalSearchCommands, ...projectsPageCommands, ...projectLibraryCommands];
//     } else {
//       return globalSearchCommands;
//     }
//   }, [library, folder, asset, projects, singleProject, projectFolders, projectFiles]);

//   const userManagementAllUsersPageCommands: Command[] = [
//     {
//       label: 'Invite User',
//       kbd: inviteUser,
//       key: 'invite_user',
//       description: '',
//       commandType: 'user_management'
//     },
//     {
//       label: 'Create Workspace',
//       kbd: createWorkspace,
//       key: 'create_workspace',
//       description: '',
//       commandType: 'user_management'
//     },
//     {
//       label: 'Create Security Group',
//       kbd: createSecurityGroup,
//       key: 'create_security_group',
//       description: '',
//       commandType: 'user_management'
//     },
//     {
//       label: 'Add to security groups',
//       kbd: addToSecurityGroups,
//       key: 'add_to_security_groups',
//       description: '',
//       commandType: 'user_management',
//       needsSelectedItems: true
//     },
//     {
//       label: 'Add to workspace',
//       kbd: addToWorkspace,
//       key: 'add_to_workspace',
//       description: '',
//       commandType: 'user_management',
//       needsSelectedItems: true
//     },
//     {
//       label: 'Download workspace users',
//       kbd: downloadWorkspaceUsers,
//       key: 'download_csv',
//       description: '',
//       commandType: 'user_management',
//       needsSelectedItems: true
//     }
//   ];

//   const userManagementWorkspacesPageCommands: Command[] = [
//     {
//       label: 'Add to team',
//       kbd: addToTeam,
//       key: 'add_to_team',
//       description: '',
//       commandType: 'user_management',
//       needsSelectedItems: true
//     },
//     {
//       label: 'Download workspace users',
//       kbd: downloadWorkspaceUsers,
//       key: 'download_csv',
//       description: '',
//       commandType: 'user_management'
//     },
//     {
//       label: 'Create new team',
//       kbd: createNewTeam,
//       key: 'create_new_team',
//       description: '',
//       commandType: 'user_management'
//     }
//   ];

//   const globalCommandsForUserManagement: Command[] = [
//     {
//       label: 'Go to',
//       description: 'Navigate anywhere in the product',
//       kbd: navigate,
//       key: 'navigate',
//       commandType: 'global',
//       id: 'navigate'
//     }
//   ];

//   const userManagementHiddenCommands: Command[] = [
//     {
//       label: 'Report',
//       kbd: [],
//       hasRightSection: true,
//       key: 'bug_report',
//       description: 'Report a bug',
//       commandType: 'hidden',
//       keywords: ['bugs', 'report', 'feedback', 'crash', 'bug', 'issue']
//     },
//     ...hiddenCommands.filter((command) => command.key.startsWith('navigate'))
//   ];

//   const goBackCommand: Command = useMemo(() => {
//     // Return early if no last route
//     if (!lastProductRoute) return undefined;

//     const routes = {
//       review: {
//         pattern: '/library/asset',
//         label: 'Go back to review'
//       },
//       library: {
//         pattern: '/library',
//         label: 'Go back to library'
//       },
//       settings: {
//         pattern: '/settings',
//         label: 'Go back to settings'
//       },
//       // views: {
//       //   pattern: '/views',
//       //   label: 'Go back to AI views'
//       // },
//       projects: {
//         pattern: '/projects',
//         label: 'Go back to projects'
//       }
//     };

//     // Find the matching route based on the lastProductRoute
//     const matchedRoute = Object.values(routes).find((route) =>
//       lastProductRoute.includes(route.pattern)
//     );

//     if (matchedRoute) {
//       return {
//         label: matchedRoute.label,
//         commandType: 'hidden',
//         description: 'Go back',
//         key: 'go_back',
//         kbd: []
//       } as Command;
//     }

//     return {
//       label: 'Library',
//       commandType: 'hidden',
//       description: 'Go back',
//       key: 'go_back',
//       kbd: []
//     };
//   }, [lastProductRoute]) as Command; // Only depend on lastProductRoute

//   const commandsForUserManagement = useMemo(() => {
//     let commandsToShow: Command[] = [];

//     if (admin) {
//       if (selectedAllUsers.length > 0) {
//         commandsToShow = [
//           goBackCommand,
//           ...globalCommandsForUserManagement,
//           ...userManagementAllUsersPageCommands
//         ];
//       } else {
//         commandsToShow = [
//           goBackCommand,
//           ...globalCommandsForUserManagement,
//           ...userManagementAllUsersPageCommands.filter((command) => !command?.needsSelectedItems)
//         ];
//       }
//     }

//     if (workspaces) {
//       if (selectedWorkspaceUsers.length > 0) {
//         commandsToShow = [
//           goBackCommand,
//           ...globalCommandsForUserManagement,
//           ...userManagementAllUsersPageCommands,
//           ...userManagementWorkspacesPageCommands
//         ];
//       } else {
//         commandsToShow = [
//           goBackCommand,
//           ...globalCommandsForUserManagement,
//           ...userManagementAllUsersPageCommands,
//           ...userManagementWorkspacesPageCommands
//         ].filter((command) => !command?.needsSelectedItems);
//       }
//     }

//     if (team) {
//       commandsToShow = [];
//     }
//     return commandsToShow;
//   }, [
//     admin,
//     workspaces,
//     team,
//     selectedAllUsers,
//     selectedWorkspaceUsers,
//     asset,
//     library,
//     settings,
//     views,
//     projects,
//     goBackCommand
//   ]);

//   const filteredCommandsForUserManagement = useMemo(() => {
//     if (userManagementSearchInput.length > 0) {
//       const visibleCommands = commandsForUserManagement?.filter((command) => {
//         const labelMatch = command?.label
//           ?.toLowerCase()
//           ?.includes(userManagementSearchInput?.toLowerCase());
//         return labelMatch;
//       });

//       // Add hidden commands when search query is present
//       const hiddenCommands = userManagementHiddenCommands.filter((command) => {
//         const labelMatch =
//           command?.label?.toLowerCase()?.includes(userManagementSearchInput?.toLowerCase()) ||
//           command?.keywords?.some((keyword) =>
//             userManagementSearchInput?.toLowerCase()?.includes(keyword)
//           );
//         return labelMatch;
//       });

//       return [...visibleCommands, ...hiddenCommands];
//     } else {
//       return commandsForUserManagement;
//     }
//   }, [userManagementSearchInput, commandsForUserManagement, userManagementHiddenCommands]);

//   return {
//     globalSearchCommands,
//     filteredGlobalSearchCommands,
//     hiddenCommands,
//     librarySearchCommands,
//     reviewSearchCommands,
//     projectsSearchCommands,
//     projectsPageCommands,
//     allSearchCommands,
//     userManagementAllUsersPageCommands,
//     userManagementWorkspacesPageCommands,
//     userManagementHiddenCommands,
//     commandsForUserManagement,
//     goBackCommand,
//     filteredCommandsForUserManagement,
//     globalCommandsForUserManagement,
//     projectLibraryCommands
//   };
// }

// export function useRightSectionForToggleCommands() {
//   const { view, setView, thumbnail, setThumbnail, aspectRatio, setAspectRatio } = useLibraryStore();
//   const { isFlattened, setIsFlattened } = useProjectLibraryFilterState();

//   const {
//     setProjectView: setProjectView,
//     projectView: projectsView,
//     setProjectLibraryView: setProjectLibraryView,
//     projectLibraryView: projectLibraryView,
//     thumbnail: projectLibraryThumbnail,
//     setThumbnail: setProjectLibraryThumbnail,
//     flattenFolders: projectLibraryFlattenFolders,
//     setFlattenFolders: setProjectLibraryFlattenFolders
//   } = useProjectStore();

//   const getRightSectionForToggleCommands = (commandKey: CommandKey) => {
//     switch (commandKey) {
//       case 'view': {
//         return (
//           <Tabs
//             selectedKey={view}
//             onSelectionChange={(key: Key) => setView(key as View)}
//             aria-label="view"
//             size="sm"
//           >
//             <Tab
//               key="grid"
//               title={<LayoutWindow className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//             <Tab
//               key="list"
//               title={<LayoutThird className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//           </Tabs>
//         );
//       }

//       case 'fit_fill_thumbnail': {
//         return (
//           <Tabs
//             selectedKey={thumbnail}
//             onSelectionChange={(key: Key) => setThumbnail(key as Thumbnail)}
//             aria-label="thumbnail"
//             size="sm"
//           >
//             <Tab key="fill" title={'Fill'}></Tab>
//             <Tab key="fit" title={'Fit'}></Tab>
//           </Tabs>
//         );
//       }

//       case 'flatten_folder': {
//         return (
//           <Tabs
//             selectedKey={isFlattened ? 'true' : 'false'}
//             onSelectionChange={(key: Key) => setIsFlattened(key === 'true')}
//             aria-label="flatten folder"
//             size="sm"
//           >
//             <Tab key="true" title={'Flatten'}></Tab>
//             <Tab key="false" title={'Unflatten'}></Tab>
//           </Tabs>
//         );
//       }

//       case 'project_view': {
//         return (
//           <Tabs
//             selectedKey={projectsView}
//             onSelectionChange={(key: Key) => setProjectView(key as View)}
//             aria-label="project view"
//             size="sm"
//           >
//             <Tab
//               key="grid"
//               title={<LayoutWindow className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//             <Tab
//               key="list"
//               title={<LayoutThird className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//           </Tabs>
//         );
//       }

//       case 'project_library_view': {
//         return (
//           <Tabs
//             selectedKey={projectLibraryView}
//             onSelectionChange={(key: Key) => setProjectLibraryView(key as View)}
//             aria-label="project library view"
//             size="sm"
//           >
//             <Tab
//               key="grid"
//               title={<LayoutWindow className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//             <Tab
//               key="list"
//               title={<LayoutThird className="h-4 w-4 text-ds-text-secondary" size={20} />}
//             ></Tab>
//           </Tabs>
//         );
//       }

//       case 'project_library_thumbnail': {
//         return (
//           <Tabs
//             selectedKey={projectLibraryThumbnail}
//             onSelectionChange={(key: Key) => setProjectLibraryThumbnail(key as Thumbnail)}
//             aria-label="project library thumbnail"
//             size="sm"
//           >
//             <Tab key="fill" title={'Fill'}></Tab>
//             <Tab key="fit" title={'Fit'}></Tab>
//           </Tabs>
//         );
//       }

//       case 'project_library_flatten_folder': {
//         return (
//           <Tabs
//             selectedKey={projectLibraryFlattenFolders ? 'true' : 'false'}
//             onSelectionChange={(key: Key) => setProjectLibraryFlattenFolders(key === 'true')}
//             aria-label="project library flatten folder"
//             size="sm"
//           >
//             <Tab key="true" title={'Flatten'}></Tab>
//             <Tab key="false" title={'Unflatten'}></Tab>
//           </Tabs>
//         );
//       }

//       case 'aspect_ratio': {
//         return (
//           <Tabs
//             classNames={{ tab: 'h-7', tabList: 'bg-ds-button-secondary-bg' }}
//             aria-label="Aspect ratio options"
//             selectedKey={aspectRatio}
//             onSelectionChange={(key) => setAspectRatio(key as AspectRatio)}
//           >
//             <Tab
//               key="horizontal"
//               title={<div className="h-[9px] w-4 rounded-sm border-2 border-foreground"></div>}
//             ></Tab>
//             <Tab
//               key="vertical"
//               title={
//                 <div className="h-[9px] w-4 rounded-sm border-2 border-foreground rotate-90"></div>
//               }
//             ></Tab>
//           </Tabs>
//         );
//       }
//     }
//   };

//   return { getRightSectionForToggleCommands };
// }

// export const useAddToEditorTimeline = () => {
//   const api = useApi();

//   const getScrubInfo = async (videoId: string) => {
//     try {
//       const { data } = await api.get(`/api/v1/library/${videoId}/sprite_sheet`);
//       return data;
//     } catch (error) {
//       // toast.info('This video is still being processed', {
//       //   description: 'Please try again in a while to add this video to the timeline'
//       // });
//     }
//   };

//   const addVideoToTimeline = async ({
//     videoId,
//     url,
//     startTime,
//     endTime
//   }: {
//     videoId: string;
//     url: string;
//     startTime: number;
//     endTime: number;
//   }) => {
//     // setIsLoading(true);
//     try {
//       const scrubInfo = await getScrubInfo(videoId).catch(() => null);

//       // console.log('scrubInfo', scrubInfo);

//       dispatcher.dispatch(ADD_VIDEO, {
//         payload: {
//           id: nanoid(),
//           details: {
//             // src: data?.resourcetype === 'VideoFile' ? data?.url : '',
//             src: url,
//             sprite_sheet: scrubInfo?.sprite_sheet || '',
//             sprite_width: scrubInfo?.frame_width || 0,
//             sprite_height: scrubInfo?.frame_height || 0,
//             number_of_sprites: scrubInfo?.number_of_frames || 0,
//             sprite_rows: scrubInfo?.rows || 0,
//             sprite_columns: scrubInfo?.columns || 0,
//             start_time: startTime,
//             end_time: endTime
//           },
//           type: 'video',
//           metadata: {
//             resourceId: videoId
//           },
//           options: {
//             trackId: 'main'
//           },
//           display: {
//             from: 0,
//             to: (endTime - startTime) * 1000
//           },
//           trim: {
//             from: startTime * 1000,
//             to: endTime * 1000
//           }
//         }
//       });
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   return { addVideoToTimeline };
// };
