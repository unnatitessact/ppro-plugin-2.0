import { Switch } from "@nextui-org/react";

import {
  ChevronDownSmall,
  // LayoutDashboard,
  LayoutThird,
  LayoutWindow,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Tab, Tabs } from "@/components/ui/Tabs";

import { useLibraryStore } from "@/stores/library-store";

type View = "masonry" | "grid" | "list";
type AspectRatio = "vertical" | "horizontal";
type Thumbnail = "fill" | "fit";

export const LibraryViewsPopover = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          color="secondary"
          endContent={<ChevronDownSmall size={20} />}
          aria-label="View"
        >
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-2xl border border-ds-menu-border bg-ds-menu-bg p-2 text-sm font-medium">
        <LibraryViewsPopoverContent />
      </PopoverContent>
    </Popover>
  );
};

export const LibraryViewsPopoverContent = () => {
  const {
    view,
    setView,
    aspectRatio,
    setAspectRatio,
    thumbnail,
    setThumbnail,
    // flattenFolders,
    // setFlattenFolders
  } = useLibraryStore();

  // const { isFlattened, setIsFlattened } = useLibraryFilterState();

  return (
    <>
      <div className="flex w-full items-center justify-between gap-5 p-2">
        <span>Flatten folders</span>
        <Switch
          size="sm"
          classNames={{
            wrapper: "bg-ds-button-secondary-bg-hover",
          }}
          // isSelected={isFlattened ?? false}
          // onValueChange={ }
        />
      </div>
      <div className="flex w-full items-center justify-between gap-5 p-2">
        <span>Layout</span>
        <Tabs
          aria-label="Layout options"
          classNames={{ tab: "w-9 h-7", tabList: "bg-ds-button-secondary-bg" }}
          selectedKey={view}
          onSelectionChange={(key) => setView(key as View)}
        >
          {/* <Tab key="masonry" title={<LayoutDashboard size={20} />}></Tab> */}
          <Tab key="grid" title={<LayoutWindow size={20} />}></Tab>
          <Tab key="list" title={<LayoutThird size={20} />}></Tab>
        </Tabs>
      </div>
      {view !== "masonry" && (
        <>
          <div className="flex w-full items-center justify-between gap-5 p-2">
            <span>Thumbnail</span>
            <Tabs
              classNames={{ tab: "h-7", tabList: "bg-ds-button-secondary-bg" }}
              aria-label="Thumbnail options"
              selectedKey={thumbnail}
              onSelectionChange={(key) => setThumbnail(key as Thumbnail)}
            >
              <Tab key="fill" title="Fill"></Tab>
              <Tab key="fit" title="Fit"></Tab>
            </Tabs>
          </div>
          {view === "grid" && (
            <div className="flex w-full items-center justify-between gap-5 p-2">
              <span>Aspect ratio</span>
              <Tabs
                classNames={{
                  tab: "h-7",
                  tabList: "bg-ds-button-secondary-bg",
                }}
                aria-label="Aspect ratio options"
                selectedKey={aspectRatio}
                onSelectionChange={(key) => setAspectRatio(key as AspectRatio)}
              >
                <Tab
                  key="horizontal"
                  title={
                    <div className="h-[9px] w-4 rounded-sm border-2 border-foreground"></div>
                  }
                ></Tab>
                <Tab
                  key="vertical"
                  title={
                    <div className="h-[9px] w-4 rounded-sm border-2 border-foreground rotate-90"></div>
                  }
                ></Tab>
              </Tabs>
            </div>
          )}
        </>
      )}
    </>
  );
};
