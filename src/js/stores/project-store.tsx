import { create } from "zustand";

import { ProjectTaskFilter } from "../api-integration/queries/projects";
import {
  LibraryAsset,
  Project,
  ProjectMember,
  Task,
  TaskStatus,
} from "../api-integration/types/projects";
import {
  Team,
  UserWithWorkspaceAndRole,
} from "../api-integration/types/user-management";
import { WorkflowTemplate } from "../api-integration/types/workflow";

import { AspectRatio, Sort, Thumbnail, View } from "../stores/library-store";

import { Project as DummyProject } from "../api-integration/types/projects";

export const resources: DummyProject[] = [
  {
    id: "1",
    name: "Project Alpha",
    description: "This is a description of the project alpha",
    sub_contents: [
      {
        id: "1.1",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/c6cb6a32-7495-44ce-8ea7-83a06294a586/c6cb6a32-7495-44ce-8ea7-83a06294a586_thumbnail.avif",
      },
      {
        id: "1.2",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/4e4fbca3-64e0-4732-a90e-3466bc162adb/4e4fbca3-64e0-4732-a90e-3466bc162adb_thumbnail.avif",
      },
      {
        id: "1.3",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/91f02a40-fae1-46ff-8978-ed177e9ea9a3/91f02a40-fae1-46ff-8978-ed177e9ea9a3_thumbnail.avif",
      },
    ],
    status: "Not Started",
    completed_tasks: 0,
    total_tasks: 10,
    is_archived: false,
    due_date: null,
  },
  {
    id: "2",
    name: "Project Beta",
    description: "This is a description of the project beta",
    sub_contents: [
      {
        id: "2.1",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/c6cb6a32-7495-44ce-8ea7-83a06294a586/c6cb6a32-7495-44ce-8ea7-83a06294a586_thumbnail.avif",
      },
      {
        id: "2.2",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/4e4fbca3-64e0-4732-a90e-3466bc162adb/4e4fbca3-64e0-4732-a90e-3466bc162adb_thumbnail.avif",
      },
    ],
    status: "In Progress",
    completed_tasks: 1,
    total_tasks: 10,
    is_archived: false,
    due_date: null,
    members: [
      {
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
  },
  {
    id: "3",
    name: "Project Omega",
    description: "This is a description of the project omega",
    sub_contents: [
      {
        id: "3.1",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/c6cb6a32-7495-44ce-8ea7-83a06294a586/c6cb6a32-7495-44ce-8ea7-83a06294a586_thumbnail.avif",
      },
    ],
    status: "In Progress",
    completed_tasks: 3,
    total_tasks: 10,
    is_archived: false,
    due_date: null,
    members: [
      {
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
  },
  {
    id: "4",
    name: "Project Genesis",
    description: "This is a description of the project genesis",
    sub_contents: [
      {
        id: "4.1",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/c6cb6a32-7495-44ce-8ea7-83a06294a586/c6cb6a32-7495-44ce-8ea7-83a06294a586_thumbnail.avif",
      },
      {
        id: "4.2",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/4e4fbca3-64e0-4732-a90e-3466bc162adb/4e4fbca3-64e0-4732-a90e-3466bc162adb_thumbnail.avif",
      },
      {
        id: "4.3",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/91f02a40-fae1-46ff-8978-ed177e9ea9a3/91f02a40-fae1-46ff-8978-ed177e9ea9a3_thumbnail.avif",
      },
    ],
    status: "Completed",
    completed_tasks: 10,
    total_tasks: 10,
    is_archived: false,
    due_date: null,
    members: [
      {
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        first_name: "Albert",
        last_name: "Einstein",
        display_name: "Albert Einstein",
        profile_picture: "https://randomuser.me/api/portraits/men/2.jpg",
      },
    ],
  },
  {
    id: "5",
    name: "Project Nemesis",
    description: "This is a description of the project nemesis",
    sub_contents: [
      {
        id: "5.1",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/c6cb6a32-7495-44ce-8ea7-83a06294a586/c6cb6a32-7495-44ce-8ea7-83a06294a586_thumbnail.avif",
      },
      {
        id: "5.2",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/4e4fbca3-64e0-4732-a90e-3466bc162adb/4e4fbca3-64e0-4732-a90e-3466bc162adb_thumbnail.avif",
      },
      {
        id: "5.3",
        type: "video",
        thumbnail:
          "https://assets.tessact.com/thumbnails/76dbcbfe-f1b4-41ad-a22d-8f125678b365/91f02a40-fae1-46ff-8978-ed177e9ea9a3/91f02a40-fae1-46ff-8978-ed177e9ea9a3_thumbnail.avif",
      },
    ],
    status: "Completed",
    completed_tasks: 10,
    total_tasks: 10,
    is_archived: false,
    due_date: null,
    members: [
      {
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        profile_picture: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        display_name: "Jane Doe",
        profile_picture: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
  },
];

export const dummyMetadata = [
  {
    id: "a510a1ea-3d96-47eb-abae-a6745d8736e5",
    field_membership: {
      id: "cc1c9371-3a42-4169-94df-181ef4f4c90a",
      order: 0,
      field: {
        id: "635945cd-2c57-4b6d-a6b0-5b83505c90ca",
        name: "Series Title",
        field_type: "text",
      },
      options: [],
    },
    value: "",
  },
  {
    id: "82281a7b-da05-46ae-92ac-e249cba71734",
    field_membership: {
      id: "fed96b25-463f-4f28-9cba-9c415da4f123",
      order: 1,
      field: {
        id: "6f61dbe9-7536-46dc-bb64-a226a14c68f9",
        name: "Directed by",
        field_type: "person",
      },
      options: [],
    },
    value: {},
  },
  {
    id: "a7d2bed3-ab07-4bcc-9445-38a6835961d6",
    field_membership: {
      id: "31b4038b-0c87-4cb9-aaa5-94ca7087c5bd",
      order: 3,
      field: {
        id: "95b1a4c8-c1bf-4893-aa06-5b8e19e15951",
        name: "Shooting Location",
        field_type: "location",
      },
      options: [],
    },
    value: {},
  },
  {
    id: "da55c05a-9d49-452d-bf1a-6ac115b9fa4c",
    field_membership: {
      id: "8a0039b8-67bc-4d2d-a86f-af4cbcd49384",
      order: 5,
      field: {
        id: "02a87173-24b3-47b6-9905-d3eebeee74d7",
        name: "Description",
        field_type: "text_area",
      },
      options: [],
    },
    value: "",
  },
  {
    id: "898c020e-47e2-4bb8-a95d-e46d8ae89119",
    field_membership: {
      id: "ce53e361-9560-424e-8eaf-0e42f5a3d30b",
      order: 7,
      field: {
        id: "cfa843ae-4a0a-4821-8104-6330207915cb",
        name: "Air Date",
        field_type: "date",
      },
      options: [],
    },
    value: "",
  },
  {
    id: "25ce3207-c9f1-4c5f-bc6e-8155771d9015",
    field_membership: {
      id: "b183df6d-518c-406e-8623-3dfe12458ac0",
      order: 8,
      field: {
        id: "ed44d534-e7bd-431b-bf3d-1333f598d572",
        name: "Genre",
        field_type: "multiselect",
      },
      options: [],
    },
    value: [],
  },
  {
    id: "da414752-e84a-4344-ad9b-fe50a7b1dd89",
    field_membership: {
      id: "c2c8b5d7-b199-4edc-ac71-44327c52b085",
      order: 9,
      field: {
        id: "f31fff07-cc6c-451d-8960-a23459b7dc7e",
        name: "Censorship",
        field_type: "select",
      },
      options: [],
    },
    value: "",
  },
  {
    id: "224d47a2-b828-43b9-b007-4072554e1e4c",
    field_membership: {
      id: "11683947-11fa-40bc-974e-c1b16d42a9a1",
      order: 10,
      field: {
        id: "748a15b9-f4dc-4673-8ce6-a8fcb0965679",
        name: "Runtime",
        field_type: "timecode",
      },
      options: [],
    },
    value: "",
  },
  {
    id: "f27e5334-ec06-471a-902e-308b0ae39985",
    field_membership: {
      id: "e726deec-98c7-4d26-b93c-365629433ca8",
      order: 12,
      field: {
        id: "83f92968-55be-4912-baa4-c3a1d17ad4de",
        name: "Approved",
        field_type: "toggle",
      },
      options: [],
    },
    value: false,
  },
  {
    id: "f68d9cc1-fcd0-4275-9659-d884f139cb16",
    field_membership: {
      id: "17194dff-7939-4945-949b-9e3e8378bd4e",
      order: 13,
      field: {
        id: "c73a9120-4261-49f5-a596-893550dc31bb",
        name: "Critics Rating",
        field_type: "rating",
      },
      options: [],
    },
    value: 0,
  },
  {
    id: "1ada082a-3717-49fe-8c85-1262e9d8198d",
    field_membership: {
      id: "21f618b2-f805-4d5f-b955-4d95de784bf9",
      order: 14,
      field: {
        id: "1d18f7bc-f519-4af3-bdea-b1cd2977b695",
        name: "Attachment ",
        field_type: "attachment",
      },
      options: [],
    },
    value: {},
  },
];

export type ProjectsRootTab = "all-projects" | "all-tasks";

// Get initial view from localStorage or default to 'grid'
const getInitialView = (type: "project" | "task" | "projectLibrary"): View => {
  if (typeof window === "undefined") return "grid";
  if (type === "project")
    return (localStorage.getItem("projectView") as View) || "grid";
  if (type === "task")
    return (localStorage.getItem("taskView") as View) || "grid";
  if (type === "projectLibrary")
    return (localStorage.getItem("projectLibraryView") as View) || "grid";
  return "grid";
};

const getInitialProjectsTab = (): ProjectsRootTab => {
  if (typeof window === "undefined") return "all-projects";
  return (
    (localStorage.getItem("projectsSelectedTab") as ProjectsRootTab) ||
    "all-projects"
  );
};

interface ProjectState {
  isCreateNewProjectModalOpen: boolean;
  setIsCreateNewProjectModalOpen: (
    isCreateNewProjectModalOpen: boolean
  ) => void;
  isAddProjectUserModalOpen: boolean;
  setIsAddProjectUserModalOpen: (isAddProjectUserModalOpen: boolean) => void;
  projects: DummyProject[];
  setProjects: (projects: DummyProject[]) => void;
  selectedProject: Project | null;
  setSelectedProject: (selectedProject: Project | null) => void;
  projectStatus: string;
  setProjectStatus: (projectStatus: string) => void;
  showMetadataPanel: boolean;
  toggleMetadataPanel: () => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (selectedTaskId: string | null) => void;
  selectedTaskIndex: number;
  setSelectedTaskIndex: (selectedTaskIndex: number) => void;
  selectedTask: Task | null;
  setSelectedTask: (selectedTask: Task | null) => void;
  flattenFolders: boolean;
  setFlattenFolders: (flattenFolders: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  searchTask: string;
  setSearchTask: (searchTask: string) => void;
  showFilterBar: boolean;
  toggleFilterBar: () => void;
  showSortBar: boolean;
  toggleSortBar: () => void;
  showProjectDashboardFilterBar: boolean;
  toggleProjectDashboardFilterBar: () => void;
  showProjectDashboardSortBar: boolean;
  toggleProjectDashboardSortBar: () => void;

  showTasksSortBar: boolean;
  toggleTasksSortBar: () => void;

  taskFilters: ProjectTaskFilter[];
  setTaskFilters: (taskFilters: ProjectTaskFilter[]) => void;
  addTaskFilter: (taskFilter: ProjectTaskFilter) => void;
  removeTaskFilter: (taskFilterId: string) => void;
  modifyTaskFilter: (
    taskFilterId: string,
    taskFilter: ProjectTaskFilter
  ) => void;
  clearTaskFilters: () => void;

  sorts: Sort[];
  addSort: (sort: Sort) => void;
  removeSort: (sortId: string) => void;
  modifySort: (sortId: string, sort: Sort) => void;
  clearSorts: () => void;
  projectView: View;
  taskView: View;
  projectLibraryView: View;

  // Sort for all tasks
  tasksSorts: Sort[];
  addTasksSort: (sort: Sort) => void;
  removeTasksSort: (sortId: string) => void;
  modifyTasksSort: (sortId: string, sort: Sort) => void;
  clearTasksSorts: () => void;

  // sort for project tasks
  projectTasksSorts: Sort[];
  addProjectTasksSort: (sort: Sort) => void;
  removeProjectTasksSort: (sortId: string) => void;
  modifyProjectTasksSort: (sortId: string, sort: Sort) => void;
  clearProjectTasksSorts: () => void;

  setProjectView: (view: View) => void;
  setTaskView: (view: View) => void;
  setProjectLibraryView: (view: View) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  thumbnail: Thumbnail;
  setThumbnail: (thumbnail: Thumbnail) => void;
  selectedItems: string[];
  setSelectedItems: (selectedItems: string[]) => void;
  addOrRemoveItem: (item: string) => void;
  clearSelectedItems: () => void;

  selectedProjects: string[];
  setSelectedProjects: (selectedProjects: string[]) => void;
  addOrRemoveProjects: (item: string) => void;
  clearSelectedProjects: () => void;

  selectedProjectMembers: ProjectMember[];
  setSelectedProjectMembers: (selectedProjectMembers: ProjectMember[]) => void;
  removeProjectMember: (memberId: string) => void;

  isAffectedStepModalOpen: boolean;
  setIsAffectedStepModalOpen: (open: boolean) => void;
  resetAffectedStepModal: () => void;
  selectedAffectedModalType: string;
  setSelectedAffectedModalType: (resource: string) => void;

  selectedLibraryItems: LibraryAsset[];
  setSelectedLibraryItems: (selectedLibraryItems: LibraryAsset[]) => void;
  addOrRemoveLibraryItem: (item: LibraryAsset) => void;
  clearSelectedLibraryItems: () => void;

  selectedClipboardAction: "copy" | "cut" | null;
  setSelectedClipboardAction: (
    selectedClipboardAction: "copy" | "cut" | null
  ) => void;

  // Task filters
  showTaskFilterBar: boolean;
  toggleTaskFilterBar: () => void;
  isBlocked: boolean;
  setIsBlocked: (isBlocked: boolean) => void;
  isBlocking: boolean;
  setIsBlocking: (isBlocking: boolean) => void;
  badgeCount: number;
  setBadgeCount: (badgeCount: number) => void;
  updateBadgeCount: () => void;
  taskFilterAssignedUser: UserWithWorkspaceAndRole | null;
  setTaskFilterAssignedUser: (
    taskFilterAssignedUser: UserWithWorkspaceAndRole | null
  ) => void;
  taskFilterTeam: Team | null;
  setTaskFilterTeam: (taskFilterTeam: Team | null) => void;
  taskFilterStatus: TaskStatus[] | null;
  setTaskFilterStatus: (taskFilterStatus: TaskStatus[] | null) => void;
  taskFilterStepType: string;
  setTaskFilterStepType: (taskFilterStepType: string) => void;
  taskFilterWorkflow: WorkflowTemplate[] | null;
  setTaskFilterWorkflow: (
    taskFilterWorkflow: WorkflowTemplate[] | null
  ) => void;
  filterType: "all" | "any";
  setFilterType: (filterType: "all" | "any") => void;
  // File picker
  isFilePickerOpen: boolean;
  setIsFilePickerOpen: (isFilePickerOpen: boolean) => void;

  allTaskSearch: string;
  setAllTaskSearch: (allTaskSearch: string) => void;

  // Optimistic updates
  allProjects: Project[];
  setAllProjects: (allProjects: Project[]) => void;

  visitedNodes: {
    id: string;
    name: string;
  }[];
  setVisitedNodes: (nodes: { id: string; name: string }[]) => void;

  selectedVersionStackId: string | null;
  setSelectedVersionStackId: (selectedVersionStackId: string | null) => void;

  // for search modal
  isNewTaskCreationModalOpen: boolean;
  setIsNewTaskCreationModalOpen: (isNewTaskCreationModalOpen: boolean) => void;

  uploadFrom: "upload" | "library" | "projects" | "all-projects";
  setUploadFrom: (
    uploadForm: "upload" | "library" | "projects" | "all-projects"
  ) => void;

  projectsSelectedTab: ProjectsRootTab;
  setProjectsSelectedTab: (selectedTab: ProjectsRootTab) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  isCreateNewProjectModalOpen: false,
  setIsCreateNewProjectModalOpen: (isCreateNewProjectModalOpen: boolean) =>
    set({ isCreateNewProjectModalOpen }),
  isAddProjectUserModalOpen: false,
  setIsAddProjectUserModalOpen: (isAddProjectUserModalOpen: boolean) =>
    set({ isAddProjectUserModalOpen }),
  projects: resources as DummyProject[],
  setProjects: (projects: DummyProject[]) => set({ projects }),
  projectStatus: "Not Started",
  setProjectStatus: (projectStatus: string) => set({ projectStatus }),
  showMetadataPanel: true,
  toggleMetadataPanel: () =>
    set((state) => ({ showMetadataPanel: !state.showMetadataPanel })),
  selectedTaskId: null,
  setSelectedTaskId: (selectedTaskId: string | null) => set({ selectedTaskId }),
  selectedTaskIndex: 0,
  setSelectedTaskIndex: (selectedTaskIndex: number) =>
    set({ selectedTaskIndex }),
  selectedTask: null,
  setSelectedTask: (selectedTask: Task | null) => set({ selectedTask }),
  selectedProject: null,
  setSelectedProject: (selectedProject: Project | null) =>
    set({ selectedProject }),
  flattenFolders: false,
  setFlattenFolders: (flattenFolders: boolean) => set({ flattenFolders }),
  search: "",
  setSearch: (search: string) => set({ search }),
  searchTask: "",
  setSearchTask: (searchTask: string) => set({ searchTask }),
  showFilterBar: false,
  toggleFilterBar: () =>
    set((state) => ({ showFilterBar: !state.showFilterBar })),
  showSortBar: false,
  toggleSortBar: () => set((state) => ({ showSortBar: !state.showSortBar })),

  showProjectDashboardFilterBar: false,
  toggleProjectDashboardFilterBar: () =>
    set((state) => ({
      showProjectDashboardFilterBar: !state.showProjectDashboardFilterBar,
    })),
  showProjectDashboardSortBar: false,
  toggleProjectDashboardSortBar: () =>
    set((state) => ({
      showProjectDashboardSortBar: !state.showProjectDashboardSortBar,
    })),

  showTasksSortBar: false,
  toggleTasksSortBar: () =>
    set((state) => ({ showTasksSortBar: !state.showTasksSortBar })),

  taskFilters: [],
  setTaskFilters: (taskFilters: ProjectTaskFilter[]) => set({ taskFilters }),
  addTaskFilter: (taskFilter: ProjectTaskFilter) =>
    set((state) => ({ taskFilters: [...state.taskFilters, taskFilter] })),
  removeTaskFilter: (taskFilterId: string) =>
    set((state) => ({
      taskFilters: state.taskFilters.filter((f) => f.id !== taskFilterId),
    })),
  modifyTaskFilter: (taskFilterId: string, taskFilter: ProjectTaskFilter) =>
    set((state) => ({
      taskFilters: state.taskFilters.map((f) =>
        f.id === taskFilterId ? taskFilter : f
      ),
    })),
  clearTaskFilters: () => set({ taskFilters: [] }),

  sorts: [],
  addSort: (sort: Sort) => set((state) => ({ sorts: [...state.sorts, sort] })),
  modifySort: (sortId: string, sort: Sort) =>
    set((state) => ({
      sorts: state.sorts.map((s) => (s.id === sortId ? sort : s)),
    })),
  removeSort: (sortId: string) =>
    set((state) => ({ sorts: state.sorts.filter((s) => s.id !== sortId) })),
  clearSorts: () => set({ sorts: [] }),

  // Task sort
  tasksSorts: [],
  addTasksSort: (sort: Sort) =>
    set((state) => ({ tasksSorts: [...state.tasksSorts, sort] })),
  modifyTasksSort: (sortId: string, sort: Sort) =>
    set((state) => ({
      tasksSorts: state.tasksSorts.map((s) => (s.id === sortId ? sort : s)),
    })),
  removeTasksSort: (sortId: string) =>
    set((state) => ({
      tasksSorts: state.tasksSorts.filter((s) => s.id !== sortId),
    })),
  clearTasksSorts: () => set({ tasksSorts: [] }),

  // Project task sort
  projectTasksSorts: [],
  addProjectTasksSort: (sort: Sort) =>
    set((state) => ({ projectTasksSorts: [...state.projectTasksSorts, sort] })),
  modifyProjectTasksSort: (sortId: string, sort: Sort) =>
    set((state) => ({
      projectTasksSorts: state.projectTasksSorts.map((s) =>
        s.id === sortId ? sort : s
      ),
    })),
  removeProjectTasksSort: (sortId: string) =>
    set((state) => ({
      projectTasksSorts: state.projectTasksSorts.filter((s) => s.id !== sortId),
    })),
  clearProjectTasksSorts: () => set({ projectTasksSorts: [] }),

  projectView: getInitialView("project"),
  setProjectView: (view: View) => {
    localStorage.setItem("projectView", view);
    set({ projectView: view });
  },
  taskView: getInitialView("task"),
  setTaskView: (view: View) => {
    localStorage.setItem("taskView", view);
    set({ taskView: view });
  },
  projectLibraryView: getInitialView("projectLibrary"),
  setProjectLibraryView: (view: View) => {
    localStorage.setItem("projectLibraryView", view);
    set({ projectLibraryView: view });
  },
  aspectRatio: "horizontal",
  setAspectRatio: (aspectRatio: AspectRatio) => set({ aspectRatio }),
  thumbnail: "fit",
  setThumbnail: (thumbnail: Thumbnail) => set({ thumbnail }),
  selectedItems: [],
  setSelectedItems: (selectedItems: string[]) => set({ selectedItems }),
  addOrRemoveItem: (item: string) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(item)
        ? state.selectedItems.filter((i) => i !== item)
        : [...state.selectedItems, item],
    })),
  clearSelectedItems: () => set({ selectedItems: [] }),

  selectedProjects: [],
  setSelectedProjects: (selectedProjects: string[]) =>
    set({ selectedProjects }),
  addOrRemoveProjects: (item: string) =>
    set((state) => ({
      selectedProjects: state.selectedProjects.includes(item)
        ? state.selectedProjects.filter((i) => i !== item)
        : [...state.selectedProjects, item],
    })),
  clearSelectedProjects: () => set({ selectedProjects: [] }),

  selectedProjectMembers: [],
  setSelectedProjectMembers: (selectedProjectMembers: ProjectMember[]) =>
    set({ selectedProjectMembers }),
  removeProjectMember: (memberId: string) =>
    set((state) => ({
      selectedProjectMembers: state.selectedProjectMembers.filter(
        (m) => m.id !== memberId
      ),
    })),

  isAffectedStepModalOpen: false,
  setIsAffectedStepModalOpen: (open: boolean) =>
    set({ isAffectedStepModalOpen: open }),
  resetAffectedStepModal: () =>
    set({
      isAffectedStepModalOpen: false,
      selectedAffectedModalType: "",
    }),
  selectedAffectedModalType: "",
  setSelectedAffectedModalType: (resource: string) =>
    set({ selectedAffectedModalType: resource }),

  selectedLibraryItems: [],
  setSelectedLibraryItems: (selectedLibraryItems: LibraryAsset[]) =>
    set({ selectedLibraryItems }),
  addOrRemoveLibraryItem: (item: LibraryAsset) =>
    set((state) => ({
      selectedLibraryItems: state.selectedLibraryItems.includes(item)
        ? state.selectedLibraryItems.filter((i) => i !== item)
        : [...state.selectedLibraryItems, item],
    })),
  clearSelectedLibraryItems: () => set({ selectedLibraryItems: [] }),
  selectedClipboardAction: null,
  setSelectedClipboardAction: (
    selectedClipboardAction: "copy" | "cut" | null
  ) => set({ selectedClipboardAction }),

  // Task filters
  badgeCount: 0,
  setBadgeCount: (badgeCount: number) => set({ badgeCount }),
  // Helper function to update badge count
  updateBadgeCount: () => {
    const state = get();
    const activeFilters = [
      state.isBlocked,
      state.isBlocking,
      state.taskFilterAssignedUser,
      state.taskFilterTeam,
      state.taskFilterStatus,
      state.taskFilterStepType,
      state.taskFilterWorkflow,
      // ].filter((filter) => filter === true || (typeof filter === 'string' && filter !== '')).length;
    ].filter((filter) => !!filter).length;
    set({ badgeCount: activeFilters });
  },
  showTaskFilterBar: false,
  toggleTaskFilterBar: () =>
    set((state) => ({ showTaskFilterBar: !state.showTaskFilterBar })),
  isBlocked: false,
  setIsBlocked: (isBlocked: boolean) => {
    set({ isBlocked });
    get().updateBadgeCount();
  },
  isBlocking: false,
  setIsBlocking: (isBlocking: boolean) => {
    set({ isBlocking });
    get().updateBadgeCount();
  },
  taskFilterAssignedUser: null,
  setTaskFilterAssignedUser: (
    taskFilterAssignedUser: UserWithWorkspaceAndRole | null
  ) => {
    set({ taskFilterAssignedUser });
    get().updateBadgeCount();
  },
  taskFilterTeam: null,
  setTaskFilterTeam: (taskFilterTeam: Team | null) => {
    set({ taskFilterTeam });
    get().updateBadgeCount();
  },
  taskFilterStatus: null,
  setTaskFilterStatus: (taskFilterStatus: TaskStatus[] | null) => {
    set({ taskFilterStatus });
    get().updateBadgeCount();
  },
  taskFilterStepType: "",
  setTaskFilterStepType: (taskFilterStepType: string) => {
    set({ taskFilterStepType });
    get().updateBadgeCount();
  },
  taskFilterWorkflow: null,
  setTaskFilterWorkflow: (taskFilterWorkflow: WorkflowTemplate[] | null) => {
    set({ taskFilterWorkflow });
    get().updateBadgeCount();
  },
  filterType: "all",
  setFilterType: (filterType: "all" | "any") => set({ filterType }),

  // File picker
  isFilePickerOpen: false,
  setIsFilePickerOpen: (isFilePickerOpen: boolean) => set({ isFilePickerOpen }),

  allTaskSearch: "",
  setAllTaskSearch: (allTaskSearch: string) => set({ allTaskSearch }),

  // Optimistic updates
  allProjects: [],
  setAllProjects: (allProjects: Project[]) => set({ allProjects }),

  visitedNodes: [],
  setVisitedNodes: (nodes) => set({ visitedNodes: nodes }),

  selectedVersionStackId: null,
  setSelectedVersionStackId: (selectedVersionStackId: string | null) =>
    set({ selectedVersionStackId }),

  projectsSelectedTab: getInitialProjectsTab(),
  setProjectsSelectedTab: (projectsSelectedTab: ProjectsRootTab) => {
    localStorage.setItem("projectsSelectedTab", projectsSelectedTab);
    set({ projectsSelectedTab });
  },

  // for search modal
  isNewTaskCreationModalOpen: false,
  setIsNewTaskCreationModalOpen: (isNewTaskCreationModalOpen: boolean) =>
    set({ isNewTaskCreationModalOpen }),
  uploadFrom: "upload",
  setUploadFrom: (
    uploadFrom: "upload" | "library" | "projects" | "all-projects"
  ) => set({ uploadFrom }),
}));
