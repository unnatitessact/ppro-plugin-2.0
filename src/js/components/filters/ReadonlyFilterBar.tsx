"use client";

import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";

// import { Button } from '@/components/ui/Button';
import { Tab, Tabs } from "@/components/ui/Tabs";

import {
  AttachmentFilterPill,
  DateFilterPill,
  FileStatusFilterPill,
  LocationFilterPill,
  MultiselectFilterPill,
  NumberFilterPill,
  PersonFilterPill,
  RatingFilterPill,
  SelectFilterPill,
  TaggingStatusFilterPill,
  TextareaFilterPill,
  TextFilterPill,
  TimecodeFilterPill,
  ToggleFilterPill,
} from "@/components/filters/pills";

// import { useLibraryFilterState } from "@/hooks/useLibraryFilterState";

// import { useUpdateView } from '@/api-integration/mutations/library';

import { Filter } from "@/stores/library-store";

const filterPillComponents = {
  text: TextFilterPill,
  text_area: TextareaFilterPill,
  date: DateFilterPill,
  location: LocationFilterPill,
  rating: RatingFilterPill,
  toggle: ToggleFilterPill,
  attachment: AttachmentFilterPill,
  person: PersonFilterPill,
  select: SelectFilterPill,
  multiselect: MultiselectFilterPill,
  timecode: TimecodeFilterPill,
  number: NumberFilterPill,
  timecode_range: null,
  file_status: FileStatusFilterPill,
  tagging_status: TaggingStatusFilterPill,
};

const renderFilterPillComponent = (filter: Filter) => {
  const FilterPillComponent = filterPillComponents[filter.type];
  return FilterPillComponent ? (
    <FilterPillComponent key={filter.id} filter={filter} />
  ) : null;
};

// interface ReadonlyFilterBarProps {
//   viewId: string;
// }

// export const ReadonlyFilterBar = ({ viewId }: ReadonlyFilterBarProps) => {
export const ReadonlyFilterBar = () => {
  // const { filters, filterMatchType, setFilterMatchType } =
  //   useLibraryFilterState();

  // const { mutate: updateView } = useUpdateView(viewId);

  return (
    <>
      <motion.div
        layout="position"
        initial={{ y: -10, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.2, delay: 0.1, ease: "easeOut" },
        }}
        exit={{
          y: -10,
          opacity: 0,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            "rounded-2xl bg-ds-filter-bar-bg",
            "py-2.5 pl-4 pr-2"
          )}
        >
          <div className="flex flex-1 cursor-text items-center gap-3">
            <p className="text-sm font-medium text-ds-filter-bar-label">
              Filter by
            </p>
            <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
              {/* {filters.map((filter) => renderFilterPillComponent(filter))} */}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Tabs
              aria-label="Apply filters for"
              classNames={{ tabList: "h-9" }}
              // selectedKey={filterMatchType}
              // onSelectionChange={(key) =>
              //   setFilterMatchType(key as "all" | "any")
              // }
            >
              <Tab key="all" title="All"></Tab>
              <Tab key="any" title="Any"></Tab>
            </Tabs>
            {/* <Button
              color="default"
              size="sm"
              onClick={() => updateView({ filters, filter_match_type: filterMatchType })}
            >
              Update
            </Button> */}
          </div>
        </div>
      </motion.div>
    </>
  );
};
