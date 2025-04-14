import { cn } from '@nextui-org/react';

import { MagnifyingGlass } from '@tessact/icons';

import { Input } from '@/components/ui/Input';

interface SearchbarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Searchbar = ({ placeholder, value, onChange, onFocus, size }: SearchbarProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onValueChange={onChange}
      size={size}
      startContent={
        <MagnifyingGlass
          size={20}
          className={cn(
            'transition group-data-[focus]:text-ds-text-primary',
            value.length > 0 ? 'text-ds-text-primary' : 'text-ds-input-text-placeholder'
          )}
        />
      }
      className="group"
    />
  );
};
