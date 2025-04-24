// default = hh:mm, frames = 246, hms = hh:mm:ss:ff
export type timeCode = 'default' | 'frames' | 'hms';

export interface TimeCode {
  id: number;
  label: string;
  value: string;
  renderValue: React.ReactNode;
  type: timeCode;
}
