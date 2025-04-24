// import { parseAsJson, parseAsStringEnum, useQueryState } from 'nuqs';
// import { z } from 'zod';

// import { ProjectStatus } from '@/api-integration/types/projects';
// import { WorkflowTemplate } from '@/api-integration/types/workflow';

// import { Sort } from '@/stores/library-store';

// // Define types for project filters
// interface ProjectFilters {
//   archived: boolean;
//   workflow: WorkflowTemplate | null;
//   status: ProjectStatus | null;
// }

// // const projectFilterSchema = z.object({
// //   archived: z.boolean(),
// //   workflow: ,
// //   status: z.array(z.any()).nullable()
// // });

// const projectFilterSchema = z.object({
//   archived: z.boolean(),
//   workflow: z
//     .object({
//       id: z.string(),
//       name: z.string()
//     })
//     .nullable(),
//   status: z
//     .object({
//       id: z.string(),
//       name: z.string()
//     })
//     .nullable()
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

// export function useProjectDashboardFilterParams() {
//   // Project Filters
//   const [projectFilters, setProjectFilters] = useQueryState(
//     'projectFilters',
//     // @ts-expect-error - TODO: fix this
//     parseAsJson<ProjectFilters>((rawValue: unknown) => {
//       try {
//         return projectFilterSchema.parse(rawValue);
//       } catch (error) {
//         console.error('Project filter schema validation error:', error);
//         return {
//           archived: false,
//           workflow: null,
//           status: null
//         };
//       }
//     }).withDefault({
//       archived: false,
//       workflow: null,
//       status: null
//     })
//   );

//   // Filter Type (all/any)
//   const [filterType, setFilterType] = useQueryState(
//     'projectFilterType',
//     parseAsStringEnum(['all', 'any'] as const).withDefault('all')
//   );

//   // Sorts
//   const [sorts, setSorts] = useQueryState(
//     'projectSorts',
//     parseAsJson<Sort[]>((rawValue: unknown) => {
//       try {
//         return sortSchema.parse(rawValue);
//       } catch (error) {
//         console.error('Sort schema validation error:', error);
//         return [];
//       }
//     }).withDefault([])
//   );

//   // Project Filter Methods
//   const updateProjectFilters = (newFilters: Partial<ProjectFilters>) => {
//     setProjectFilters({
//       ...projectFilters,
//       ...newFilters
//     });
//   };

//   const clearProjectFilters = () => {
//     setProjectFilters({
//       archived: false,
//       workflow: null,
//       status: null
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
//     // Project Filters
//     projectFilters,
//     updateProjectFilters,
//     clearProjectFilters,
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
