// https://github.com/jamiebuilds/tailwindcss-animate/pull/46/files#diff-e727e4bdf3657fd1d798edcd6b099d6e092f8573cba266154583a746bba0f346
// This is a fork of the tailwindcss-animate pluging
// It seperates animation duration from transition duration

import plugin from "tailwindcss/plugin";

type ThemeFunction = (path: string) => Record<string, string | number>;

function filterDefault(values: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => key !== "DEFAULT")
  );
}

module.exports = plugin(
  ({ addUtilities, matchUtilities, theme }) => {
    addUtilities({
      "@keyframes enter": theme("keyframes.enter"),
      "@keyframes exit": theme("keyframes.exit"),
      ".animate-in": {
        animationName: "enter",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-enter-opacity": "initial",
        "--tw-enter-scale": "initial",
        "--tw-enter-rotate": "initial",
        "--tw-enter-translate-x": "initial",
        "--tw-enter-translate-y": "initial",
      },
      ".animate-out": {
        animationName: "exit",
        animationDuration: theme("animationDuration.DEFAULT"),
        "--tw-exit-opacity": "initial",
        "--tw-exit-scale": "initial",
        "--tw-exit-rotate": "initial",
        "--tw-exit-translate-x": "initial",
        "--tw-exit-translate-y": "initial",
      },
    });

    matchUtilities(
      {
        "fade-in": (value: string) => ({ "--tw-enter-opacity": value }),
        "fade-out": (value: string) => ({ "--tw-exit-opacity": value }),
      },
      { values: theme("animationOpacity") }
    );

    matchUtilities(
      {
        "zoom-in": (value: string) => ({ "--tw-enter-scale": value }),
        "zoom-out": (value: string) => ({ "--tw-exit-scale": value }),
      },
      { values: theme("animationScale") }
    );

    matchUtilities(
      {
        "spin-in": (value: string) => ({ "--tw-enter-rotate": value }),
        "spin-out": (value: string) => ({ "--tw-exit-rotate": value }),
      },
      { values: theme("animationRotate") }
    );

    matchUtilities(
      {
        "slide-in-from-top": (value: string) => ({
          "--tw-enter-translate-y": `-${value}`,
        }),
        "slide-in-from-bottom": (value: string) => ({
          "--tw-enter-translate-y": value,
        }),
        "slide-in-from-left": (value: string) => ({
          "--tw-enter-translate-x": `-${value}`,
        }),
        "slide-in-from-right": (value: string) => ({
          "--tw-enter-translate-x": value,
        }),
        "slide-out-to-top": (value: string) => ({
          "--tw-exit-translate-y": `-${value}`,
        }),
        "slide-out-to-bottom": (value: string) => ({
          "--tw-exit-translate-y": value,
        }),
        "slide-out-to-left": (value: string) => ({
          "--tw-exit-translate-x": `-${value}`,
        }),
        "slide-out-to-right": (value: string) => ({
          "--tw-exit-translate-x": value,
        }),
      },
      { values: theme("animationTranslate") }
    );

    matchUtilities(
      {
        "animation-duration": (value: unknown) => ({
          animationDuration: value as string,
        }),
      },
      { values: filterDefault(theme("animationDuration")) }
    );

    matchUtilities(
      { delay: (value: string) => ({ animationDelay: value }) },
      { values: theme("animationDelay") }
    );

    matchUtilities(
      {
        ease: (value: unknown) => ({
          animationTimingFunction: value as string,
        }),
      },
      { values: filterDefault(theme("animationTimingFunction")) }
    );

    addUtilities({
      ".running": { animationPlayState: "running" },
      ".paused": { animationPlayState: "paused" },
    });

    matchUtilities(
      { "fill-mode": (value: string) => ({ animationFillMode: value }) },
      { values: theme("animationFillMode") }
    );

    matchUtilities(
      { direction: (value: string) => ({ animationDirection: value }) },
      { values: theme("animationDirection") }
    );

    matchUtilities(
      { repeat: (value: string) => ({ animationIterationCount: value }) },
      { values: theme("animationRepeat") }
    );
  },
  {
    theme: {
      extend: {
        animationDelay: ({ theme }: { theme: ThemeFunction }) => ({
          ...theme("transitionDelay"),
        }),
        animationDuration: ({ theme }: { theme: ThemeFunction }) => ({
          0: "0ms",
          ...theme("transitionDuration"),
        }),
        animationTimingFunction: ({ theme }: { theme: ThemeFunction }) => ({
          ...theme("transitionTimingFunction"),
        }),
        animationFillMode: {
          none: "none",
          forwards: "forwards",
          backwards: "backwards",
          both: "both",
        },
        animationDirection: {
          normal: "normal",
          reverse: "reverse",
          alternate: "alternate",
          "alternate-reverse": "alternate-reverse",
        },
        animationOpacity: ({ theme }: { theme: ThemeFunction }) => ({
          DEFAULT: 0,
          ...theme("opacity"),
        }),
        animationTranslate: ({ theme }: { theme: ThemeFunction }) => ({
          DEFAULT: "100%",
          ...theme("translate"),
        }),
        animationScale: ({ theme }: { theme: ThemeFunction }) => ({
          DEFAULT: 0,
          ...theme("scale"),
        }),
        animationRotate: ({ theme }: { theme: ThemeFunction }) => ({
          DEFAULT: "30deg",
          ...theme("rotate"),
        }),
        animationRepeat: {
          0: "0",
          1: "1",
          infinite: "infinite",
        },
        keyframes: {
          enter: {
            from: {
              opacity: "var(--tw-enter-opacity, 1)",
              transform:
                "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))",
            },
          },
          exit: {
            to: {
              opacity: "var(--tw-exit-opacity, 1)",
              transform:
                "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))",
            },
          },
        },
      },
    },
  }
);
