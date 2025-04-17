
import React from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const currentTag = searchParams.get('tag') || '';

  const handleTagSelect = (selectedValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    
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
    
    setSearchParams(newParams);
    setOpen(false);
  };

  const clearTagFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('tag');
    setSearchParams(newParams);
    setValue('');
  };

  // Initialize value from URL params when component mounts
  React.useEffect(() => {
    setValue(currentTag || '');
  }, [currentTag]);

  const selectedTag = blogTags.find(tag => tag.slug === currentTag);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[150px]"
          >
            {selectedTag ? selectedTag.name : "Filter by tag"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {blogTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.slug}
                    onSelect={() => handleTagSelect(tag.slug)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentTag === tag.slug ? "opacity-100" : "opacity-0"
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
        <Button 
          variant="ghost" 
          onClick={clearTagFilter} 
          className="h-9 px-2"
        >
          Clear filter
        </Button>
      )}
    </div>
  );
};

export default BlogTagFilter;
