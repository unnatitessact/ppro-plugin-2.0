// 'use client';

// import { useRef, useState } from 'react';

// import { cn } from '@nextui-org/react';
// import { motion } from 'framer-motion';
// import { nanoid } from 'nanoid';
// import Select, { SelectInstance } from 'react-select';

// import { CalendarDays, TextSize } from '@tessact/icons';

// import { Button } from '@/components/ui/Button';

// import { DateSortPill, NameSortPill } from '@/components/library/filters/pills';

// import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

// import { Sort } from '@/stores/library-store';

// const sortPillComponents = {
//   name: NameSortPill,
//   date: DateSortPill
// };

// const options: Sort[] = [
//   {
//     id: 'created_date',
//     label: 'Created date',
//     key: 'created_on',
//     direction: 'asc',
//     type: 'date'
//   },
//   {
//     id: 'modified_date',
//     label: 'Modified date',
//     key: 'modified_on',
//     direction: 'asc',
//     type: 'date'
//   },
//   {
//     id: 'file_name',
//     label: 'File Name',
//     key: 'name',
//     direction: 'asc',
//     type: 'name'
//   },
//   {
//     id: 'created_by',
//     label: 'Created by',
//     key: 'created_by__profile__display_name',
//     direction: 'asc',
//     type: 'name'
//   }
// ];

// export const getIconFromType = (type: Sort['type']) => {
//   switch (type) {
//     case 'name':
//       return <TextSize size={20} />;
//     case 'date':
//       return <CalendarDays size={20} />;
//     default:
//       return null;
//   }
// };

// const renderSortPillComponent = (sort: Sort, order: number) => {
//   const SortPillComponent = sortPillComponents[sort.type];
//   return SortPillComponent ? <SortPillComponent key={sort.id} sort={sort} order={order} /> : null;
// };

// export const SortBar = () => {
//   const { clearSorts, addSort, sorts, removeSort } = useLibraryFilterState();

//   const [input, setInput] = useState('');

//   const inputRef =
//     useRef<SelectInstance<{ label: string; value: string; type: Sort['type'] } | null>>(null);

//   return (
//     <motion.div
//       layout="position"
//       initial={{ y: -10, opacity: 0 }}
//       animate={{
//         y: 0,
//         opacity: 1,
//         transition: { duration: 0.2, delay: 0.1, ease: 'easeOut' }
//       }}
//       exit={{
//         y: -10,
//         opacity: 0,
//         transition: { duration: 0.2, ease: 'easeOut' }
//       }}
//       onAnimationComplete={() => {
//         inputRef.current?.focus();
//       }}
//       className="pr-6"
//     >
//       <div
//         className={cn(
//           'flex items-center justify-between gap-2',
//           'rounded-2xl bg-ds-filter-bar-bg',
//           'py-1.5 pl-4 pr-2'
//         )}
//       >
//         <div className="flex flex-1 cursor-text items-center gap-3">
//           <p className="text-sm font-medium text-ds-filter-bar-label">Sort by</p>
//           <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
//             {sorts.map((sort, index) => renderSortPillComponent(sort, index + 1))}
//             <Select
//               onKeyDown={(e) => {
//                 if (e.key === 'Backspace' && input.length === 0 && sorts.length > 0) {
//                   const lastSort = sorts[sorts.length - 1];
//                   if (lastSort) {
//                     removeSort(lastSort.id);
//                   }
//                 }
//               }}
//               controlShouldRenderValue={false}
//               inputValue={input}
//               onInputChange={(value) => setInput(value)}
//               unstyled
//               placeholder=""
//               options={options.map((option) => ({
//                 label: option.label,
//                 value: option.key,
//                 type: option.type
//               }))}
//               openMenuOnFocus
//               ref={inputRef}
//               classNames={{
//                 dropdownIndicator: () => '!hidden',
//                 input: () => 'min-w-60',
//                 menuPortal: () => '!z-100',
//                 menu: () => 'p-0 bg-ds-menu-bg border-ds-menu-border border rounded-xl !z-[100]',
//                 menuList: () => 'bg-ds-menu-bg p-2 rounded-xl space-y-1',
//                 option: ({ isFocused }) =>
//                   `py-1.5 px-2 !cursor-pointer !font-karla !font-medium rounded-lg !text-sm ${isFocused ? 'bg-ds-menu-bg-hover' : ''}`,
//                 placeholder: () => 'text-sm text-ds-input-placeholder',
//                 valueContainer: () => 'text-sm'
//               }}
//               formatOptionLabel={(data) => {
//                 return (
//                   <div className="flex items-center gap-1">
//                     {data?.type && getIconFromType(data.type)}
//                     <span>{data?.label}</span>
//                   </div>
//                 );
//               }}
//               onChange={(data) => {
//                 addSort({
//                   id: nanoid(),
//                   type: data?.type || 'name',
//                   label: data?.label || '',
//                   key: data?.value || '',
//                   direction: data?.type === 'date' ? 'desc' : 'asc'
//                 });
//               }}
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           {sorts.length > 0 && (
//             <>
//               <div className="flex items-center space-x-2">
//                 <Button color="secondary" size="sm" onPress={clearSorts} aria-label="Clear sorts">
//                   Clear
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };
