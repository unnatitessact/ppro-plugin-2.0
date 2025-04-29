import type { FieldOption } from "@/api-integration/types/metadata";
import type { FolderFilterState } from "@/stores/library-filter-store";

import { useCallback, useEffect, useMemo } from "react";

import { useParams, useLocation } from "react-router-dom";

import { z } from "zod";

import { MetadataFieldType } from "@/api-integration/types/metadata";

import { Filter, Sort } from "@/stores/library-store";
import { create } from "zustand";

const metadataFieldTypeEnum = z.enum([
  "text",
  "number",
  "date",
  "text_area",
  "person",
  "location",
  "timecode",
  "timecode_range",
  "select",
  "multiselect",
  "rating",
  "toggle",
  "attachment",
  "file_status",
  "tagging_status",
] as const satisfies readonly MetadataFieldType[]) as z.ZodType<MetadataFieldType>;

const fieldOptionSchema: z.ZodType<FieldOption> = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});

const filterSchema = z.array(
  z.object({
    id: z.string(),
    key: z.string().optional(),
    label: z.string(),
    type: metadataFieldTypeEnum,
    value: z.string().nullable(),
    operator: z.string().nullable(),
    isStatic: z.boolean().optional(),
    options: z.array(fieldOptionSchema),
  })
);

const sortSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    key: z.string(),
    direction: z.enum(["asc", "desc"]),
    type: z.enum(["date", "name"]),
  })
);

// Schema for the current folder filter state in URL
const currentFilterStateSchema = z.object({
  filters: filterSchema.optional(),
  sorts: sortSchema.optional(),
  searchQuery: z.string().optional(),
});

interface LibraryFilterState {
  currentFolderId: string;
  filterMatchType: "all" | "any";
  isFlattened: boolean;
  folderStates: Record<
    string,
    {
      filters: Filter[];
      sorts: Sort[];
      searchQuery: string;
    }
  >;
  setFilterMatchType: (type: "all" | "any") => void;
  setIsFlattened: (flattened: boolean) => void;
  updateFolderState: (
    folderId: string,
    state: {
      filters: Filter[];
      sorts: Sort[];
      searchQuery: string;
    }
  ) => void;
}

const useLibraryFilterStore = create<LibraryFilterState>((set) => ({
  currentFolderId: "root",
  filterMatchType: "all",
  isFlattened: false,
  folderStates: {},
  setFilterMatchType: (type) => set({ filterMatchType: type }),
  setIsFlattened: (flattened) => set({ isFlattened: flattened }),
  updateFolderState: (folderId, state) =>
    set((prev) => ({
      folderStates: {
        ...prev.folderStates,
        [folderId]: state,
      },
    })),
}));

export const useLibraryFilterState = () => {
  const {
    currentFolderId,
    filterMatchType,
    isFlattened,
    folderStates,
    setFilterMatchType,
    setIsFlattened,
    updateFolderState,
  } = useLibraryFilterStore();

  const currentState = folderStates[currentFolderId] || {
    filters: [],
    sorts: [],
    searchQuery: "",
  };

  // Filter operations
  const addFilter = useCallback(
    (filter: Filter) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        filters: [...currentState.filters, filter],
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const removeFilter = useCallback(
    (filterId: string) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        filters: currentState.filters.filter((f) => f.id !== filterId),
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const modifyFilter = useCallback(
    (filterId: string, filter: Filter) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        filters: currentState.filters.map((f) =>
          f.id === filterId ? filter : f
        ),
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const clearFilters = useCallback(() => {
    updateFolderState(currentFolderId, {
      ...currentState,
      filters: [],
    });
  }, [currentFolderId, currentState, updateFolderState]);

  // Sort operations
  const addSort = useCallback(
    (sort: Sort) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        sorts: [...currentState.sorts, sort],
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const removeSort = useCallback(
    (sortId: string) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        sorts: currentState.sorts.filter((s) => s.id !== sortId),
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const modifySort = useCallback(
    (sortId: string, sort: Sort) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        sorts: currentState.sorts.map((s) => (s.id === sortId ? sort : s)),
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  const clearSorts = useCallback(() => {
    updateFolderState(currentFolderId, {
      ...currentState,
      sorts: [],
    });
  }, [currentFolderId, currentState, updateFolderState]);

  // Search operations
  const setSearch = useCallback(
    (searchQuery: string) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        searchQuery,
      });
    },
    [currentFolderId, currentState, updateFolderState]
  );

  return {
    filters: currentState.filters,
    setFilters: (filters: Filter[]) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        filters,
      });
    },
    filterMatchType,
    setFilterMatchType,
    addFilter,
    removeFilter,
    modifyFilter,
    clearFilters,
    sorts: currentState.sorts,
    setSorts: (sorts: Sort[]) => {
      updateFolderState(currentFolderId, {
        ...currentState,
        sorts,
      });
    },
    addSort,
    removeSort,
    modifySort,
    clearSorts,
    search: currentState.searchQuery,
    setSearch,
    isFlattened,
    setIsFlattened,
    currentFolderId,
  };
};
