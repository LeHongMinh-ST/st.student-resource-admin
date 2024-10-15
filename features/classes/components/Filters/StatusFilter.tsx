import React from 'react';
import { Select } from '@mantine/core';
import { StatusEnum } from '@/enums';
import { StatusList } from '@/constants/commons';

interface StatusFilterProps {
  value?: StatusEnum | null;
  onChange: (value: StatusEnum | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => (
  <Select
    label="Trạng thái"
    clearable
    placeholder="Chọn trạng thái"
    data={StatusList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as StatusEnum)}
  />
);

export default StatusFilter;
