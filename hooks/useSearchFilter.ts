import { useCallback, useRef, useState } from 'react';

export const useSearchFilter = <T extends Record<string, any>>(
  setParams: (params: T) => void,
  searchTermValue?: string
) => {
  const [searchTerm, setSearchTerm] = useState<string>(searchTermValue ?? '');
  const typingTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);

  const updateSearchQuery = useCallback(
    (value: string) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setParams((prevParams: T) => ({ ...prevParams, q: value }));
      }, 300); // 300ms debounce
    },
    [setParams]
  );

  const handleInputSearchChange = (value: string) => {
    setSearchTerm(value);
    updateSearchQuery(value);
  };

  return {
    searchTerm,
    handleInputSearchChange,
  };
};
