import { TextInput } from '@mantine/core';
import { ChangeEvent } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useSearchFilter } from '@/hooks/useSearchFilter';

interface SearchFilterProps {
  setParams: (value: string) => void;
  searchTermValue?: string;
}

const SearchFilter = ({ setParams, searchTermValue }: SearchFilterProps) => {
  const { searchTerm, handleInputSearchChange } = useSearchFilter(setParams, searchTermValue);

  return (
    <TextInput
      label="Tìm kiếm"
      description="Hiển thị các mục liên quan"
      placeholder="vd: Admin, Giáo viên..."
      leftSection={<IconSearch size={16} />}
      value={searchTerm}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputSearchChange(e.target.value)}
    />
  );
};

export default SearchFilter;
