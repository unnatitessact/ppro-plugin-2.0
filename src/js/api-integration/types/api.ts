export interface PaginatedAPIResponse<T> {
  data: {
    results: T[];
    meta: {
      total_count: number;
      total_pages: number;
      page_size: number;
      next: string | null;
      previous: string | null;
      current_page: number;
    };
  };
}

export interface PaginatedLibraryResult<T> {
  data: {
    results: T[];
    meta: {
      total_count: number;
      total_pages: number;
      page_size: number;
      next: string | null;
      previous: string | null;
      current_page: number;
    };
    parent: {
      id: string;
      name: string;
      parent: string;
      created_on: string;
    } | null;
  };
}
