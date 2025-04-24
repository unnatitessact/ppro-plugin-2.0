"use client";

import { FileText, Folder1 } from "@tessact/icons";

import { Switch } from "../../../../components/ui/Switch";

interface DynamicSelectedAssetsProps {
  selectedItems: {
    id: string;
    children_count: number;
    resourcetype: string;
  }[];
  isRecursive: boolean;
  setIsRecursive: (value: boolean) => void;
}

export const DynamicSelectedAssets = ({
  selectedItems,
  isRecursive,
  setIsRecursive,
}: DynamicSelectedAssetsProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex h-[230px] w-full items-center justify-center">
        <div className="relative flex items-center justify-center translate-y-[30px]">
          {(selectedItems?.length === 2 || selectedItems?.length >= 3) && (
            <div className="absolute z-10 flex h-[95px] w-[145px] items-center justify-center rounded-3xl bg-default-600 p-3.5 drop-shadow-md -translate-x-10 -translate-y-12 -rotate-12 dark:bg-default-300">
              {selectedItems?.some((item) => item.resourcetype === "Folder") ? (
                <Folder1
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              ) : (
                <FileText
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              )}
            </div>
          )}
          {(selectedItems?.length === 2 || selectedItems?.length >= 3) && (
            <div className="absolute z-20 flex h-[95px] w-[145px] items-center justify-center rounded-3xl bg-default-600 p-3.5 drop-shadow-md -translate-y-14 translate-x-10 rotate-[20deg] dark:bg-default-300">
              {selectedItems?.some((item) => item.resourcetype !== "Folder") ? (
                <FileText
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              ) : (
                <Folder1
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              )}
            </div>
          )}
          {(selectedItems?.length === 1 || selectedItems?.length >= 3) && (
            <div className="flex h-[95px] w-[145px] items-center justify-center rounded-3xl bg-default-600 p-3.5 drop-shadow-md dark:bg-default-300">
              {selectedItems?.some((item) => item.resourcetype !== "Folder") ? (
                <FileText
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              ) : (
                <Folder1
                  size={50}
                  className="text-ds-button-secondary-text-disabled"
                />
              )}
            </div>
          )}
        </div>
      </div>
      {selectedItems?.some((item) => item.children_count > 0) && (
        <div className="flex flex-col gap-2 rounded-xl bg-default-200 px-3 py-4">
          <div className="flex w-full items-center gap-4">
            <Switch
              size="sm"
              isSelected={isRecursive}
              onValueChange={setIsRecursive}
            ></Switch>
            <span className="text-sm font-medium text-ds-text-primary">
              Apply changes to all nested items
            </span>
          </div>
          <span className="text-sm font-medium text-ds-text-secondary">
            Enabling this will apply access changes across the nested items of
            the selected folders.
          </span>
        </div>
      )}
    </div>
  );
};
