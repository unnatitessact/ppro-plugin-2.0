// import type { FieldOption } from '@/api-integration/types/metadata';
// import type { FolderFilterState } from '@/stores/library-filter-store';

// import { useCallback, useEffect, useMemo } from 'react';

// import { useParams, usePathname } from 'next/navigation';

// import { parseAsBoolean, parseAsJson, parseAsStringEnum, useQueryState } from 'nuqs';
// import { z } from 'zod';

// import { MetadataFieldType } from '@/api-integration/types/metadata';

// import { useFilterStore } from '@/stores/library-filter-store';
// import { Filter, Sort } from '@/stores/library-store';

// const metadataFieldTypeEnum = z.enum([
//   'text',
//   'number',
//   'date',
//   'text_area',
//   'person',
//   'location',
//   'timecode',
//   'timecode_range',
//   'select',
//   'multiselect',
//   'rating',
//   'toggle',
//   'attachment',
//   'file_status',
//   'tagging_status'
// ] as const satisfies readonly MetadataFieldType[]) as z.ZodType<MetadataFieldType>;

// const fieldOptionSchema: z.ZodType<FieldOption> = z.object({
//   id: z.string(),
//   label: z.string(),
//   value: z.string()
// });

// const filterSchema = z.array(
//   z.object({
//     id: z.string(),
//     key: z.string().optional(),
//     label: z.string(),
//     type: metadataFieldTypeEnum,
//     value: z.string().nullable(),
//     operator: z.string().nullable(),
//     isStatic: z.boolean().optional(),
//     options: z.array(fieldOptionSchema)
//   })
// );

// const sortSchema = z.array(
//   z.object({
//     id: z.string(),
//     label: z.string(),
//     key: z.string(),
//     direction: z.enum(['asc', 'desc']),
//     type: z.enum(['date', 'name'])
//   })
// );

// // Schema for the current folder filter state in URL
// const currentFilterStateSchema = z.object({
//   filters: filterSchema.optional(),
//   sorts: sortSchema.optional(),
//   searchQuery: z.string().optional()
// });

// const parseCurrentFilterState = parseAsJson<z.infer<typeof currentFilterStateSchema>>(
//   (rawValue: unknown) => {
//     try {
//       return currentFilterStateSchema.parse(rawValue);
//     } catch (error) {
//       console.error('Current filter state schema validation error:', error);
//       return { filters: [], sorts: [], searchQuery: '' };
//     }
//   }
// ).withDefault({ filters: [], sorts: [], searchQuery: '' });

// export const useLibraryFilterState = () => {
//   // Global states in URL
//   const [filterMatchType, setFilterMatchType] = useQueryState(
//     'match_type',
//     parseAsStringEnum(['all', 'any'] as const).withDefault('all')
//   );

//   const [isFlattened, setIsFlattened] = useQueryState(
//     'flattened',
//     parseAsBoolean.withDefault(false)
//   );

//   // Current folder filter state in URL
//   const [currentFilterState, setCurrentFilterState] = useQueryState(
//     'filterState',
//     parseCurrentFilterState
//   );

//   // Access the Zustand store
//   const { folderStates, updateFolderState } = useFilterStore();

//   // Determine current folder ID and check if we're on a library page
//   const params = useParams();
//   const pathname = usePathname();

//   const isLibraryPage = useMemo(() => {
//     return pathname === '/library' || pathname.startsWith('/library/folder/');
//   }, [pathname]);

//   const currentFolderId = useMemo(() => {
//     if (pathname.startsWith('/library/folder/') && params?.folderId) {
//       return params.folderId as string;
//     }
//     return 'root';
//   }, [pathname, params]);

//   // Sync URL state with store when folder changes
//   useEffect(() => {
//     if (!isLibraryPage) {
//       // Clear URL params when not on library pages
//       setCurrentFilterState({
//         filters: [],
//         sorts: [],
//         searchQuery: ''
//       });
//       return;
//     }

