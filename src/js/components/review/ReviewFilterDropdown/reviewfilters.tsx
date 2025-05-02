import React from 'react';

import {
  At,
  CalendarClock,
  CircleCheck,
  EmailNotification,
  Hashtag,
  Paperclip2,
  People
} from '@tessact/icons';

import { User } from '@/api-integration/types/auth';
import { FileReviewFilter, Tag } from '@/api-integration/types/review';

export interface Filter {
  key: string;
  label: string;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  hideSelectedIcon: boolean;
}

export type SubMenuItem = {
  label: string;
  instances?: number;
  key: string;
};

export interface Count {
  instances: number;
}

export interface FilterDropdownBase {
  label: string;
  startContent: React.ReactNode;
  subMenu: {
    title: string;
    items: Array<SubMenuItem>;
  };
}

export interface TagsFilterDropdown extends FilterDropdownBase {
  key: 'tags';
  subMenu: {
    title: string;
    items: Array<(Tag & Count) & SubMenuItem>;
  };
}

export interface MentionsFilterDropdown extends FilterDropdownBase {
  key: 'mentions';
  subMenu: {
    title: string;
    items: Array<(User & Count) & SubMenuItem>;
  };
}

export interface CommenterFilterDropdown extends FilterDropdownBase {
  key: 'commenter';
  subMenu: {
    title: string;
    items: Array<(User & Count) & SubMenuItem>;
  };
}
export interface CreatedDateFilterDropdown extends FilterDropdownBase {
  key: 'createdDate';
  subMenu: {
    title: string;
    items: Array<SubMenuItem>;
  };
}

export type FilterDropdown =
  | TagsFilterDropdown
  | MentionsFilterDropdown
  | CommenterFilterDropdown
  | CreatedDateFilterDropdown;

const iconProps = {
  className: 'text-default-500',
  size: 20
};

export const filters: Array<Filter> = [
  {
    key: 'attachments',
    label: 'Attachments',
    startContent: <Paperclip2 {...iconProps} />,
    endContent: null,
    hideSelectedIcon: false
  },
  {
    key: 'unread',
    label: 'Unread',
    startContent: <EmailNotification {...iconProps} />,
    endContent: null,
    hideSelectedIcon: false
  },
  {
    key: 'marked-as-done',
    label: 'Marked as done',
    startContent: <CircleCheck {...iconProps} />,
    endContent: null,
    hideSelectedIcon: false
  }
];

export const getFiltersWithMenu = (
  filtersForThisAsset: FileReviewFilter | undefined
): Array<FilterDropdown> => {
  const filters: Array<FilterDropdown> = [
    {
      key: 'tags',
      label: 'Tags',
      startContent: <Hashtag {...iconProps} />,
      subMenu: {
        title: 'Tags',
        items:
          filtersForThisAsset?.tags?.map((tag) => ({
            ...tag,
            instances: tag.count,
            label: tag.name,
            key: tag.id
          })) || []
      }
    },
    {
      key: 'mentions',
      label: 'Mentions',
      startContent: <At {...iconProps} />,
      subMenu: {
        title: 'Mentions',
        items:
          filtersForThisAsset?.mentioned_users?.map((user) => ({
            ...user,
            instances: user.count,
            key: user.id,
            label:
              user.profile.display_name ??
              user.profile.first_name + user.profile.last_name ??
              user.email
          })) ?? []
      }
    },
    {
      key: 'commenter',
      label: 'Commenter',
      startContent: <People {...iconProps} />,
      subMenu: {
        title: 'Commenter',
        items:
          filtersForThisAsset?.commented_users?.map((user) => ({
            ...user,
            instances: user.count,
            key: user.id,
            label:
              user.profile.display_name ??
              user.profile.first_name + user.profile.last_name ??
              user.email
          })) ?? []
      }
    },
    {
      key: 'createdDate',
      label: 'Created date',
      startContent: <CalendarClock {...iconProps} />,
      subMenu: {
        title: 'Created date',
        items: []
      }
    }
  ];
  return filters;
};
