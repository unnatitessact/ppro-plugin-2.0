"use client";

import { useMemo } from "react";

import { useParams, useSearchParams } from "react-router-dom";

// import { useParams, useSearchParams } from 'next/navigation';

import { useComments } from "@/context/comments";
import { DateValue, parseDate } from "@internationalized/date";
import { useDisclosure } from "@nextui-org/react";

import {
  ChevronRightSmallFilled,
  CircleCheck,
  EmailNotification,
  Filter2,
} from "@tessact/icons";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Divider } from "@/components/ui/Divider";
import { DrawerItem, DrawerNestedItem } from "@/components/ui/Drawer";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/RadixDropdown";

import {
  FilterDropdown,
  filters,
  getFiltersWithMenu,
} from "@/components/review/ReviewFilterDropdown/reviewfilters";
import {
  CalendarFilter,
  CommenterFilterItem,
  MentionFilterItem,
  TagFilterItem,
} from "@/components/review/ReviewFilterDropdown/ReviewFilterSubMenuItems";

// import {
//   FilterParams,
//   useReviewFilterParams,
// } from "@/hooks/useReviewFilterParams";

import { useReviewStore } from "@/stores/review-store";

import { useReviewGetFiltersQuery } from "@/api-integration/queries/review";

// const emptyFilters = {
//   attachments: false,
//   unread: false,
//   markedDone: false,
//   tags: [],
//   mentions: [],
//   commenter: [],
//   createdDate: null
// };

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

const iconProps = {
  className: "text-default-500",
  size: 20,
};
const itemProps = {
  onSelect: (e: Event) => e.preventDefault(),
};

