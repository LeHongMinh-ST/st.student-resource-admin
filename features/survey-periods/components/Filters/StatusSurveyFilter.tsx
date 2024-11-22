import React from 'react';
import { Select } from '@mantine/core';
import { StatusList } from '@/constants/commons';
import StudentStatus from '@/enums/studentStatusSurvey.enum';

interface StatusFilterProps {
  value?: StudentStatus | null;
  onChange: (value: StudentStatus | null) => void;
}

const StatusSurveyFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => (
  <Select
    label="Trạng thái"
    clearable
    placeholder="Chọn trạng thái"
    data={StatusList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as StudentStatus)}
  />
);

export default StatusSurveyFilter;
