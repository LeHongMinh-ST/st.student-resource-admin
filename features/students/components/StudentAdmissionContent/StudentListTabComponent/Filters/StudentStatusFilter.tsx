import React from 'react';
import { Select } from '@mantine/core';
import { StudentStatusSelectList } from '@/constants/commons';
import { StudentStatus } from '@/enums';

interface StudentStatusFilterProps {
  value?: StudentStatus | null;
  onChange: (value: StudentStatus | null) => void;
}

const StudentStatusFilter: React.FC<StudentStatusFilterProps> = ({ value, onChange }) => (
  <Select
    label="Trạng thái"
    clearable
    placeholder="Chọn trạng thái"
    data={StudentStatusSelectList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as StudentStatus)}
  />
);

export default StudentStatusFilter;
