import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Box } from '@twilio-paste/core/box';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name...',
  debounceMs = 300,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value changes (e.g., when parent clears search)
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: string) => {
    // Update display value immediately for instant UI feedback
    setDisplayValue(newValue);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the onChange callback
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  return (
    <Box marginBottom="space20">
      <Label htmlFor="search-input">Search Contacts</Label>
      <Input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => handleChange(e.currentTarget.value)}
      />
    </Box>
  );
};

export default SearchBar;
