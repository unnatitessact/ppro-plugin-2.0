import {
  AMBER_COLORS,
  BASE_COLORS,
  GREEN_COLORS,
  PINK_COLORS,
  PURPLE_COLORS,
  RED_COLORS,
  TEAL_COLORS,
} from "../colors";

export type COMBINATIONS_KEY =
  | "amber"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "teal";

export const COMBINATIONS = ["amber", "green", "pink", "purple", "red", "teal"];

export const COLORS_TO_TAILWIND: Record<string, string> = {
  "amber-solid":
    "bg-ds-combination-amber-solid-bg text-ds-combination-amber-solid-text",
  "amber-subtle":
    "bg-ds-combination-amber-subtle-bg text-ds-combination-amber-subtle-text border border-ds-combination-amber-subtle-border",
  "green-solid":
    "bg-ds-combination-green-solid-bg text-ds-combination-green-solid-text",
  "green-subtle":
    "bg-ds-combination-green-subtle-bg text-ds-combination-green-subtle-text border border-ds-combination-green-subtle-border",
  "pink-solid":
    "bg-ds-combination-pink-solid-bg text-ds-combination-pink-solid-text",
  "pink-subtle":
    "bg-ds-combination-pink-subtle-bg text-ds-combination-pink-subtle-text border border-ds-combination-pink-subtle-border",
  "purple-solid":
    "bg-ds-combination-purple-solid-bg text-ds-combination-purple-solid-text",
  "purple-subtle":
    "bg-ds-combination-purple-subtle-bg text-ds-combination-purple-subtle-text border border-ds-combination-purple-subtle-border",
  "red-solid":
    "bg-ds-combination-red-solid-bg text-ds-combination-red-solid-text",
  "red-subtle":
    "bg-ds-combination-red-subtle-bg text-ds-combination-red-subtle-text border border-ds-combination-red-subtle-border",
  "teal-solid":
    "bg-ds-combination-teal-solid-bg text-ds-combination-teal-solid-text",
  "teal-subtle":
    "bg-ds-combination-teal-subtle-bg text-ds-combination-teal-subtle-text border border-ds-combination-teal-subtle-border",
};

export const PROFILE_COMBINATIONS: Record<string, string> = {
  amber:
    "text-ds-combination-amber-subtle-text bg-ds-combination-amber-subtle-border",
  green:
    "text-ds-combination-green-subtle-text bg-ds-combination-green-subtle-border",
  pink: "text-ds-combination-pink-subtle-text bg-ds-combination-pink-subtle-border",
  purple:
    "text-ds-combination-purple-subtle-text bg-ds-combination-purple-subtle-border",
  red: "text-ds-combination-red-subtle-text bg-ds-combination-red-subtle-border",
  teal: "text-ds-combination-teal-subtle-text bg-ds-combination-teal-subtle-border",
};

export const FILL_COMBINATIONS: Record<string, string> = {
  amber: "fill-ds-combination-amber-solid-bg",
  green: "fill-ds-combination-green-solid-bg",
  pink: "fill-ds-combination-pink-solid-bg",
  purple: "fill-ds-combination-purple-solid-bg",
  red: "fill-ds-combination-red-solid-bg",
  teal: "fill-ds-combination-teal-solid-bg",
};

export const CURSORS_COMBINATIONS_SOLID: Record<string, string> = {
  amber: "bg-ds-combination-amber-solid-bg",
  green: "bg-ds-combination-green-solid-bg",
  pink: "bg-ds-combination-pink-solid-bg",
  purple: "bg-ds-combination-purple-solid-bg",
  red: "bg-ds-combination-red-solid-bg",
  teal: "bg-ds-combination-teal-solid-bg",
};

export const COLOR_COMBINATIONS = {
  light: {
    amber: {
      solid: {
        bg: AMBER_COLORS[500],
        text: AMBER_COLORS[900],
      },
      subtle: {
        bg: AMBER_COLORS[100],
        border: AMBER_COLORS[200],
        text: AMBER_COLORS[700],
      },
    },
    green: {
      solid: {
        bg: GREEN_COLORS[600],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: GREEN_COLORS[50],
        border: GREEN_COLORS[100],
        text: GREEN_COLORS[700],
      },
    },
    pink: {
      solid: {
        bg: PINK_COLORS[600],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: PINK_COLORS[50],
        border: PINK_COLORS[100],
        text: PINK_COLORS[700],
      },
    },
    purple: {
      solid: {
        bg: PURPLE_COLORS[600],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: PURPLE_COLORS[50],
        border: PURPLE_COLORS[100],
        text: PURPLE_COLORS[700],
      },
    },
    red: {
      solid: {
        bg: RED_COLORS[600],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: RED_COLORS[50],
        border: RED_COLORS[100],
        text: RED_COLORS[700],
      },
    },
    teal: {
      solid: {
        bg: TEAL_COLORS[600],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: TEAL_COLORS[50],
        border: TEAL_COLORS[100],
        text: TEAL_COLORS[700],
      },
    },
  },
  dark: {
    amber: {
      solid: {
        bg: AMBER_COLORS[500],
        text: AMBER_COLORS[900],
      },
      subtle: {
        bg: AMBER_COLORS[800],
        border: AMBER_COLORS[700],
        text: AMBER_COLORS[400],
      },
    },
    green: {
      solid: {
        bg: GREEN_COLORS[500],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: GREEN_COLORS[900],
        border: GREEN_COLORS[800],
        text: GREEN_COLORS[300],
      },
    },
    pink: {
      solid: {
        bg: PINK_COLORS[500],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: PINK_COLORS[900],
        border: PINK_COLORS[800],
        text: PINK_COLORS[300],
      },
    },
    purple: {
      solid: {
        bg: PURPLE_COLORS[500],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: PURPLE_COLORS[900],
        border: PURPLE_COLORS[800],
        text: PURPLE_COLORS[300],
      },
    },
    red: {
      solid: {
        bg: RED_COLORS[500],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: RED_COLORS[900],
        border: RED_COLORS[800],
        text: RED_COLORS[300],
      },
    },
    teal: {
      solid: {
        bg: TEAL_COLORS[500],
        text: BASE_COLORS[50],
      },
      subtle: {
        bg: TEAL_COLORS[900],
        border: TEAL_COLORS[800],
        text: TEAL_COLORS[300],
      },
    },
  },
};
