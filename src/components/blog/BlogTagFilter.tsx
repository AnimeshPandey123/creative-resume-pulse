'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { blogTags } from '@/data/mockBlogData';

const BlogTagFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const currentTag = searchParams?.get('tag') ?? '';
  // Initialize value state from URL params
  const [value, setValue] = React.useState(currentTag);

  // Update value when URL params change
  useEffect(() => {
    setValue(currentTag);
  }, [currentTag]);

  const handleTagSelect = (selectedValue: string) => {
    const newParams = new URLSearchParams(
      searchParams ? searchParams.toString() : ''
    );

    if (selectedValue === currentTag) {
      // If selecting the same tag, clear the filter
      newParams.delete('tag');
      setValue('');
    } else {
      newParams.set('tag', selectedValue);
      setValue(selectedValue);
    }

    // Reset to page 1 when changing tags
    newParams.set('page', '1');

    router.push(`/blog?${newParams.toString()}`);
    setOpen(false);
  };

  const clearTagFilter = () => {
    const newParams = new URLSearchParams(
      searchParams ? searchParams.toString() : ''
    );
    newParams.delete('tag');
    router.push(`/blog?${newParams.toString()}`);
    setValue('');
  };

  const selectedTag = blogTags.find(tag => tag.slug === currentTag);

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
            {selectedTag ? selectedTag.name : 'Filter by tag'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-lg">
          <Command value={value}>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {blogTags.map(tag => (
                  <CommandItem
                    className="!pointer-events-auto"
                    key={tag.id}
                    value={tag.slug}
                    onSelect={currentValue => handleTagSelect(currentValue)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentTag === tag.slug ? 'opacity-100' : 'opacity-0'
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

      {currentTag && (
        <Button variant="ghost" onClick={clearTagFilter} className="h-9 px-2">
          Clear filter
        </Button>
      )}
    </div>
  );
};

export default BlogTagFilter;
