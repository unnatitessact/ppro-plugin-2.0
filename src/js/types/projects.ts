import { DateValue } from '@internationalized/date';

// dummy data
export type Member = {
  first_name: string;
  last_name: string;
  display_name: string;
  profile_picture: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  sub_contents: { id: string; type: string; thumbnail: string }[];
  status: string;
  completed_tasks: number;
  total_tasks: number;
  is_archived: boolean;
  due_date: DateValue | null;
  members?: Member[];
};

export type ReviewFile = {
  id: string;
  name: string;
  type: string;
  size: number;
};

// actual api data
export interface PaginatedProjectResult<T> {
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