//     // When folder changes, check store first
//     if (folderStates[currentFolderId]) {
//       // If this folder has stored state, use it for URL
//       setCurrentFilterState(folderStates[currentFolderId]);
//     } else {
//       // New folder with no stored state - clear URL params
//       setCurrentFilterState({
//         filters: [],
//         sorts: [],
//         searchQuery: ''
//       });
//     }
//   }, [currentFolderId, folderStates, setCurrentFilterState, isLibraryPage]);

//   // Update both store and URL when filter state changes
//   const updateFilterState = useCallback(
//     (updater: (state: FolderFilterState) => FolderFilterState) => {
//       // Update the Zustand store (always update store regardless of page)
//       updateFolderState(currentFolderId, updater);

//       // Only update URL query params on library pages
//       if (isLibraryPage) {
//         setCurrentFilterState((prev) => {
//           const stateToUpdate = {
//             filters: prev.filters || [],
//             sorts: prev.sorts || [],
//             searchQuery: prev.searchQuery || ''
//           };
//           return updater(stateToUpdate);
//         });
//       }
//     },
//     [currentFolderId, updateFolderState, setCurrentFilterState, isLibraryPage]
//   );

//   // Filter operations
//   const addFilter = useCallback(
//     (filter: Filter) => {
//       updateFilterState((state) => ({
//         ...state,
//         filters: [...state.filters, filter]
//       }));
//     },
//     [updateFilterState]
//   );

//   const removeFilter = useCallback(
//     (filterId: string) => {
//       updateFilterState((state) => ({
//         ...state,
//         filters: state.filters.filter((f) => f.id !== filterId)
//       }));
//     },
//     [updateFilterState]
//   );

//   const modifyFilter = useCallback(
//     (filterId: string, filter: Filter) => {
//       updateFilterState((state) => ({
//         ...state,
//         filters: state.filters.map((f) => (f.id === filterId ? filter : f))
//       }));
//     },
//     [updateFilterState]
//   );

//   const clearFilters = useCallback(() => {
//     updateFilterState((state) => ({
//       ...state,
//       filters: []
//     }));
//   }, [updateFilterState]);

//   // Sort operations
//   const addSort = useCallback(
//     (sort: Sort) => {
//       updateFilterState((state) => ({
//         ...state,
//         sorts: [...state.sorts, sort]
//       }));
//     },
//     [updateFilterState]
//   );

//   const removeSort = useCallback(
//     (sortId: string) => {
//       updateFilterState((state) => ({
//         ...state,
//         sorts: state.sorts.filter((s) => s.id !== sortId)
//       }));
//     },
//     [updateFilterState]
//   );

//   const modifySort = useCallback(
//     (sortId: string, sort: Sort) => {
//       updateFilterState((state) => ({
//         ...state,
//         sorts: state.sorts.map((s) => (s.id === sortId ? sort : s))
//       }));
//     },
//     [updateFilterState]
//   );

//   const clearSorts = useCallback(() => {
//     updateFilterState((state) => ({
//       ...state,
//       sorts: []
//     }));
//   }, [updateFilterState]);

//   // Search operations
//   const setSearch = useCallback(
//     (searchQuery: string) => {
//       updateFilterState((state) => ({
//         ...state,
//         searchQuery
//       }));
//     },
//     [updateFilterState]
//   );

//   return {
//     filters: currentFilterState.filters || [],
//     setFilters: (filters: Filter[]) => {
//       updateFilterState((state) => ({
//         ...state,
//         filters
//       }));
//     },
//     filterMatchType,
//     setFilterMatchType,
//     addFilter,
//     removeFilter,
//     modifyFilter,
//     clearFilters,
//     sorts: currentFilterState.sorts || [],
//     setSorts: (sorts: Sort[]) => {
//       updateFilterState((state) => ({
//         ...state,
//         sorts
//       }));
//     },
//     addSort,
//     removeSort,
//     modifySort,
//     clearSorts,
//     search: currentFilterState.searchQuery || '',
//     setSearch,
//     isFlattened,
//     setIsFlattened,
//     currentFolderId
//   };
// };
