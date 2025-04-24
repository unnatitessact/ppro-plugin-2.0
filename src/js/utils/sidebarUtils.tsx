export const pxToPercent = (px: number) => {
  // Account for the left padding of 24px (pl-6)

  if (typeof window === "undefined") return 0;
  const availableWidth = window.innerWidth - 24;
  return (px / availableWidth) * 100;
};

export const MIN_SIDEBAR_WIDTH = 240;
export const MAX_SIDEBAR_WIDTH = 400;
export const DEFAULT_SIDEBAR_WIDTH = 240;
