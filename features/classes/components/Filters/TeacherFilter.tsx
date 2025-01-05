import { Select } from '@mantine/core';
import { FC } from 'react';
import { useUserOptions } from '@/hooks/useGetSelectOption';
import { useAuthStore } from '@/utils/recoil/auth/authState';

type Props = {
  label: string;
  placeholder: string;
  value?: number | null;
  onChange: (value: number | null) => void;
};

const TeacherFilter: FC<Props> = ({ value, onChange, label, placeholder }) => {
  const { authUser } = useAuthStore();
  const { userOptions } = useUserOptions(Number(authUser?.faculty_id));

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={userOptions}
      clearable
      searchable
      defaultValue={String(value)}
      value={`${value}`}
      onChange={(value) => onChange(value ? Number(value) : null)}
    />
  );
};

export default TeacherFilter;
