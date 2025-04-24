export type Field = {
  type: 'Input' | 'Textarea' | 'Checkboxes';
  name: string;
  value: string;
  options?: Array<{
      label: string;
      value: string;
    }>;
}

