import { useEffect, useRef, useState } from "react";

// import { usePathname } from 'next/navigation';
import { useLocation } from "react-router-dom";

import { useDebouncedValue, useTimeout } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

import { CircleXFilled, MagnifyingGlass } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useLibraryStore } from "@/stores/library-store";

interface SearchbarButtonProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchbarButton = ({
  value,
  onChange,
  placeholder,
}: SearchbarButtonProps) => {
  const location = useLocation();

  const { isSearchExpanded, setIsSearchExpanded } = useLibraryStore();

  const { start: focusInput } = useTimeout(() => {
    inputRef.current?.focus();
  }, 200);

  useEffect(() => {
    onChange("");
    setInput("");
    setIsSearchExpanded(false);
  }, [location, onChange, setIsSearchExpanded]);

  useEffect(() => {
    if (isSearchExpanded) {
      focusInput();
    }
  }, [isSearchExpanded, focusInput]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(value);
  const [debouncedInput] = useDebouncedValue(input, 300);

  useEffect(() => {
    onChange(debouncedInput);
  }, [debouncedInput, onChange]);

  return (
    <Input
      startContent={
        <Button
          isIconOnly
          className={cn(
            "flex h-full w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl -translate-x-3",
            isSearchExpanded ? "bg-transparent" : "bg-ds-button-secondary-bg"
          )}
          onPress={() => {
            setIsSearchExpanded(true);
            inputRef.current?.focus();
          }}
          aria-label="Search"
        >
          <MagnifyingGlass size={20} />
        </Button>
      }
      className={cn(
        "group ease-soft-spring transition-width",
        isSearchExpanded ? "w-64" : "w-12 cursor-pointer"
      )}
      endContent={
        <Button
          size="xs"
          className={cn(
            "group bg-transparent data-[hover=true]:bg-transparent",
            input && input?.length > 0 ? "block" : "hidden"
          )}
          isIconOnly
          onPress={() => {
            setInput("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          <CircleXFilled
            size={16}
            className="opacity-70 transition-opacity group-hover:opacity-100"
          />
        </Button>
      }
      size="md"
      placeholder={placeholder}
      onClick={() => {
        setIsSearchExpanded(true);
      }}
      onBlur={() => {
        if (!value && isSearchExpanded) {
          setIsSearchExpanded(false);
        }
      }}
      value={input}
      onValueChange={setInput}
      ref={inputRef}
      classNames={{
        clearButton: "text-ds-input-text-disabled",
        input: "-translate-x-5",
        inputWrapper: "bg-ds-button-secondary-bg",
      }}
    />
  );
};
