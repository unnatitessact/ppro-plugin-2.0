import { ProjectLibraryContentsQueryParams } from "./projects";

import { LibraryContentsQueryParams } from "./library";

export const generateLibraryQueryParams = (
  params: LibraryContentsQueryParams
) => {
  let queryParams = "";

  if (params.searchQuery) {
    queryParams += `&search=${params.searchQuery}`;
  }

  if (params.filters.length > 0) {
    params.filters.forEach((filter, index) => {
      if (filter.label && filter.type && filter.value && filter.operator) {
        if (filter.isStatic && filter.key) {
          if (filter.type === "file_status") {
            queryParams += `&static_field_name[${index}]=file__file_status&static_field_type[${index}]=select&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          } else if (filter.type === "tagging_status") {
            queryParams += `&static_field_name[${index}]=file__tagging_status&static_field_type[${index}]=select&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          } else {
            queryParams += `&static_field_name[${index}]=${filter.key}&static_field_type[${index}]=${filter.type}&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          }
        } else {
          queryParams += `&meta_field_name[${index}]=${filter.label}&meta_field_type[${index}]=${filter.type}&meta_value[${index}]=${filter.value}&meta_operator[${index}]=${filter.operator}`;
        }
      }
    });

    if (
      params.filters.filter(
        (filter) =>
          filter.label && filter.type && filter.value && filter.operator
      ).length > 0
    ) {
      queryParams += `&match_type=${params.matchType}`;
    }
  }

  if (params.sorts.length > 0) {
    queryParams += `&sort=${params.sorts
      .map((sort) =>
        sort.direction === "asc" ? `${sort.key}` : `-${sort.key}`
      )
      .join(",")}`;
  }

  if (params.flatten) {
    queryParams += "&flatten_folders=true";
  }

  return queryParams;
};

export const generateProjectLibraryQueryParams = (
  params: ProjectLibraryContentsQueryParams
) => {
  let queryParams = "";

  if (params.searchQuery) {
    queryParams += `&search=${params.searchQuery}`;
  }

  if (params.filters.length > 0) {
    params.filters.forEach((filter, index) => {
      if (filter.label && filter.type && filter.value && filter.operator) {
        if (filter.isStatic && filter.key) {
          if (filter.type === "file_status") {
            queryParams += `&static_field_name[${index}]=file__file_status&static_field_type[${index}]=select&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          } else if (filter.type === "tagging_status") {
            queryParams += `&static_field_name[${index}]=file__tagging_status&static_field_type[${index}]=select&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          } else {
            queryParams += `&static_field_name[${index}]=${filter.key}&static_field_type[${index}]=${filter.type}&static_value[${index}]=${filter.value}&static_operator[${index}]=${filter.operator}`;
          }
        } else {
          queryParams += `&meta_field_name[${index}]=${filter.label}&meta_field_type[${index}]=${filter.type}&meta_value[${index}]=${filter.value}&meta_operator[${index}]=${filter.operator}`;
        }
      }
    });

    if (
      params.filters.filter(
        (filter) =>
          filter.label && filter.type && filter.value && filter.operator
      ).length > 0
    ) {
      queryParams += `&match_type=${params.matchType}`;
    }
  }

  if (params.sorts.length > 0) {
    queryParams += `&sort=${params.sorts
      .map((sort) =>
        sort.direction === "asc" ? `${sort.key}` : `-${sort.key}`
      )
      .join(",")}`;
  }

  if (params.flatten) {
    queryParams += "&flatten_folders=true";
  }

  return queryParams;
};
