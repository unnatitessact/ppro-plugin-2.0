// 'use client';

// import React, { Suspense } from 'react';

// import { useRouter } from 'next/navigation';

// import { useLocalStorage } from '@mantine/hooks';
// import { motion } from 'framer-motion';

// import { ArrowLeft } from '@tessact/icons';

// import { NavLink } from '@/components/NavLink';
// import { transition } from '@/components/Sidebar';
// import WorkspacesTree from '@/components/user-management/sidebar/WorkspacesTree';

// import { userManagementLinks } from '@/data/links';

// const Sidebar = () => {
//   const router = useRouter();
//   const [lastProductRoute] = useLocalStorage({
//     key: 'last-product-route'
//   });

//   return (
//     <motion.div
//       id="usermanagement-sidebar"
//       className="flex h-full flex-col gap-3"
//       initial={{ opacity: 0, x: '-100%' }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: '-100%', position: 'absolute' }}
//       transition={transition}
//     >
//       <div id="usermanagement-sidebar-draggable-container" className="flex h-10 flex-col">
//         <div id="usermanagement-sidebar-draggable" className="hidden h-12 w-full" />
//         <div
//           className="flex h-10 w-full cursor-pointer items-center gap-2 px-3 py-2"
//           onPointerDown={() => {
//             router.push(lastProductRoute ?? '/library');
//           }}
//         >
//           <ArrowLeft size={20} />
//           <span className="text-sm font-medium">Back to product</span>
//         </div>
//       </div>
//       <motion.div layout>
//         {userManagementLinks.map((link) => (
//           <NavLink key={link.href} {...link} layoutIdPrefix="home" />
//         ))}
//       </motion.div>
//       <Suspense fallback={<div />}>
//         <WorkspacesTree />
//       </Suspense>
//     </motion.div>
//   );
// };

// export default Sidebar;
