import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BlogSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search blog posts..."
        className="pl-10 w-full md:w-64 lg:w-80"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default BlogSearch;
