import { useCallback, useEffect, useState } from "react";

import { cn } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
// import { useTheme } from "next-themes";

import { useTheme } from "@/context/ThemeContext";
// import { useEditorStore } from "@/stores/editor-store";
import { AssetPageTab } from "@/stores/search-actions-store";

import { BASE_COLORS, MENU_BORDER_COLOR } from "@/constants/colors";

export interface CurvedTab {
  key: string;
  label: React.ReactNode | string;
  children: React.ReactNode;
  removeVerticalPadding?: boolean;
}

export interface CurvedTabsProps {
  tabs: CurvedTab[];
  selectedKey?: string;
  onSelectionChange?: (selectedKey: string) => void;
  // defaultSelectedKey?: string;
}

export const CurvedTabs = ({
  tabs,
  selectedKey,
  // defaultSelectedKey,
  onSelectionChange,
}: CurvedTabsProps) => {
  const [mounted, setMounted] = useState(false);
  const selectedTab = selectedKey;

  const { theme } = useTheme();

  const handleTabChange = useCallback(
    (tabKey: string) => {
      // setSelectedTab(tabKey);
      onSelectionChange && onSelectionChange(tabKey);
    },
    [onSelectionChange]
  );

  useEffect(() => {
    if (!selectedKey || !tabs.find((tab) => tab.key === selectedKey)) {
      onSelectionChange?.(tabs[0].key);
    }
  }, [selectedKey, tabs, onSelectionChange]);

  // useEffect only runs on the client, so now we can safely show the UI
  // this is needed to avoid server side rendering without theme colors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="relative flex h-full w-full flex-col rounded-5 border border-ds-menu-border bg-ds-menu-bg">
      <div className="absolute left-0 right-0 top-0 z-10 flex h-full w-full  items-start">
        <div className="flex h-full w-full flex-col">
          <div className="z-50 flex w-full">
            {tabs.map((tab, index) => (
              <CurvedTab
                key={tab.key}
                value={tab.key}
                index={index}
                length={tabs.length}
                selectedTabIndex={tabs.findIndex((t) => t.key === selectedTab)}
                label={tab.label}
                setSelectedTab={handleTabChange}
                isFirstTab={index === 0}
                isLastTab={index === tabs.length - 1}
              />
            ))}
          </div>
          <div className="flex h-full w-full flex-col pt-[43px]">
            <div className="relative z-50 mt-0 h-full  rounded-5 bg-default-50">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={cn(
                    "absolute left-0 top-0 flex h-full w-full flex-col rounded-5 bg-default-50 pt-4",
                    selectedTab === tab.key ? "z-100" : "invisible z-50",
                    tab.removeVerticalPadding ? "pb-0 pt-0" : ""
                  )}
                >
                  {tab.children}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CurvedTab = ({
  index,
  value,
  length,
  selectedTabIndex,
  setSelectedTab,
  label,
  isFirstTab,
  isLastTab,
}: {
  index: number;
  value: string;
  length: number;
  selectedTabIndex: number;
  setSelectedTab: (tab: string) => void;
  label: React.ReactNode | string;
  isFirstTab: boolean;
  isLastTab: boolean;
}) => {
  const isSelected = selectedTabIndex === index;
  const isTabAfterSelected = index > selectedTabIndex;
  const isTabBeforeSelected = index < selectedTabIndex;
  //   const { resolvedTheme } = useTheme();
  const { theme } = useTheme();
  const lineColors = theme === "light" ? BASE_COLORS[200] : BASE_COLORS[700];
  const bgDsMenuBg = theme === "light" ? BASE_COLORS[100] : BASE_COLORS[800];

  //   const { setPreviouslySelectedPanelTab } = useEditorStore();

  return (
    <div
      className="absolute overflow-visible"
      style={{
        width: `calc(calc(100% / ${length}) + 20px)`,
        left: isFirstTab
          ? "0"
          : isLastTab
          ? "unset"
          : `calc(${(100 / length) * index}%)`,
        right: isLastTab ? "-1px" : "unset",
        top: 0,
        zIndex: isSelected
          ? 100
          : index < selectedTabIndex
          ? 10 + index
          : 10 + (20 - index),
      }}
    >
      <motion.div
        onPointerDown={() => {
          setSelectedTab(value);
          //   setPreviouslySelectedPanelTab(value as AssetPageTab);
        }}
        key="curved-tab-wrapper"
        className={cn(
          "relative z-0 -mt-px flex h-11 w-full cursor-pointer items-center justify-center border border-ds-menu-border transition-colors ",
          isFirstTab && " -ml-px",
          isLastTab && "-mr-px",
          !isFirstTab && !isLastTab && "",
          isSelected
            ? "rounded-t-5 bg-default-50 text-ds-text-primary"
            : "bg-ds-menu-bg text-ds-text-secondary",
          !isSelected && "border-b-ds-menu-border",
          isTabAfterSelected && "rounded-tr-5",
          isTabBeforeSelected && "rounded-tl-5"
        )}
      >
        {/* Created the tab inverted curves  */}
        {!isFirstTab && isSelected && <InvertedTabCurve direction="left" />}
        {!isLastTab && isSelected && <InvertedTabCurve direction="right" />}

        {isSelected && (isFirstTab || isLastTab) && (
          <div
            className={cn(
              "pointer-events-none absolute -bottom-1/2",
              isFirstTab && "left-0",
              isLastTab && "right-0"
            )}
          >
            <QuarterCircleSVG
              hideStroke
              style={{
                transform: "scale(-1,1)",
                rotate: isLastTab ? "0deg" : "-90deg",
              }}
            />
          </div>
        )}

        {!isSelected && (isFirstTab || isLastTab) && (
          <div
            className={cn(
              "pointer-events-none absolute -bottom-1/2 mb-px h-5 w-5",
              isFirstTab && "-left-px",
              isLastTab && "-right-px"
            )}
          >
            <ExtremeNotSelectedTabCurve isFirstTab={isFirstTab} />
          </div>
        )}

        {!isSelected && (isFirstTab || isLastTab) && (
          <div
            className={cn(
              "pointer-events-none absolute -bottom-1/2 -z-100 mb-[4px] h-5 w-5",
              isFirstTab && "left-[3px] rotate-[18deg] ",
              isLastTab && "right-[3px] -rotate-[18deg]"
            )}
          >
            <GenericQuarterCircleSvg
              rectFill={bgDsMenuBg}
              hideStroke
              strokeColor={lineColors}
              style={{
                rotate: isFirstTab ? "0deg" : "90deg",
              }}
            />
          </div>
        )}

        <p className="pointer-events-none select-none text-sm font-medium">
          {label}
        </p>

        {/* Shadows on left and right of the tab curves */}
        <AnimatePresence>
          {!isLastTab && (
            <motion.div
              key="curved-tab-shadow-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.125 }}
              className="pointer-events-none absolute -right-px top-0 -z-100 h-full  w-1/2 rounded-tr-5 shadow-curved-tab-right"
              style={{
                clipPath: "inset(0px -15px 0px 1px)",
              }}
            />
          )}
          {!isFirstTab && (
            <motion.div
              key="curved-tab-shadow-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.125 }}
              className="pointer-events-none absolute -left-px top-0 -z-100 h-full  w-1/2 rounded-tl-5 shadow-curved-tab-left"
              style={{
                clipPath: "inset(0px 1px 0px -15px)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helpers to hide bottom borders of the tab */}
      {isSelected && (
        <div className="relative h-px w-full">
          <div
            className={cn(
              "absolute bottom-px z-10 h-px w-full bg-default-50",
              isLastTab && "right-px"
            )}
          />
        </div>
      )}
      {!isSelected && (isFirstTab || isLastTab) && (
        <div className="relative h-px w-full">
          <div
            className={cn(
              "pointer-events-none absolute bottom-px z-0 h-0 w-[15px] border border-ds-menu-bg",
              isFirstTab && "left-0 rounded-br-full",
              isLastTab && "right-px rounded-bl-full"
            )}
          />
        </div>
      )}
    </div>
  );
};

// Creates the inverted curve for the tab
const InvertedTabCurve = ({
  direction = "right",
}: {
  direction?: "left" | "right";
}) => {
  return (
    <div className="pointer-events-none">
      <div
        className={cn(
          "absolute -bottom-px  z-100 h-5 w-px  bg-default-50",
          direction === "right" ? "-right-px" : "-left-px"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-px z-100 h-px w-5  bg-default-50",
          direction === "right" ? "-right-5" : "-left-5"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-px  z-100 h-5 w-5",
          direction === "right" ? "-right-5" : "-left-5"
        )}
      >
        <QuarterCircleSVG
          style={{
            transform: direction === "left" ? "scale(1,-1)" : "scale(1)",
          }}
        />
      </div>
    </div>
  );
};

// SVG for the quarter circle with theme colors
const QuarterCircleSVG = ({
  style,
  hideStroke = false,
}: {
  style?: React.CSSProperties;
  hideStroke?: boolean;
}) => {
  //   const { resolvedTheme } = useTheme();
  const { theme } = useTheme();
  const strokeColor =
    theme === "dark" ? MENU_BORDER_COLOR.dark : MENU_BORDER_COLOR.light;
  const rectFill = theme === "dark" ? BASE_COLORS[900] : BASE_COLORS[50];

  return (
    <GenericQuarterCircleSvg
      style={style}
      hideStroke={hideStroke}
      rectFill={rectFill}
      strokeColor={strokeColor}
    />
  );
};

const ExtremeNotSelectedTabCurve = ({
  isFirstTab,
}: {
  isFirstTab: boolean;
}) => {
  //   const { resolvedTheme } = useTheme();
  const { theme } = useTheme();

  const strokeColor =
    theme === "dark" ? MENU_BORDER_COLOR.dark : MENU_BORDER_COLOR.light;
  return (
    <GenericQuarterCircleSvg
      rectFill={"transparent"}
      strokeColor={strokeColor}
      style={{
        rotate: isFirstTab ? "0deg" : "90deg",
      }}
    />
  );
};

// Base svg that has a fill and stroke color
const GenericQuarterCircleSvg = ({
  rectFill,
  strokeColor,
  style,
  hideStroke,
}: {
  rectFill: string;
  strokeColor: string;
  style?: React.CSSProperties;
  hideStroke?: boolean;
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="pointer-events-none -rotate-90"
      style={style}
    >
      <defs>
        <mask id="mask">
          <rect width="20" height="20" fill="white" />
          <path d="M 0 20 A 20 20 0 0 1 20 0 L 20 20 Z" fill="black" />
        </mask>
      </defs>
      {/* <!-- Colored fill covering the entire area --> */}
      <rect width="20" height="20" fill={rectFill} mask="url(#mask)" />
      {/* <!-- Quarter circle stroke path on top --> */}
      {!hideStroke && (
        <path
          d="M 0.5 20 A 20 20 0 0 1 20 0.5"
          stroke={strokeColor}
          strokeWidth={1}
          fill="none"
        />
      )}
    </svg>
  );
};
