import React from 'react';
import { Select } from '@mantine/core';
import { StatusSurveyList } from '@/constants/commons';
import StatusSurvey from '@/enums/statusSurvey.enum';

interface StatusFilterProps {
  value?: StatusSurvey | null;
  onChange: (value: StatusSurvey | null) => void;
}

const StatusSurveyFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => (
  <Select
    label="Trạng thái"
    clearable
    placeholder="Chọn trạng thái"
    data={StatusSurveyList}
    value={value}
    onChange={(selectedValue) => onChange(selectedValue as StatusSurvey)}
  />
);

export default StatusSurveyFilter;
