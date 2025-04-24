// import { parseAsJson, parseAsStringEnum, useQueryState } from 'nuqs';
// import { z } from 'zod';

// import { User } from '@/api-integration/types/auth';
// import { TaskStatus } from '@/api-integration/types/projects';
// import { Team } from '@/api-integration/types/user-management';
// import { WorkflowTemplate } from '@/api-integration/types/workflow';

// import { Sort } from '@/stores/library-store';

// // Define types for task filters
// interface TaskFilters {
//   isBlocked: boolean;
//   isBlocking: boolean;
//   assignedUser: User | null;
//   team: Team | null;
//   status: TaskStatus[] | null;
//   stepType: string;
//   workflow: WorkflowTemplate[] | null;
// }

// const taskFilterSchema = z.object({
//   isBlocked: z.boolean(),
//   isBlocking: z.boolean(),
//   assignedUser: z.any().nullable(),
//   team: z.any().nullable(),
//   status: z.array(z.any()).nullable(),
//   stepType: z.string(),
//   workflow: z.array(z.any()).nullable()
// });

// const sortSchema = z.array(
//   z.object({
//     id: z.string(),
//     label: z.string(),
//     key: z.string(),
//     direction: z.enum(['asc', 'desc']),
//     type: z.enum(['date', 'name'])
//   })
// );

// export function useTaskFilterStateParams() {
//   // Task Filters
//   const [taskFilters, setTaskFilters] = useQueryState(
//     'taskFilters',
//     // @ts-expect-error - TODO: fix this
//     parseAsJson<TaskFilters>((rawValue: unknown) => {
//       try {
//         return taskFilterSchema.parse(rawValue);
//       } catch (error) {
//         console.error('Task filter schema validation error:', error);
//         return {
//           isBlocked: false,
//           isBlocking: false,
//           assignedUser: null,
//           team: null,
//           status: null,
//           stepType: '',
//           workflow: null
//         };
//       }
//     }).withDefault({
//       isBlocked: false,
//       isBlocking: false,
//       assignedUser: null,
//       team: null,
//       status: null,
//       stepType: '',
//       workflow: null
//     })
//   );

//   // Filter Type (all/any)
//   const [filterType, setFilterType] = useQueryState(
//     'filterType',
//     parseAsStringEnum(['all', 'any'] as const).withDefault('all')
//   );

//   // Sorts
//   const [sorts, setSorts] = useQueryState(
//     'taskSorts',
//     parseAsJson<Sort[]>((rawValue: unknown) => {
//       try {
//         return sortSchema.parse(rawValue);
//       } catch (error) {
//         console.error('Sort schema validation error:', error);
//         return [];
//       }
//     }).withDefault([])
//   );

//   // Task Filter Methods
//   const updateTaskFilters = (newFilters: Partial<TaskFilters>) => {
//     setTaskFilters({ ...taskFilters, ...newFilters });
//   };

//   const clearTaskFilters = () => {
//     setTaskFilters({
//       isBlocked: false,
//       isBlocking: false,
//       assignedUser: null,
//       team: null,
//       status: null,
//       stepType: '',
//       workflow: null
//     });
//   };

//   // Sort Methods
//   const addSort = (sort: Sort) => {
//     const currentSorts = sorts || [];
//     setSorts([...currentSorts, sort]);
//   };

//   const removeSort = (sortId: string) => {
//     const currentSorts = sorts || [];
//     setSorts(currentSorts.filter((s) => s.id !== sortId));
//   };

//   const modifySort = (sortId: string, sort: Sort) => {
//     const currentSorts = sorts || [];
//     setSorts(currentSorts.map((s) => (s.id === sortId ? sort : s)));
//   };

//   const clearSorts = () => {
//     setSorts([]);
//   };

//   return {
//     // Task Filters
//     taskFilters,
//     updateTaskFilters,
//     clearTaskFilters,
//     filterType,
//     setFilterType,
//     // Sorts
//     sorts: sorts || [],
//     addSort,
//     removeSort,
//     modifySort,
//     clearSorts
//   };
// }
