export interface View {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  visibility: 'private' | 'workspace';
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
}
