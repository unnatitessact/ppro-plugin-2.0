import { Button as NextUIButton } from "@nextui-org/button";
import { extendVariants } from "@nextui-org/react";

export const Button = extendVariants(NextUIButton, {
  defaultVariants: {
    disableRipple: "true",
    disableSvgPointerEvent: true,
  },
  variants: {
    color: {
      default:
        "bg-ds-button-default-bg data-[hover=true]:bg-ds-button-default-bg-hover text-ds-button-default-text disabled:text-ds-button-default-text-disabled aria-expanded:bg-ds-button-default-bg-hover",
      primary:
        "bg-ds-button-primary-bg data-[hover=true]:bg-ds-button-primary-bg-hover text-ds-button-primary-text disabled:text-ds-button-primary-text-disabled aria-expanded:bg-ds-button-primary-bg-hover",
      secondary:
        "bg-ds-button-secondary-bg data-[hover=true]:bg-ds-button-secondary-bg-hover text-ds-button-secondary-text disabled:text-ds-button-secondary-text-disabled aria-expanded:bg-ds-button-secondary-bg-hover",
      transparent:
        "bg-transparent text-ds-button-secondary-text disabled:text-ds-button-secondary-text-disabled",
      "primary-bordered":
        "bg-ds-button-default-bg border border-primary-100 text-ds-button-primary-bg",
    },
    disableHover: {
      true: " bg-transparent data-[hover=true]:bg-transparent",
    },
    size: {
      xs: "min-w-5 min-h-5 h-5",
    },
    variant: {
      dashed: "bg-transparent border border-default-300 border-dashed",
    },
    isLoading: { true: "[&>svg]:hidden" },
    isDisabled: { true: "opacity-100" },
    disableSvgPointerEvent: {
      true: "[&>svg]:pointer-events-none",
    },
  },
});
