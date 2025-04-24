// import { useRouter } from 'next/navigation';

// import { useHotkeys } from '@mantine/hooks';

// import { useSearchStore } from '@/stores/search-store';

// export const useNavigationHotkeys = () => {
//   const router = useRouter();

//   const { selectedCommand, setIsSearchOpen } = useSearchStore();

//   useHotkeys(
//     routeHotkeyMapping.map((callbackfn) => {
//       const [hotkey, route] = callbackfn;
//       return [
//         hotkey,
//         () => {
//           if (selectedCommand?.key === 'navigate') {
//             router.push(route);
//             setIsSearchOpen(false);
//           }
//         }
//       ];
//     })
//   );
// };

// const routeHotkeyMapping = [
//   ['C', '/settings/connections'],
//   ['D', '/settings/metadata-templates'],
//   ['G', '/settings/general'],
//   ['L', '/library'],
//   ['M', '/settings/members'],
//   ['P', '/projects'],
//   ['R', '/remixes'],
//   ['U', '/admin/users'],
//   ['V', '/views'],
//   ['W', '/settings/workflows']
// ];
