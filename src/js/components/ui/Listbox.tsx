'use client';

import {
  Listbox as NextListBox,
  ListboxItem as NextListboxItem,
  ListboxSection as NextListboxSection
} from '@nextui-org/listbox';
import { extendVariants } from '@nextui-org/react';

export const containerClassnames = {
  base: 'p-1 bg-ds-menu-bg rounded-xl',
  list: 'flex flex-col gap-1'
};

export const itemClassnames = {
  base: 'rounded-lg  data-[disabled=true]:text-ds-menu-text-secondary cursor-pointer w-full bg-transparent hover:bg-ds-menu-bg-hover data-[hover=true]:bg-ds-menu-bg-hover transition-colors aria-expanded:bg-ds-menu-bg-hover data-[disabled=true]:opacity-100',
  description:
    'text-ds-menu-text-secondary text-xs mt-1 group-hover:text-ds-menu-text-secondary group-data-[hover=true]:text-ds-menu-text-secondary group-data-[focus=true]:text-ds-menu-text-secondary data-[hover=true]:text-ds-menu-text-secondary data-[selectable=true]:focus:text-ds-menu-text-secondary',
  selectedIcon: 'text-ds-comment-input-text-action',
  title: 'font-medium'
};

export const sectionClassNames = {
  base: 'w-full mb-0 flex flex-col gap-1',
  divider: 'bg-ds-menu-divider h-divider w-full my-1',
  heading: 'text-sm font-medium text-ds-menu-text-header p-2',
  group: 'data-[has-title=true]:p-0 flex flex-col gap-1'
};

export const Listbox = extendVariants(NextListBox, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: containerClassnames
    }
  }
});

export const ListboxItem = extendVariants(NextListboxItem, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: itemClassnames
    }
  }
});

export const ListboxSection = extendVariants(NextListboxSection, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: sectionClassNames
    }
  }
});
