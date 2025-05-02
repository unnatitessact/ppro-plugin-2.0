import React from 'react';

import { cn } from '@nextui-org/react';

import { Tag } from '@/api-integration/types/review';

interface TagSuggestionProps {
  focused: boolean;
  tag: Tag;
}

const TagSuggestion = ({ tag, focused }: TagSuggestionProps) => {
  return (
    <div
      className={cn(
        'z-20 flex h-8 cursor-pointer items-center justify-center rounded-xl border border-ds-menu-border px-2 text-sm font-medium text-default-400 hover:bg-ds-timestamp-bg-hover',
        focused ? 'bg-ds-timestamp-bg-hover' : 'bg-transparent'
        // focused && 'bg-red-400'
      )}
      key={tag.id}
    >
      {tag.name}
    </div>
  );
};

export default TagSuggestion;
