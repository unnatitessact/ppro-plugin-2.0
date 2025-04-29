import { useClickOutside } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

import { CrossSmall } from "@tessact/icons";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

import { TaggingStatusIcon } from "@/components/TaggingStatusIcon";
// import { TaggingStatusIcon } from "@/components/TaggingStatusIcon";

import { useLibraryStore } from "@/stores/library-store";

import { TaggingStatus } from "@/api-integration/types/library";

import { Filter } from "@/stores/library-store";

import { getIconFromType } from "@/utils/metadata";

interface TaggingStatusFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  "px-2 py-1 bg-ds-combo-pill-bg",
  "hover:bg-ds-combo-pill-bg-label",
  "cursor-pointer transition"
);

const nonClickablePillCn = cn(
  "px-2 py-1 bg-ds-combo-pill-bg",
  "flex items-center gap-1"
);

const getLabelFromOperator = (operator: string) => {
  if (operator === "is") return "is";
  if (operator === "is_not") return "is not";
};

const getLabelFromValue = (value: TaggingStatus) => {
  if (value === "completed") return "Completed";
  if (value === "in_progress") return "In Progress";
  if (value === "not_yet_ready") return "Not Started";
  if (value === "ready_for_tagging") return "Ready for Tagging";
};

export const TaggingStatusFilterPill = ({
  filter,
}: TaggingStatusFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryStore();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator || !value) removeFilter(id);
  });

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-[1px]",
        "text-sm text-ds-combo-pill-label",
        "overflow-hidden rounded-lg"
      )}
    >
      <Popover isOpen={!operator}>
        <PopoverTrigger>
          <div className={nonClickablePillCn}>
            {getIconFromType("tagging_status", 16)}
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string,
              })
            }
          >
            <ListboxItem key="is">is</ListboxItem>
            <ListboxItem key="is_not">is not</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && !value && (
        <Popover isOpen={!value}>
          <PopoverTrigger>
            <div className={clickablePillCn}>
              {getLabelFromOperator(operator)}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              onAction={(key) => {
                modifyFilter(id, {
                  ...filter,
                  value: key as string,
                });
              }}
            >
              <ListboxItem
                startContent={<TaggingStatusIcon status="not_yet_ready" />}
                key="not_yet_ready"
              >
                Not Started
              </ListboxItem>
              <ListboxItem
                startContent={<TaggingStatusIcon status="ready_for_tagging" />}
                key="ready_for_tagging"
              >
                Ready for Tagging
              </ListboxItem>
              <ListboxItem
                startContent={<TaggingStatusIcon status="in_progress" />}
                key="in_progress"
              >
                In Progress
              </ListboxItem>
              <ListboxItem
                startContent={<TaggingStatusIcon status="completed" />}
                key="completed"
              >
                Completed
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      )}
      {operator && value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={clickablePillCn}>
              {getLabelFromOperator(operator)}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string,
              })
            }
          >
            <DropdownItem key="is">is</DropdownItem>
            <DropdownItem key="is_not">is not</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={cn(clickablePillCn, "flex items-center gap-2")}>
              <TaggingStatusIcon status={value as TaggingStatus} />
              {getLabelFromValue(value as TaggingStatus)}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              modifyFilter(id, {
                ...filter,
                value: key as string,
              });
            }}
          >
            <DropdownItem
              startContent={<TaggingStatusIcon status="not_yet_ready" />}
              key="not_started"
            >
              Not Started
            </DropdownItem>
            <DropdownItem
              startContent={<TaggingStatusIcon status="ready_for_tagging" />}
              key="ready_for_tagging"
            >
              Ready for Tagging
            </DropdownItem>
            <DropdownItem
              startContent={<TaggingStatusIcon status="in_progress" />}
              key="in_progress"
            >
              In Progress
            </DropdownItem>
            <DropdownItem
              startContent={<TaggingStatusIcon status="completed" />}
              key="completed"
            >
              Completed
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && value && (
        <div className={clickablePillCn} onClick={() => removeFilter(id)}>
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
