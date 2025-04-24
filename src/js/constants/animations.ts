export const assetCardCheckboxAnimation = {
  initial: { opacity: 0, x: -4, y: -4, transition: { duration: 0.15 } },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.15 } },
};

export const assetCardDropdownAnimation = {
  initial: { opacity: 0, x: 4, y: -4, transition: { duration: 0.15 } },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.15 } },
};

export const markersPanelAnimation = {
  initial: {
    opacity: 1,
    x: -30,
    transition: { duration: 0.2 },
  },
  animate: {
    opacity: 1,
    x: 0,
    overflow: "hidden",
    transition: { duration: 0.2 },
  },
};

export const colorPickerAnimation = {
  initial: {
    display: "none",
    opacity: 0,
    y: "-50%",
    transition: { duration: 0.2 },
  },
  animate: {
    display: "grid",
    opacity: 1,
    y: "-50%",
    transition: { duration: 0.2 },
  },
};
