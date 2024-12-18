import { Text } from '@mantine/core';
import { FC } from 'react';
import { User } from '@/types';

type TeacherNameCellTableProps = {
  user?: User;
};
const TeacherNameCellTable: FC<TeacherNameCellTableProps> = ({ user }) => {
  const fullName: string = user ? `${user?.last_name} ${user?.first_name}` : 'Chưa cập nhật';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Text>{fullName}</Text>
    </div>
  );
};

export default TeacherNameCellTable;
