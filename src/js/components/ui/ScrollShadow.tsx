import React, { forwardRef } from "react";

import { useMergedRef } from "@mantine/hooks";
import { cn, extendVariants } from "@nextui-org/react";
import { ScrollShadow as NextScrollShadow } from "@nextui-org/scroll-shadow";
import { useScrollRestoration } from "use-scroll-restoration";

export const ScrollShadowNextPrimitive = extendVariants(NextScrollShadow, {
  defaultVariants: {
    // hideScrollBar: 'false',
    // offset: 0,
    size: 0,
    // visibility: 'none',
    // isEnabled: 'false' // * We need this offset because ScrollShadow bottom shadow is not working properly
  },
});

// export const

export const ScrollShadowPrimitive = React.forwardRef<
  HTMLElement | HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    showTopBorder?: boolean;
    showBottomBorder?: boolean;
    id?: string;
    onScroll?: (event: React.UIEvent<HTMLElement | HTMLDivElement>) => void;
    style?: React.CSSProperties;
  }
>(
  (
    {
      children,
      className,
      showTopBorder = true,
      showBottomBorder = false,
      id,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <ScrollShadowNextPrimitive
        ref={ref}
        // size={0}
        // visibility="none"
        id={id}
        className={cn(
          "border-transparent",
          showTopBorder &&
            "border-t data-[top-bottom-scroll=true]:border-t-default-200 data-[top-scroll=true]:border-t-default-200",
          showBottomBorder &&
            "border-b data-[bottom-scroll=false]:border-b-transparent data-[bottom-scroll=true]:border-b-default-200 data-[top-bottom-scroll=true]:border-b-default-200 data-[top-scroll=true]:border-b-transparent",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </ScrollShadowNextPrimitive>
    );
  }
);

ScrollShadowPrimitive.displayName = "ScrollShadowPrimitive";

type ScrollShadowPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof ScrollShadowPrimitive
>;
type ScrollShadowScrollRestoredProps = ScrollShadowPrimitiveProps & {
  scrollRestorationKey: string;
};

export const ScrollShadowScrollRestored = forwardRef<
  HTMLElement | HTMLDivElement,
  ScrollShadowScrollRestoredProps
>(({ scrollRestorationKey, ...props }, ref) => {
  const { ref: scrollRef } = useScrollRestoration(scrollRestorationKey, {
    debounceTime: 200,
    persist: "sessionStorage",
  });

  const mergedRef = useMergedRef(ref, scrollRef);

  return <ScrollShadowPrimitive {...props} ref={mergedRef} />;
});

ScrollShadowScrollRestored.displayName = "ScrollShadowScrollRestored";

type ScrollShadowCustomProps = Omit<
  ScrollShadowPrimitiveProps,
  "scrollRestorationKey"
> & {
  scrollRestorationKey?: string;
};

export const ScrollShadow = forwardRef<
  HTMLElement | HTMLDivElement,
  ScrollShadowCustomProps
>(({ scrollRestorationKey, ...props }, ref) => {
  if (scrollRestorationKey) {
    return (
      <ScrollShadowScrollRestored
        ref={ref}
        scrollRestorationKey={scrollRestorationKey}
        {...props}
      />
    );
  }

  return <ScrollShadowPrimitive {...props} ref={ref} />;
});

ScrollShadow.displayName = "ScrollShadow";
