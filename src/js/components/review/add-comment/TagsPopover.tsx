import { useState } from 'react';

import { useComments } from '@/context/comments';

import { Tag } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import TagSuggestion from '@/components/ui/mentions/TagSuggestion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

interface TagsPopoverProps {
  onSelect: (value: string) => void;
}

export const TagsPopover = ({ onSelect }: TagsPopoverProps) => {
  const { hashtags } = useComments();
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (name: string) => {
    onSelect(name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % hashtags.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + hashtags.length) % hashtags.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(hashtags[focusedIndex].name);
    }
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <PopoverTrigger>
        <Button size="sm" variant="light" isIconOnly aria-label="Add tag">
          <Tag size={16} className="text-default-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent onKeyDown={handleKeyDown}>
        <div className="flex max-w-80 flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <div
              key={tag.id}
              onPointerDown={() => handleSelect(tag.name)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <TagSuggestion tag={tag} focused={focusedIndex === index} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
