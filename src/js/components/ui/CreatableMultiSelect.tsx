import { GroupBase } from "react-select";
import Select, { CreatableProps } from "react-select/creatable";

type Option = {
  label: string;
  value: string;
};

interface CreatableMultiSelectProps
  extends CreatableProps<Option, true, GroupBase<Option>> {}

export const CreatableMultiSelect = ({
  options,
  placeholder,
  value,
  onChange,
  isLoading,
  onCreateOption,
  ...props
}: CreatableMultiSelectProps) => {
  return (
    <Select
      unstyled
      isMulti
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      onCreateOption={onCreateOption}
      {...props}
      classNames={{
        container: () =>
          "!font-karla bg-ds-input-bg hover:bg-ds-input-bg-hover rounded-xl py-1 !font-sans transition",
        control: () =>
          "px-2.5 text-ds-input-text placeholder:text-ds-input-placeholder",
        input: () => "text-sm !font-sans",
        menu: () => "p-0 bg-ds-menu-bg border-ds-menu-border border rounded-xl",
        menuList: () => "bg-ds-menu-bg p-2 rounded-xl space-y-1",
        option: ({ isFocused }) =>
          `py-1.5 px-2 !cursor-pointer !font-karla !font-medium rounded-lg !text-sm ${
            isFocused ? "bg-ds-menu-bg-hover" : ""
          }`,
        placeholder: () => "text-sm text-ds-input-placeholder",
        valueContainer: () => "gap-1 text-sm",
        multiValue: () =>
          "bg-default-200 border border-default-300 rounded-md px-1 py-0.5 text-sm",
        multiValueLabel: () => "text-ds-input-text",
        ...props.classNames,
      }}
    />
  );
};
