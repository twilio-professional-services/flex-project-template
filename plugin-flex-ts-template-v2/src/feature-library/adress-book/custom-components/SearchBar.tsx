import React from 'react';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Box } from '@twilio-paste/core/box';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search by name...' }) => {
  return (
    <Box marginBottom="space20">
      <Label htmlFor="search-input">Search Contacts</Label>
      <Input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </Box>
  );
};

export default SearchBar;
