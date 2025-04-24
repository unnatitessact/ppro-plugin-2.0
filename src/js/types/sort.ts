export interface Sort {
  id: string;
  label: string;
  key: string;
  direction: 'asc' | 'desc';
  type: 'date' | 'name';
}
