'use client';

import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { BlogTag } from '@/types/BlogTypes';

interface BlogTagFilterProps {
  tags: BlogTag[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

const BlogTagFilter: React.FC<BlogTagFilterProps> = ({
  tags,
  selectedTag,
  onTagChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleTagSelect = (selectedValue: string) => {
    if (selectedValue === selectedTag) {
      // If selecting the same tag, clear the filter
      onTagChange('');
    } else {
      onTagChange(selectedValue);
    }
    setOpen(false);
  };

  const clearTagFilter = () => {
    onTagChange('');
  };

  const selectedTagObj = tags.find(tag => tag.slug === selectedTag);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'justify-between min-w-[150px] h-9 px-3 py-2 text-sm font-medium transition-colors',
              'bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30',
              'hover:bg-white/70 dark:hover:bg-gray-800/70',
              'text-foreground hover:text-foreground',
              selectedTag
                ? 'bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/30'
                : ''
            )}
            role="combobox"
            aria-expanded={open}
          >
            {selectedTag ? selectedTagObj?.name : 'Filter by tag'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-lg">
          <Command value={selectedTag}>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {tags.map(tag => (
                  <CommandItem
                    className="!pointer-events-auto"
                    key={tag.id}
                    value={tag.slug}
                    onSelect={currentValue => handleTagSelect(currentValue)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedTag === tag.slug ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTag && (
        <Button variant="ghost" onClick={clearTagFilter} className="h-9 px-2">
          Clear filter
        </Button>
      )}
    </div>
  );
};

export default BlogTagFilter;
