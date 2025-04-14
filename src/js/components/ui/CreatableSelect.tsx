import { GroupBase } from 'react-select';
import Select, { CreatableProps } from 'react-select/creatable';

import { MetadataFieldType } from '@/api-integration/types/metadata';

type Option = {
  label: string;
  value: string;
  type?: MetadataFieldType;
};

interface CreatableSelectProps extends CreatableProps<Option, false, GroupBase<Option>> {}

export const CreatableSelect = ({
  options,
  placeholder,
  value,
  onChange,
  isLoading,
  onCreateOption,
  ...props
}: CreatableSelectProps) => {
  return (
    <Select
      unstyled
      options={options}
      placeholder={placeholder}
      classNames={{
        container: () =>
          '!font-karla bg-ds-input-bg hover:bg-ds-input-bg-hover rounded-xl py-1 transition',
        control: () => 'px-2.5 text-ds-input-text placeholder:text-ds-input-placeholder',
        input: () => 'text-sm !font-karla',
        menu: () => 'p-0 bg-ds-menu-bg border-ds-menu-border border rounded-xl !z-20',
        menuList: () => 'bg-ds-menu-bg p-2 rounded-xl space-y-1',
        option: ({ isFocused }) =>
          `py-1.5 px-2 !cursor-pointer !font-karla !font-medium rounded-lg !text-sm ${isFocused ? 'bg-ds-menu-bg-hover' : ''}`,
        placeholder: () => 'text-sm text-ds-input-placeholder',
        valueContainer: () => 'text-sm'
      }}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      onCreateOption={onCreateOption}
      {...props}
    />
  );
};
