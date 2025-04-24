// import { useMemo } from 'react';

// import { useRouter } from 'next/navigation';

// import { useTheme } from 'next-themes';

// import { usePreferencesStore } from '@/stores/preferences-store';
// import { useSearchStore } from '@/stores/search-store';

// import { HiddenCommandKey } from '@/utils/searchUtils';

// import { useSearchCommands } from './useSearch';

// export const useNavigationCommands = ({
//   searchInput
// }: {
//   searchInput: string;
//   searchQuery: string;
// }) => {
//   const { theme, setTheme } = useTheme();

//   const { setIsSearchOpen, reset, setShowBugReportPage, setIsSecondarySearchOpen } =
//     useSearchStore();

//   const router = useRouter();

//   const { setIsPreferencesModalOpen } = usePreferencesStore();

//   const { hiddenCommands } = useSearchCommands();

//   const navigationItems = useMemo(
//     () =>
//       hiddenCommands
//         ?.filter(
//           (command) =>
//             command.key.startsWith('navigate') &&
//             command?.keywords?.some((word) => word.includes(searchInput))
//         )
//         .sort((a, b) => {
//           const matchesA = a?.keywords?.filter((word) => word.includes(searchInput)).length ?? 0;
//           const matchesB = b?.keywords?.filter((word) => word.includes(searchInput)).length ?? 0;
//           return matchesB - matchesA;
//         }) ?? [],
//     [searchInput]
//   );

//   const navigationCommandActions = (command: HiddenCommandKey, callback?: () => void) => {
//     switch (command) {
//       case 'appearance':
//         setTheme(theme === 'dark' ? 'light' : 'dark');
//         break;
//       case 'dark_mode':
//         setTheme('dark');
//         break;

//       case 'navigate_to_settings':
//         router.push('/settings');

//         break;

//       case 'bug_report':
//         setShowBugReportPage(true);
//         setIsSecondarySearchOpen(true);
//         break;

//       case 'light_mode':
//         setTheme('light');
//         break;

//       case 'navigate_to_library':
//         router.push('/library');
//         break;
//       case 'navigate_to_user_management':
//         router.push('/admin/users');

//         break;
//       case 'navigate_to_project':
//         router.push('/projects');

//         break;
//       case 'navigate_to_views':
//         router.push('/views');

//         break;
//       case 'navigate_to_remixes':
//         router.push('/remixes');

//         break;
//       case 'navigate_to_workspace_connections':
//         router.push('/settings/connections');

//         break;
//       case 'navigate_to_workspace_members':
//         router.push('/settings/members');

//         break;
//       case 'navigate_to_workspace_metadata_templates':
//         router.push('/settings/metadata-templates');

//         break;
//       case 'navigate_to_workspace_teams':
//         router.push('/settings/teams');

//         break;
//       case 'navigate_to_workspace_workflows':
//         router.push('/settings/workflows');

//         break;
//       case 'navigate_to_preferences':
//         setIsPreferencesModalOpen(true);
//         break;
//     }

//     setIsSearchOpen(false);
//     reset();
//     callback?.();
//   };

//   return { navigationCommandActions, navigationItems };
// };
