import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  onSearchInputChange,
  onSearch,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search keywords..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="max-w-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
        />
        <Button variant="outline" onClick={onSearch}>
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
