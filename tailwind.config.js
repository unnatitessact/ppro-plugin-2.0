// import type { Config } from 'tailwindcss';

import { nextui } from "@nextui-org/react";
import plugin from "tailwindcss/plugin";

import {
  AMBER_COLORS,
  BASE_COLORS,
  GREEN_COLORS,
  PINK_COLORS,
  PRIMARY_COLORS,
  PURPLE_COLORS,
  RED_COLORS,
  TEAL_COLORS,
  TRANSLUCENT_COLORS,
} from "./src/js/constants/colors";

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./features/**/*.{js,ts,jsx,tsx,mdx}",
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/js/constants/data-colors/data-colors.ts",
  ],
  safelist: ["ProseMirror"],
  theme: {
    extend: {
      backgroundImage: {
        "noise-light": `url(/light-noise.avif)`,
        "noise-dark": `url(/dark-noise.avif)`,
        whale: `url(/projects/whale.svg)`,
        "whale-file": `url(/projects/whale_file.svg)`,
        "whale-task": `url(/projects/whale_task.svg)`,
        "create-project": `url(/projects/CreateProject.jpg)`,
        "tooltip-arrow-border": `url(/projects/tooltip-border.svg)`,
        commentTimeSelector: "linear-gradient(#495BFF 70%, #495BFFA1 90%)",
      },
      keyframes: {
        customIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        customOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.96)" },
        },
        marquee: {
          from: { transform: "translateX(0px)" },
          to: { transform: "translateX(calc(-100% - 40px))" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
        "progress-intermediate-bar": {
          from: {
            transform: "translateX(-75%) scaleX(0.2)",
          },
          "50%": {
            transform: "translateX(0%) scaleX(1)",
          },
          to: {
            transform: "translateX(75%) scaleX(0.2)",
          },
        },
      },
      animation: {
        "custom-in": "customIn 0.15s ease-out",
        "custom-out": "customOut 0.15s ease-out",
        marquee: "marquee 5s linear infinite",
        shimmer: "shimmer 2s infinite",
        "reverse-spin": "reverse-spin 1s linear infinite",
        "indeterminate-bar":
          "progress-intermediate-bar 2s linear infinite alternate",
      },
      dropShadow: {
        "marker-panel":
          "130px 94px 64px rgba(0, 0, 0, 0.01), 73px 53px 54px rgba(0, 0, 0, 0.05), 32px 23px 40px rgba(0, 0, 0, 0.09), 8px 6px 22px rgba(0, 0, 0, 0.1)",
        "blue-glow": [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "32px"],
        "2xl": ["24px", "36px"],
      },
      textShadow: {
        mention:
          "1px 1px 1px var(--nextui-ds-comment-input-bg), 1px -1px 1px var(--nextui-ds-comment-input-bg), -1px 1px 1px var(--nextui-ds-comment-input-bg)",
      },
      zIndex: {
        100: "100",
      },
      boxShadow: {
        "social-media":
          "7px 13px 31px 0px #0000001A, 26px 50px 57px 0px #00000017, 59px 113px 77px 0px #0000000D, 104px 202px 91px 0px #00000003, 163px 315px 99px 0px #00000000",
        "workflow-modal":
          "0px 18px 40px 0px rgba(0, 0, 0, 0.1), 0px 72px 72px 0px rgba(0, 0, 0, 0.09), 0px 163px 98px 0px rgba(0, 0, 0, 0.05), 0px 290px 116px 0px rgba(0, 0, 0, 0.01), 0px 453px 127px 0px rgba(0, 0, 0, 0)",
        "physical-asset": `0px -2px 4px 0px rgba(220, 220, 220, 0.15) inset, 0px -8px 8px 0px rgba(220, 220, 220, 0.13) inset, 0px -18px 11px 0px rgba(220, 220, 220, 0.07) inset, 0px -32px 13px 0px rgba(220, 220, 220, 0.02) inset, 0px -50px 14px 0px rgba(220, 220, 220, 0) inset`,
        "physical-asset-dark": `0px -2px 3px 0px rgba(0, 0, 0, 0.15) inset, 0px -6px 6px 0px rgba(0, 0, 0, 0.13) inset, 0px -14px 8px 0px rgba(0, 0, 0, 0.07) inset, 0px -25px 10px 0px rgba(0, 0, 0, 0.02) inset, 0px -39px 11px 0px rgba(0, 0, 0, 0) inset`,
        "empty-project": `0px 11px 25px 0px rgba(0, 0, 0, 0.1), 0px 46px 46px 0px rgba(0, 0, 0, 0.09), 0px 103px 62px 0px rgba(0, 0, 0, 0.05), 0px 183px 73px 0px rgba(0, 0, 0, 0.01), 0px 287px 80px 0px rgba(0, 0, 0, 0)`,
        folder:
          "0px -4px 9px 0px #C8C8C84A, 0px -16px 16px 0px #C8C8C840, 0px -35px 21px 0px #C8C8C826, 0px -63px 25px 0px #C8C8C80A, 0px -98px 28px 0px #C8C8C803, 0px -2px 4px 0px #DCDCDC26 inset, 0px -8px 8px 0px #DCDCDC21 inset, 0px -18px 11px 0px #DCDCDC12 inset, 0px -32px 13px 0px #DCDCDC05 inset, 0px -50px 14px 0px #DCDCDC00 inset",
        "folder-dark":
          "0px -4px 9px 0px #0000004A, 0px -16px 16px 0px #00000040, 0px -35px 21px 0px #00000026, 0px -63px 25px 0px #0000000A, 0px -98px 28px 0px #00000003, 0px -2px 3px 0px #00000026 inset, 0px -6px 6px 0px #00000021 inset, 0px -14px 8px 0px #00000012 inset, 0px -25px 10px 0px #00000005 inset, 0px -39px 11px 0px #00000000 inset",
        "folder-top-image":
          "0px -2px 5px 0px #00000005, 0px -9px 9px 0px #00000005, 0px -21px 13px 0px #00000003, 0px -37px 15px 0px #00000000, 0px -58px 16px 0px #00000000",
        "folder-top-image-dark":
          "0px -2px 5px 0px #00000017, 0px -9px 9px 0px #00000014, 0px -21px 13px 0px #0000000A, 0px -37px 15px 0px #00000003, 0px -58px 16px 0px #00000000",
        "folder-middle-image":
          "0px -2px 5px 0px #0000000A, 0px -9px 9px 0px #0000000A, 0px -21px 13px 0px #00000005, 0px -37px 15px 0px #00000003, 0px -58px 16px 0px #00000000",
        "folder-middle-image-dark":
          "0px -2px 5px 0px #00000017, 0px -9px 9px 0px #00000014, 0px -21px 13px 0px #0000000A, 0px -37px 15px 0px #00000003, 0px -58px 16px 0px #00000000",
        "folder-bottom-image":
          "0px -2px 5px 0px #0000001A, 0px -9px 9px 0px #00000017, 0px -21px 13px 0px #0000000D, 0px -37px 15px 0px #00000003, 0px -58px 16px 0px #00000000",
        "folder-bottom-image-dark":
          "0px -2px 5px 0px #0000001A, 0px -9px 9px 0px #00000017, 0px -21px 13px 0px #0000000D, 0px -37px 15px 0px #00000003, 0px -58px 16px 0px #00000000",
        "project-folder": `0px -2px 5px 0px rgba(0, 0, 0, 0.1),
          0px -9px 9px 0px rgba(0, 0, 0, 0.09),
          0px -21px 13px 0px rgba(0, 0, 0, 0.05),
          0px -37px 15px 0px rgba(0, 0, 0, 0.01),
          0px -58px 16px 0px rgba(0, 0, 0, 0)`,

        "task-history":
          "0px -8px 18px 0px rgba(0, 0, 0, 0.1) inset, 0px -33px 33px 0px rgba(0, 0, 0, 0.09) inset, 0px -74px 44px 0px rgba(0, 0, 0, 0.05) inset, 0px -131px 52px 0px rgba(0, 0, 0, 0.01) inset, 0px -204px 57px 0px rgba(0, 0, 0, 0) inset",
        search:
          "0px 18px 40px 0px #0000001A, 0px 72px 72px 0px #00000017, 0px 163px 98px 0px #0000000D, 0px 290px 116px 0px #00000003, 0px 453px 127px 0px #00000000",
        // 'curved-tab':
        // '0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.04), 0px 34px 20px 0px rgba(0, 0, 0, 0.02), 0px 60px 24px 0px rgba(0, 0, 0, 0.01)'
        "curved-tab-right":
          "4px 5px 12px 0px rgba(0, 0, 0, 0.05) , 4px 22px 22px 0px rgba(0, 0, 0, 0.04), 4px 49px 30px 0px rgba(0, 0, 0, 0.02), 4px 88px 35px 0px rgba(0, 0, 0, 0.01), 4px 137px 38px 0px rgba(0, 0, 0, 0)",
        "curved-tab-left":
          "-4px 5px 12px 0px rgba(0, 0, 0, 0.05) , -4px 22px 22px 0px rgba(0, 0, 0, 0.04), -4px 49px 30px 0px rgba(0, 0, 0, 0.02), -4px 88px 35px 0px rgba(0, 0, 0, 0.01), -4px 137px 38px 0px rgba(0, 0, 0, 0)",
        // '0px 5px 12px 0px rgba(0, 0, 0, 0.05) , 0px 22px 22px 0px rgba(0, 0, 0, 0.04), 0px 49px 30px 0px rgba(0, 0, 0, 0.02), 0px 88px 35px 0px rgba(0, 0, 0, 0.01), 0px 137px 38px 0px rgba(0, 0, 0, 0)'
        "detection-faces":
          "0px -1.64px 3.28px 0px #0000001A,0px -5.75px 5.75px 0px #00000017,0px -12.31px 7.39px 0px #0000000D,0px -21.34px 8.21px 0px #00000003,0px -33.65px 9.03px 0px #00000000",
      },
      borderRadius: {
        5: "20px",
      },
      backgroundColor: {
        "workflow-options": "rgba(73, 91, 255, 0.4)",
        "workflow-divider": "rgba(73, 91, 255, 0.3)",
        "workflow-options-hover": "rgba(128, 156, 255, 0.2)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            // @ts-expect-error: Custom semantic tokens from DS
            ds: {
              "remix-bar": {
                "container-bg": "rgba(238, 238, 238, 0.75)",
                "container-border": "rgba(238, 238, 238, 0.75)",
                "top-bar-bg": "rgba(218, 218, 218, 0.5)",
                "text-primary": "rgba(13, 13, 16, 1)",
                "text-secondary": "rgba(139, 139, 152, 1)",
                divider: "rgba(218, 218, 218, 0.5)",
                icon: "rgba(118, 116, 116, 0.3)",
                "selected-container-bg": "rgba(230, 237, 255, 0.74)",
                "selected-container-border": "rgba(191, 209, 255, 0.2)",
                "selected-top-bar-bg": "rgba(191, 209, 255, 0.7)",
                "selected-text-primary": "rgba(49, 55, 206, 1)",
                "selected-text-secondary": "rgba(73, 91, 255, 1)",
                "selected-divider": "rgba(128, 156, 255, 0.4)",
                "selection-icon": "rgba(73, 91, 255, 1)",
                "copied-bg": "rgba(93, 129, 255, 1)",
                "copied-text-primary": "rgba(255, 255, 255, 1)",
                "copied-text-secondary": "rgba(191, 209, 255, 1)",
                "input-bg": TRANSLUCENT_COLORS[200],
                "selected-input-bg": "rgba(191, 209, 255, 0.5)",
                "selected-input-placeholder": "rgba(128, 156, 255, 1)",
              },
              alert: {
                bg: BASE_COLORS[50],
                border: BASE_COLORS[200],
                title: BASE_COLORS[900],
                caption: BASE_COLORS[400],
                button: {
                  "error-text": RED_COLORS[500],
                  "error-text-hover": RED_COLORS[700],
                  "error-bg-hover": RED_COLORS[50],
                  "default-text": BASE_COLORS[500],
                  "default-text-hover": BASE_COLORS[400],
                  "default-bg-hover": BASE_COLORS[200],
                  "primary-text": PRIMARY_COLORS[500],
                  "primary-text-hover": PRIMARY_COLORS[400],
                  "primary-bg-hover": PRIMARY_COLORS[100],
                },
              },
              button: {
                default: {
                  bg: PRIMARY_COLORS[50],
                  "bg-hover": PRIMARY_COLORS[100],
                  text: PRIMARY_COLORS[500],
                  "text-disabled": PRIMARY_COLORS[200],
                },
                "icons-button": {
                  "bg-selected": PRIMARY_COLORS[50],
                  "bg-hover": BASE_COLORS[200],
                  "text-selected": PRIMARY_COLORS[400],
                  "text-default": BASE_COLORS[400],
                },
                primary: {
                  bg: PRIMARY_COLORS[400],
                  "bg-hover": PRIMARY_COLORS[500],
                  text: BASE_COLORS[50],
                  "text-disabled": PRIMARY_COLORS[200],
                },
                secondary: {
                  bg: BASE_COLORS[200],
                  "bg-hover": BASE_COLORS[300],
                  text: BASE_COLORS[700],
                  "text-disabled": BASE_COLORS[400],
                },
              },
              divider: {
                line: BASE_COLORS[300],
                handle: PRIMARY_COLORS[300],
              },
              input: {
                bg: BASE_COLORS[100],
                "bg-hover": BASE_COLORS[200],
                caption: BASE_COLORS[500],
                "caption-error": RED_COLORS[500],
                "border-error": RED_COLORS[500],
                text: BASE_COLORS[900],
                "text-disabled": BASE_COLORS[300],
                "text-placeholder": BASE_COLORS[500],
                label: BASE_COLORS[900],
                "label-disabled": BASE_COLORS[400],
                "required-asterisk": RED_COLORS[500],
              },
              kbd: {
                bg: BASE_COLORS[100],
                text: BASE_COLORS[900],
                border: BASE_COLORS[300],
              },
              loader: {
                bg: PRIMARY_COLORS[100],
                fill: PRIMARY_COLORS[400],
              },
              markerpanel: {
                bodybackground: BASE_COLORS[50],
              },
              menu: {
                bg: BASE_COLORS[100],
                "bg-hover": BASE_COLORS[200],
                selected: BASE_COLORS[200],
                border: BASE_COLORS[200],
                text: {
                  primary: BASE_COLORS[900],
                  secondary: BASE_COLORS[400],
                  header: BASE_COLORS[400],
                },
                divider: BASE_COLORS[200],
              },
              modal: {
                bg: BASE_COLORS[50],
                border: BASE_COLORS[200],
              },
              toast: {
                bg: BASE_COLORS[100],
                border: BASE_COLORS[200],
                title: BASE_COLORS[900],
                caption: BASE_COLORS[500],
                "icon-close": BASE_COLORS[300],
                "button-hover": BASE_COLORS[200],
                "icon-success": GREEN_COLORS[500],
                "icon-error": RED_COLORS[500],
                "icon-warning": AMBER_COLORS[500],
              },
              table: {
                header: {
                  bg: BASE_COLORS[100],
                  icon: BASE_COLORS[500],
                  "icon-hover": BASE_COLORS[700],
                  button: BASE_COLORS[100],
                  "button-hover": BASE_COLORS[300],
                },
                pill: {
                  bg: BASE_COLORS[200],
                },
                row: {
                  border: BASE_COLORS[200],
                  "bg-hover": BASE_COLORS[100],
                  "bg-selected": BASE_COLORS[200],
                },
              },
              text: {
                primary: BASE_COLORS[700],
                secondary: BASE_COLORS[500],
                selection: PRIMARY_COLORS[100],
              },
              tooltip: {
                bg: BASE_COLORS[50],
                border: BASE_COLORS[200],
                text: BASE_COLORS[800],
              },
              combination: {
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
              "workspace-switcher": {
                bg: BASE_COLORS[100],
                "bg-hover": BASE_COLORS[200],
                "bg-active": BASE_COLORS[200],
                text: BASE_COLORS[900],
              },
              link: {
                border: BASE_COLORS[200],
                "bg-hover": BASE_COLORS[100],
                "bg-selected": BASE_COLORS[200],
                "tree-lines": BASE_COLORS[300],
                text: {
                  primary: BASE_COLORS[900],
                  secondary: BASE_COLORS[400],
                  headers: BASE_COLORS[400],
                },
              },
              carousel: {
                controls: {
                  bg: BASE_COLORS[100],
                  active: BASE_COLORS[400],
                  inactive: BASE_COLORS[300],
                },
              },
              "asset-card": {
                bg: BASE_COLORS[50],
                "bg-hover": BASE_COLORS[100],
                "bg-select": BASE_COLORS[200],
                "text-sucess": GREEN_COLORS[400],
                "text-danger": RED_COLORS[400],
                "card-bg": BASE_COLORS[100],
                "folder-bg": BASE_COLORS[100],
              },
              toggle: {
                default: {
                  "bg-from": BASE_COLORS[200],
                  "bg-to": BASE_COLORS[300],
                  "knob-bg": BASE_COLORS[50],
                  "knob-ridge": BASE_COLORS[300],
                },
                selected: {
                  "bg-from": PRIMARY_COLORS[400],
                  "bg-to": PRIMARY_COLORS[300],
                  "knob-bg": BASE_COLORS[50],
                  "knob-ridge": PRIMARY_COLORS[100],
                },
              },
              checkbox: {
                checked: {
                  bg: BASE_COLORS[800],
                  text: BASE_COLORS[100],
                },
                unchecked: {
                  border: BASE_COLORS[300],
                  "hover-bg": BASE_COLORS[500],
                },
              },
              "filter-bar": {
                bg: BASE_COLORS[100],
                label: BASE_COLORS[400],
              },
              "combo-pill": {
                bg: BASE_COLORS[200],
                "bg-label": BASE_COLORS[300],
                label: BASE_COLORS[900],
              },
              "asset-preview": {
                bg: BASE_COLORS[800],
                text: {
                  primary: BASE_COLORS[50],
                  secondary: BASE_COLORS[400],
                },
              },
              comment: {
                input: {
                  bg: BASE_COLORS[100],
                  text: BASE_COLORS[800],
                  "text-default": BASE_COLORS[400],
                  "text-action": PRIMARY_COLORS[400],
                  border: BASE_COLORS[200],
                },
              },
              pills: {
                attachments: {
                  bg: BASE_COLORS[200],
                  text: BASE_COLORS[900],
                  icon: BASE_COLORS[500],
                  "icon-bg": BASE_COLORS[100],
                },
                tags: {
                  bg: PRIMARY_COLORS[50],
                  text: PRIMARY_COLORS[400],
                },
              },
              "settings-card-pill": {
                lighter: {
                  bg: PRIMARY_COLORS[200],
                  border: PRIMARY_COLORS[50],
                },
                darker: {
                  bg: PRIMARY_COLORS[400],
                  border: PRIMARY_COLORS[200],
                },
              },
              timestamp: {
                "bg-selected": PRIMARY_COLORS[50],
                "bg-hover": BASE_COLORS[200],
                "text-selected": PRIMARY_COLORS[400],
                "text-default": BASE_COLORS[400],
              },
              videoplayer: {
                bg: BASE_COLORS[800],
                border: "rgba(255, 255, 255, 0.16)",
                "bg-video": BASE_COLORS[800],
                "bg-selected": PRIMARY_COLORS[400],
                text: {
                  primary: BASE_COLORS[700],
                  secondary: BASE_COLORS[400],
                  selected: PRIMARY_COLORS[50],
                },
                controls: {
                  bg: BASE_COLORS[100],
                  active: BASE_COLORS[700],
                  default: BASE_COLORS[300],
                  hover: BASE_COLORS[600],
                  icon: BASE_COLORS[50],
                  commenting: {
                    slider: {
                      // the default bg color of the slider is active color but at 10% opacity.
                      active: BASE_COLORS[700],
                    },
                  },
                  overlay: {
                    slider: {
                      active: BASE_COLORS[100],
                    },
                  },
                },

                "icon-button": {
                  "bg-selected": PRIMARY_COLORS[50],
                  "bg-hover": BASE_COLORS[200],
                  "text-selected": PRIMARY_COLORS[400],
                  "text-default": BASE_COLORS[400],
                },
              },
              search: {
                bg: TRANSLUCENT_COLORS[50],
                outline: TRANSLUCENT_COLORS[300],
                "search-item": {
                  "bg-hover": TRANSLUCENT_COLORS[200],
                  "bg-selected": TRANSLUCENT_COLORS[400],
                },
              },
              "white-board": {
                bg: BASE_COLORS[100],
                outline: BASE_COLORS[200],
                grid: BASE_COLORS[200],
                "card-bg": BASE_COLORS[200],
                "status-bg": BASE_COLORS[100],
                pill: {
                  bg: BASE_COLORS[200],
                  "bg-active": PRIMARY_COLORS[50],
                  connector: BASE_COLORS[300],
                  "connector-active": PRIMARY_COLORS[400],
                },
              },
            },
            background: {
              50: BASE_COLORS[50],
              100: BASE_COLORS[100],
              200: BASE_COLORS[200],
              300: BASE_COLORS[300],
              400: BASE_COLORS[400],
              500: BASE_COLORS[500],
              600: BASE_COLORS[600],
              700: BASE_COLORS[700],
              800: BASE_COLORS[800],
              900: BASE_COLORS[900],
              DEFAULT: BASE_COLORS[50],
            },
            default: {
              50: BASE_COLORS[50],
              100: BASE_COLORS[100],
              200: BASE_COLORS[200],
              300: BASE_COLORS[300],
              400: BASE_COLORS[400],
              500: BASE_COLORS[500],
              600: BASE_COLORS[600],
              700: BASE_COLORS[700],
              800: BASE_COLORS[800],
              900: BASE_COLORS[900],
              DEFAULT: BASE_COLORS[200],
            },
            foreground: BASE_COLORS[700],
            primary: {
              50: PRIMARY_COLORS[50],
              100: PRIMARY_COLORS[100],
              200: PRIMARY_COLORS[200],
              300: PRIMARY_COLORS[300],
              400: PRIMARY_COLORS[400],
              500: PRIMARY_COLORS[500],
              600: PRIMARY_COLORS[600],
              700: PRIMARY_COLORS[700],
              800: PRIMARY_COLORS[800],
              900: PRIMARY_COLORS[900],
            },
            secondary: {
              50: BASE_COLORS[50],
              100: BASE_COLORS[100],
              200: BASE_COLORS[200],
              300: BASE_COLORS[300],
              400: BASE_COLORS[400],
              500: BASE_COLORS[500],
              600: BASE_COLORS[600],
              700: BASE_COLORS[700],
              800: BASE_COLORS[800],
              900: BASE_COLORS[900],
            },
            focus: BASE_COLORS[900],
            divider: BASE_COLORS[500],
            danger: RED_COLORS[500],
            success: GREEN_COLORS[500],
            warning: AMBER_COLORS[500],
            overlay: BASE_COLORS[200],
            content1: BASE_COLORS[50],
            translucent: {
              50: TRANSLUCENT_COLORS[900],
              100: TRANSLUCENT_COLORS[800],
              200: TRANSLUCENT_COLORS[700],
              300: TRANSLUCENT_COLORS[600],
              400: TRANSLUCENT_COLORS[500],
              500: TRANSLUCENT_COLORS[400],
              600: TRANSLUCENT_COLORS[300],
              700: TRANSLUCENT_COLORS[200],
              800: TRANSLUCENT_COLORS[100],
              900: TRANSLUCENT_COLORS[50],
            },
          },
        },
        dark: {
          colors: {
            // @ts-expect-error: Custom semantic tokens from DS
            ds: {
              "remix-bar": {
                "container-bg": "rgba(38, 38, 38, 0.6)",
                "container-border": "rgba(38, 38, 38, 0.6)",
                "top-bar-bg": "rgba(118, 116, 116, 0.3)",
                "text-primary": "rgba(255, 255, 255, 1)",
                "text-secondary": "rgba(139, 139, 152, 1)",
                divider: "rgba(70, 70, 70, 0.45)",
                icon: "rgba(190, 188, 188, 0.4)",
                "selected-container-bg": "rgba(26, 29, 62, 0.6)",
                "selected-container-border": "rgba(34, 38, 110, 1)",
                "selected-top-bar-bg": "rgba(93, 129, 255, 0.1)",
                "selected-text-primary": "rgba(255, 255, 255, 1)",
                "selected-text-secondary": "rgba(139, 139, 152, 1)",
                "selected-divider": "rgba(49, 55, 206, 0.2)",
                "selection-icon": "rgba(128, 156, 255, 0.2)",
                "copied-bg": "rgba(73, 91, 255, 1)",
                "copied-text-primary": "rgba(255, 255, 255, 1)",
                "copied-text-secondary": "rgba(191, 209, 255, 1)",
                "input-bg": TRANSLUCENT_COLORS[700],
                "selected-input-bg": "rgba(93, 129, 255, 0.04)",
                "selected-input-placeholder": "rgba(128, 156, 255, 0.4)",
              },
              alert: {
                bg: BASE_COLORS[900],
                border: BASE_COLORS[700],
                title: BASE_COLORS[50],
                caption: BASE_COLORS[500],
                button: {
                  "error-text": RED_COLORS[400],
                  "error-text-hover": RED_COLORS[300],
                  "error-bg-hover": RED_COLORS[900],
                  "default-text": BASE_COLORS[400],
                  "default-text-hover": BASE_COLORS[300],
                  "default-bg-hover": BASE_COLORS[800],
                  "primary-text": PRIMARY_COLORS[400],
                  "primary-text-hover": PRIMARY_COLORS[400],
                  "primary-bg-hover": PRIMARY_COLORS[900],
                },
              },
              button: {
                default: {
                  bg: PRIMARY_COLORS[900],
                  "bg-hover": PRIMARY_COLORS[800],
                  text: PRIMARY_COLORS[300],
                  "text-disabled": PRIMARY_COLORS[600],
                },
                "icons-button": {
                  "bg-selected": PRIMARY_COLORS[900],
                  "bg-hover": BASE_COLORS[700],
                  "text-selected": PRIMARY_COLORS[300],
                  "text-default": BASE_COLORS[400],
                },
                primary: {
                  bg: PRIMARY_COLORS[500],
                  "bg-hover": PRIMARY_COLORS[400],
                  text: BASE_COLORS[50],
                  "text-disabled": PRIMARY_COLORS[300],
                },
                secondary: {
                  bg: BASE_COLORS[700],
                  "bg-hover": BASE_COLORS[600],
                  text: BASE_COLORS[200],
                  "text-disabled": BASE_COLORS[500],
                },
              },
              divider: {
                line: BASE_COLORS[600],
                handle: PRIMARY_COLORS[400],
              },
              input: {
                bg: BASE_COLORS[700],
                "bg-hover": BASE_COLORS[600],
                caption: BASE_COLORS[400],
                "caption-error": RED_COLORS[400],
                "border-error": RED_COLORS[400],
                text: BASE_COLORS[50],
                "text-disabled": BASE_COLORS[500],
                "text-placeholder": BASE_COLORS[400],
                label: BASE_COLORS[50],
                "label-disabled": BASE_COLORS[400],
                "required-asterisk": RED_COLORS[400],
              },
              kbd: {
                bg: BASE_COLORS[700],
                text: BASE_COLORS[50],
                border: BASE_COLORS[600],
              },
              table: {
                header: {
                  bg: BASE_COLORS[800],
                  icon: BASE_COLORS[400],
                  "icon-hover": BASE_COLORS[200],
                  button: BASE_COLORS[700],
                  "button-hover": BASE_COLORS[600],
                },
                pill: {
                  bg: BASE_COLORS[700],
                },
                row: {
                  border: BASE_COLORS[700],
                  "bg-hover": BASE_COLORS[800],
                  "bg-selected": BASE_COLORS[700],
                },
              },
              loader: {
                bg: BASE_COLORS[500],
                fill: BASE_COLORS[50],
              },
              markerpanel: {
                bodybackground: BASE_COLORS[900],
              },
              menu: {
                bg: BASE_COLORS[800],
                "bg-hover": BASE_COLORS[700],
                selected: BASE_COLORS[700],
                border: BASE_COLORS[700],
                text: {
                  primary: BASE_COLORS[50],
                  secondary: BASE_COLORS[400],
                  header: BASE_COLORS[500],
                },
                divider: BASE_COLORS[700],
              },
              modal: {
                bg: BASE_COLORS[900],
                border: BASE_COLORS[700],
              },
              toast: {
                bg: BASE_COLORS[800],
                border: BASE_COLORS[700],
                title: BASE_COLORS[50],
                caption: BASE_COLORS[400],
                "icon-close": BASE_COLORS[500],
                "button-hover": BASE_COLORS[700],
                "icon-success": GREEN_COLORS[300],
                "icon-error": RED_COLORS[400],
                "icon-warning": AMBER_COLORS[500],
              },
              text: {
                primary: BASE_COLORS[50],
                secondary: BASE_COLORS[400],
                selection: PRIMARY_COLORS[400],
              },
              tooltip: {
                bg: BASE_COLORS[700],
                border: BASE_COLORS[600],
                text: BASE_COLORS[50],
              },
              combination: {
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
              "workspace-switcher": {
                bg: BASE_COLORS[800],
                "bg-hover": BASE_COLORS[700],
                "bg-active": BASE_COLORS[700],
                text: BASE_COLORS[50],
              },
              link: {
                border: BASE_COLORS[700],
                "bg-hover": BASE_COLORS[800],
                "bg-selected": BASE_COLORS[700],
                "tree-lines": BASE_COLORS[600],
                text: {
                  primary: BASE_COLORS[50],
                  secondary: BASE_COLORS[400],
                  headers: BASE_COLORS[500],
                },
              },
              carousel: {
                controls: {
                  bg: BASE_COLORS[800],
                  active: BASE_COLORS[500],
                  inactive: BASE_COLORS[600],
                },
              },
              "asset-card": {
                bg: BASE_COLORS[900],
                "bg-hover": BASE_COLORS[800],
                "bg-select": BASE_COLORS[700],
                "text-sucess": GREEN_COLORS[500],
                "text-danger": RED_COLORS[500],
                "card-bg": BASE_COLORS[700],
                "folder-bg": BASE_COLORS[600],
              },
              checkbox: {
                checked: {
                  bg: BASE_COLORS[50],
                  text: BASE_COLORS[900],
                },
                unchecked: {
                  border: BASE_COLORS[600],
                  "hover-bg": BASE_COLORS[700],
                },
              },
              "filter-bar": {
                bg: BASE_COLORS[800],
                label: BASE_COLORS[500],
              },
              "combo-pill": {
                bg: BASE_COLORS[700],
                "bg-label": BASE_COLORS[600],
                label: BASE_COLORS[50],
              },
              "asset-preview": {
                bg: BASE_COLORS[800],
                text: {
                  primary: BASE_COLORS[50],
                  secondary: BASE_COLORS[400],
                },
              },
              comment: {
                input: {
                  bg: BASE_COLORS[800],
                  text: BASE_COLORS[50],
                  "text-default": BASE_COLORS[400],
                  "text-action": PRIMARY_COLORS[300],
                  border: BASE_COLORS[700],
                },
              },
              pills: {
                attachments: {
                  bg: BASE_COLORS[700],
                  text: BASE_COLORS[50],
                  icon: BASE_COLORS[400],
                  "icon-bg": BASE_COLORS[800],
                },
                tags: {
                  bg: PRIMARY_COLORS[900],
                  text: PRIMARY_COLORS[300],
                },
              },
              "settings-card-pill": {
                lighter: {
                  bg: PRIMARY_COLORS[800],
                  border: BASE_COLORS[50],
                },
                darker: {
                  bg: PRIMARY_COLORS[900],
                  border: BASE_COLORS[50],
                },
              },
              timestamp: {
                "bg-selected": PRIMARY_COLORS[900],
                "bg-hover": BASE_COLORS[700],
                "text-selected": PRIMARY_COLORS[300],
                "text-default": BASE_COLORS[400],
              },
              videoplayer: {
                bg: BASE_COLORS[800],
                border: "rgba(255, 255, 255, 0.16)",
                "bg-video": BASE_COLORS[800],
                "bg-selected": PRIMARY_COLORS[500],
                text: {
                  primary: BASE_COLORS[200],
                  secondary: BASE_COLORS[500],
                  selected: PRIMARY_COLORS[50],
                },
                controls: {
                  bg: BASE_COLORS[700],
                  active: BASE_COLORS[200],
                  default: BASE_COLORS[600],
                  hover: BASE_COLORS[600],
                  icon: BASE_COLORS[50],
                  commenting: {
                    slider: {
                      // the default bg color of the slider is active color but at 10% opacity.
                      active: BASE_COLORS[100],
                    },
                  },
                  overlay: {
                    slider: {
                      active: BASE_COLORS[100],
                    },
                  },
                },
                "icon-button": {
                  "bg-selected": PRIMARY_COLORS[900],
                  "bg-hover": BASE_COLORS[700],
                  "text-selected": PRIMARY_COLORS[300],
                  "text-default": BASE_COLORS[400],
                },
              },
              search: {
                bg: TRANSLUCENT_COLORS[900],
                outline: TRANSLUCENT_COLORS[700],
                "search-item": {
                  "bg-hover": TRANSLUCENT_COLORS[700],
                  "bg-selected": TRANSLUCENT_COLORS[600],
                },
              },
              toggle: {
                default: {
                  "bg-from": BASE_COLORS[600],
                  "bg-to": BASE_COLORS[500],
                  "knob-bg": BASE_COLORS[500],
                  "knob-ridge": BASE_COLORS[400],
                },
                selected: {
                  "bg-from": PRIMARY_COLORS[500],
                  "bg-to": PRIMARY_COLORS[400],
                  "knob-bg": BASE_COLORS[50],
                  "knob-ridge": PRIMARY_COLORS[100],
                },
              },
              "white-board": {
                bg: BASE_COLORS[800],
                outline: BASE_COLORS[700],
                grid: BASE_COLORS[700],
                "card-bg": BASE_COLORS[700],
                "status-bg": BASE_COLORS[800],
                pill: {
                  bg: BASE_COLORS[700],
                  "bg-active": PRIMARY_COLORS[900],
                  connector: BASE_COLORS[600],
                  "connector-active": PRIMARY_COLORS[400],
                },
              },
            },
            background: {
              50: BASE_COLORS[900],
              100: BASE_COLORS[800],
              200: BASE_COLORS[700],
              300: BASE_COLORS[600],
              400: BASE_COLORS[500],
              500: BASE_COLORS[400],
              600: BASE_COLORS[300],
              700: BASE_COLORS[200],
              800: BASE_COLORS[100],
              900: BASE_COLORS[50],
              DEFAULT: BASE_COLORS[900],
            },
            default: {
              50: BASE_COLORS[900],
              100: BASE_COLORS[800],
              200: BASE_COLORS[700],
              300: BASE_COLORS[600],
              400: BASE_COLORS[500],
              500: BASE_COLORS[400],
              600: BASE_COLORS[300],
              700: BASE_COLORS[200],
              800: BASE_COLORS[100],
              900: BASE_COLORS[50],
              DEFAULT: BASE_COLORS[600],
            },
            foreground: BASE_COLORS[50],
            primary: {
              50: PRIMARY_COLORS[900],
              100: PRIMARY_COLORS[800],
              200: PRIMARY_COLORS[700],
              300: PRIMARY_COLORS[600],
              400: PRIMARY_COLORS[500],
              500: PRIMARY_COLORS[400],
              600: PRIMARY_COLORS[300],
              700: PRIMARY_COLORS[200],
              800: PRIMARY_COLORS[100],
              900: PRIMARY_COLORS[50],
            },
            secondary: {
              50: BASE_COLORS[900],
              100: BASE_COLORS[800],
              200: BASE_COLORS[700],
              300: BASE_COLORS[600],
              400: BASE_COLORS[500],
              500: BASE_COLORS[400],
              600: BASE_COLORS[300],
              700: BASE_COLORS[200],
              800: BASE_COLORS[100],
              900: BASE_COLORS[50],
            },
            focus: BASE_COLORS[50],
            divider: BASE_COLORS[400],
            danger: RED_COLORS[400],
            success: GREEN_COLORS[300],
            warning: AMBER_COLORS[500],
            overlay: BASE_COLORS[700],
            content1: BASE_COLORS[900],
            translucent: {
              50: TRANSLUCENT_COLORS[50],
              100: TRANSLUCENT_COLORS[100],
              200: TRANSLUCENT_COLORS[200],
              300: TRANSLUCENT_COLORS[300],
              400: TRANSLUCENT_COLORS[400],
              500: TRANSLUCENT_COLORS[500],
              600: TRANSLUCENT_COLORS[600],
              700: TRANSLUCENT_COLORS[700],
              800: TRANSLUCENT_COLORS[800],
              900: TRANSLUCENT_COLORS[900],
            },
          },
        },
      },
    }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
    plugin(
      function ({ matchUtilities, theme }) {
        matchUtilities(
          {
            // map to bg-radient-[*]
            "bg-radient": (value) => ({
              "background-image": `radial-gradient(${value},var(--tw-gradient-stops))`,
            }),
          },
          { values: theme("radialGradients") }
        );
      },
      {
        theme: {
          radialGradients: _presets(),
        },
      }
    ),
    require("./plugin/tailwind-animate.ts"),
    require("tailwindcss-3d"),
    require("tailwindcss-react-aria-components"),
    // require("@vidstack/react/tailwind.cjs"),
  ],
};
export default config;

/**
 * utility class presets
 */
function _presets() {
  const shapes = ["circle", "ellipse"];
  const pos = {
    c: "center",
    t: "top",
    b: "bottom",
    l: "left",
    r: "right",
    tl: "top left",
    tr: "top right",
    bl: "bottom left",
    br: "bottom right",
  };
  const result = {};
  for (const shape of shapes) {
    for (const [posName, posValue] of Object.entries(pos)) {
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;
    }
  }

  return result;
}
