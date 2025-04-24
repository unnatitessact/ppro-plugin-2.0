import { DateValue } from "@internationalized/date";

export type BooleanFilter = boolean;
export type ArrayFilter = string[];
export type DateFilter = DateValue | null;

export interface FilterCollection {
  attachments: BooleanFilter;
  unread: BooleanFilter;
  markedDone: BooleanFilter;
  tags: ArrayFilter;
  mentions: ArrayFilter;
  commenter: ArrayFilter;
  createdDate: DateFilter;
}
