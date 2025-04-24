// 'use client';

// import React from 'react';

// import { Tab, Tabs } from '@/components/ui/Tabs';

// import { RoleType } from '@/types/user-management';

// const tabs: { key: RoleType; title: string }[] = [
//   {
//     key: 'organization',
//     title: 'Organization'
//   },
//   {
//     key: 'workspace',
//     title: 'Workspace'
//   },
//   {
//     key: 'team',
//     title: 'Team'
//   }
// ];

// const RolesPageTabs = ({
//   selected,
//   setSelected
// }: {
//   selected: RoleType;
//   setSelected: (value: RoleType) => void;
// }) => {
//   return (
//     <Tabs aria-label="Options" selectedKey={selected}>
//       {tabs.map((tab) => (
//         <Tab
//           key={tab.key}
//           title={tab.title}
//           onPointerDown={() => setSelected(tab.key as RoleType)}
//         />
//       ))}
//     </Tabs>
//   );
// };

// export default RolesPageTabs;