const ReviewFilterDropdown = () => {
  const { fileId } = useComments();

  const { data: filtersForThisAsset } = useReviewGetFiltersQuery(fileId);
  // const [filters, setFilters] = useReviewFilterParams();
  const { appliedFilters, setAppliedFilters } = useReviewStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filtersWithSubMenu: Array<FilterDropdown> = useMemo(
    () => getFiltersWithMenu(filtersForThisAsset),
    [filtersForThisAsset]
  );

  const badgeCount = useMemo(() => {
    return Object.entries(appliedFilters).reduce((acc, [key, value]) => {
      if (key === "sort") return acc; // Skip sort from count
      if (typeof value === "boolean" && value) return acc + 1;
      if (typeof value === "string" && value) {
        if (["tags", "mentions", "commenter"].includes(key)) {
          return acc + value.split(",").filter(Boolean).length;
        }
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [appliedFilters]);

  const clearFilters = () => {
    setAppliedFilters({
      attachments: false,
      unread: false,
      markedDone: false,
      tags: [],
      mentions: [],
      commenter: [],
      createdDate: null,
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          isIconOnly
          onPress={onOpen}
          color="secondary"
          aria-label="Filter comments"
        >
          <Badge
            color="primary"
            isInvisible={badgeCount === 0}
            size="md"
            shape="circle"
            disableOutline
            className="h-4 w-[18px] rounded-2xl bg-primary-400"
            content={<span className="text-sm font-medium ">{badgeCount}</span>}
          >
            <Filter2 size={20} />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter comments by</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            startContent={<EmailNotification {...iconProps} />}
            checked={appliedFilters.unread}
            onCheckedChange={(value) => {
              setAppliedFilters({
                ...appliedFilters,
                unread: value,
              });
            }}
            {...itemProps}
          >
            Unread
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            startContent={<CircleCheck {...iconProps} />}
            checked={appliedFilters.markedDone}
            onCheckedChange={(value) => {
              setAppliedFilters({
                ...appliedFilters,
                markedDone: value,
              });
            }}
            {...itemProps}
          >
            Marked as done
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {filtersWithSubMenu.map((filter) => (
            <DropdownMenuSub key={filter.key}>
              <DropdownMenuSubTrigger
                startContent={filter.startContent}
                endContent={<ChevronRightSmallFilled width={20} height={20} />}
              >
                <div className="flex items-center gap-2">
                  {filter.label}{" "}
                  {filter.key === "createdDate" ? (
                    appliedFilters.createdDate ? (
                      <Chip color="filter">1</Chip>
                    ) : null
                  ) : (
                    appliedFilters[filter.key as keyof FilterCollection] &&
                    (
                      appliedFilters[
                        filter.key as keyof FilterCollection
                      ] as ArrayFilter
                    ).filter(Boolean).length > 0 && (
                      <Chip color="filter">
                        {
                          appliedFilters[filter.key as keyof FilterCollection]
                            ?.toString()
                            .split(",")
                            .filter(Boolean).length
                        }
                      </Chip>
                    )
                  )}
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-96 overflow-y-auto">
                  <SubMenuContent filter={filter} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuItem className="p-0">
          <Button
            size="sm"
            onPress={clearFilters}
            fullWidth
            color="secondary"
            aria-label="Clear all filters"
          >
            Clear all
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReviewFilterDropdown;

interface SubMenuContentProps {
  filter: FilterDropdown;
  // filters: FilterParams;
  // setFilters: (filters: FilterParams) => void;
}

export const SubMenuContent = ({ filter }: SubMenuContentProps) => {
  // const [filters, setFilters] =      ();
  const { appliedFilters, setAppliedFilters } = useReviewStore();

  if (filter.key === "createdDate") {
    return (
      <CalendarFilter
        value={
          appliedFilters.createdDate
            ? parseDate(appliedFilters.createdDate.toString())
            : null
        }
        onChange={(value) => {
          setAppliedFilters({
            ...appliedFilters,
            createdDate: value ?? null,
          });
        }}
      />
    );
  }

  const isMention = filter.key === "mentions";
  const isTag = filter.key === "tags";
  const isCommenter = filter.key === "commenter";

  if (isMention || isTag || isCommenter) {
    return (
      <>
        <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {filter.subMenu.items.map((item) => {
            const currentValues =
              appliedFilters[filter.key as keyof FilterCollection]
                ?.toString()
                .split(",")
                .filter(Boolean) || [];

            return (
              <DropdownMenuCheckboxItem
                inset
                key={item.id}
                checked={currentValues.includes(item.id)}
                onCheckedChange={(value) => {
                  const newArray = value
                    ? [...currentValues, item.id]
                    : currentValues.filter((k) => k !== item.id);

                  setAppliedFilters({
                    ...appliedFilters,
                    [filter.key]: newArray.join(","),
                  });
                }}
                {...itemProps}
              >
                {isMention && (
                  <MentionFilterItem
                    label={item.label}
                    instances={item.instances}
                  />
                )}
                {isTag && (
                  <TagFilterItem
                    label={item.label}
                    instances={item.instances}
                  />
                )}
                {isCommenter && "profile" in item && (
                  <CommenterFilterItem
                    label={item.label}
                    instances={item.instances}
                    avatar={item.profile.profile_picture}
                  />
                )}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </>
    );
  }
};

export const FilterCommentsDrawerContent = () => {
  // assetId cannot be used from useComments since this component is not inside Commentsprovider
  // it's inside actionbar

  const { assetId: fileId } = useParams() as { assetId: string };
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get("version") ?? fileId;
  const { data: filtersForThisAsset } = useReviewGetFiltersQuery(assetId);
  const filtersWithSubMenu: Array<FilterDropdown> = useMemo(
    () => getFiltersWithMenu(filtersForThisAsset),
    [filtersForThisAsset]
  );

  return (
    <div className="flex w-full flex-col gap-1.5">
      <FilterDrawerUnread />
      <FilterDrawerMarkedDone />
      <Divider className="w-full" variant="border" />
      {filtersWithSubMenu.map((filter) => (
        <DrawerNestedItem
          key={filter.key}
          label={<FilterCommentsDrawerContentItemLabel filter={filter} />}
          icon={filter.startContent}
          drawerContent={<FilterDrawerContent filter={filter} />}
        />
      ))}
      <FilterDrawerClearAll />
    </div>
  );
};

const FilterCommentsDrawerContentItemLabel = ({
  filter,
}: {
  filter: FilterDropdown;
}) => {
  const { appliedFilters } = useReviewStore();

  const count = useMemo(() => {
    return appliedFilters[filter.key as keyof FilterCollection]
      ?.toString()
      .split(",")
      .filter(Boolean).length;
  }, [appliedFilters, filter.key]);
  return (
    <div className="flex items-center gap-2">
      {filter.label}{" "}
      {count && count > 0 ? <Chip color="filter">{count}</Chip> : null}
    </div>
  );
};

const FilterDrawerUnread = () => {
  const { appliedFilters, setAppliedFilters } = useReviewStore();
  return (
    <DrawerItem
      label="Unread"
      icon={<EmailNotification {...iconProps} />}
      onClick={() => {
        setAppliedFilters({
          ...appliedFilters,
          unread: !appliedFilters.unread,
        });
      }}
    />
  );
};

const FilterDrawerMarkedDone = () => {
  const { appliedFilters, setAppliedFilters } = useReviewStore();
  return (
    <DrawerItem
      label="Marked as done"
      icon={<CircleCheck {...iconProps} />}
      onClick={() => {
        setAppliedFilters({
          ...appliedFilters,
          markedDone: !appliedFilters.markedDone,
        });
      }}
    />
  );
};

const FilterDrawerClearAll = () => {
  const { appliedFilters, setAppliedFilters } = useReviewStore();
  const clearFilters = () => {
    setAppliedFilters({
      attachments: false,
      unread: false,
      markedDone: false,
      tags: [],
      mentions: [],
      commenter: [],
      createdDate: null,
    });
  };
  return (
    <DrawerItem
      label="Clear all"
      onClick={() => {
        clearFilters();
      }}
    />
  );
};

const FilterDrawerContent = ({ filter }: { filter: FilterDropdown }) => {
  const { appliedFilters, setAppliedFilters } = useReviewStore();

  if (filter.key === "createdDate") {
    return (
      <CalendarFilter
        value={
          appliedFilters.createdDate
            ? parseDate(appliedFilters.createdDate.toString())
            : null
        }
        onChange={(value) => {
          setAppliedFilters({
            ...appliedFilters,
            createdDate: value ?? null,
          });
        }}
      />
    );
  }

  const isMention = filter.key === "mentions";
  const isTag = filter.key === "tags";
  const isCommenter = filter.key === "commenter";

  return (
    <div className="flex w-full flex-col">
      <Listbox
        className="bg-transparent"
        selectionMode="multiple"
        selectedKeys={
          new Set(
            appliedFilters[filter.key as keyof FilterCollection]
              ?.toString()
              .split(",")
              .filter(Boolean) || []
          )
        }
        onSelectionChange={(keys) => {
          const newArray = Array.from(keys).join(",");

          setAppliedFilters({
            ...appliedFilters,
            [filter.key]: newArray,
          });
        }}
      >
        {filter.subMenu.items.map((item) => {
          return (
            <ListboxItem key={item.id} aria-label={item.label}>
              {isMention && (
                <MentionFilterItem
                  label={item.label}
                  instances={item.instances}
                />
              )}
              {isTag && (
                <TagFilterItem label={item.label} instances={item.instances} />
              )}
              {isCommenter && "profile" in item && (
                <CommenterFilterItem
                  label={item.label}
                  instances={item.instances}
                  avatar={item.profile.profile_picture}
                />
              )}
            </ListboxItem>
          );
        })}
      </Listbox>
    </div>
  );

  return filter.label;
};
