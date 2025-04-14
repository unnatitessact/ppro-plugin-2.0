'use client';

import { extendVariants } from '@nextui-org/react';
import { Tab as NextUITab, Tabs as NextUITabs } from '@nextui-org/tabs';

export const Tabs = extendVariants(NextUITabs, {
  defaultVariants: {
    variant: 'solid'
  },
  variants: {
    variant: {
      solid: {
        tabList: 'bg-ds-button-secondary-bg',
        tab: 'py-1 px-2'
      },
      glass: {
        tabList: 'bg-black/15 backdrop-blur',
        tabContent: 'text-ds-asset-preview-text-primary group-data-[selected=true]:text-white',
        tab: 'data-[selected]:bg-transparent data-[selected]:text-white bg-transparent',
        cursor: 'bg-white/25 dark:bg-white/25'
      }
    },
    size: {
      sm: {
        tabList: 'h-8',
        tab: 'h-6'
      }
    }
  }
});

export const Tab = extendVariants(NextUITab, {});
