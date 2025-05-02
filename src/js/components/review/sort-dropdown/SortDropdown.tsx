import React, { useMemo } from "react";

// import { useComments } from '@/context/comments';

import { ChevronBottom, ChevronRightSmall } from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { DrawerItem } from "@/components/ui/Drawer";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@/components/ui/Dropdown";

import { useReviewStore } from "@/stores/review-store";

// import { useReviewFilterParams } from '@/hooks/useReviewFilterParams';

import { ReviewCommentSort } from "@/api-integration/types/review";

import { sortOptions } from "@/utils/reviewUtils";

const SortDropdown = () => {
  // const { appliedSort, setAppliedSort } = useComments();

  const { appliedSort, setAppliedSort } = useReviewStore();

  // const [filters, setFilters] = useReviewFilterParams();

  const currentSortLabel =
    sortOptions.find((option) => option.key === appliedSort)?.label ||
    appliedSort;

  return (
    <Dropdown closeOnSelect placement="bottom-start" offset={12}>
      <DropdownTrigger>
        <Button
          color="secondary"
          endContent={<ChevronBottom size={12} />}
          aria-label="Sort comments"
        >
          {currentSortLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Sort Review Timecode"
        onAction={(key) => {
          setAppliedSort(key as ReviewCommentSort);
        }}
      >
        <DropdownSection title="Sort comments by">
          {sortOptions.map((option) => (
            <DropdownItem key={option.key}>{option.label}</DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortDropdown;

export const SortDrawerMobile = () => {
  // const [filters, setFilters] = useReviewFilterParams();

  const { appliedSort, setAppliedSort } = useReviewStore();
  const handleSortChange = (key: ReviewCommentSort) => {
    setAppliedSort(key);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {sortOptions.map((option) => (
        <DrawerItem
          key={option.key}
          label={option.label}
          onClick={() => handleSortChange(option.key as ReviewCommentSort)}
        />
      ))}
    </div>
  );
};

export const SortDrawerMobileEndContent = () => {
  const { appliedSort } = useReviewStore();

  const sortLabel = useMemo(() => {
    return (
      sortOptions.find((option) => option.key === appliedSort)?.label ||
      appliedSort
    );
  }, [appliedSort]);

  return (
    <div className="flex items-center gap-2 text-ds-text-secondary">
      {sortLabel} <ChevronRightSmall className="text-default-300" size={20} />
    </div>
  );
};
