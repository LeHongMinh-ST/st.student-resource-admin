import React from 'react';
import { User } from '@/types';

type DashboardTeacherProp = {
  user: User;
};

const DashboardTeacher: React.FC<DashboardTeacherProp> = (props) => {
  const { user } = props;
  return (
    <>
      Teacher {user?.last_name} {user?.first_name}
    </>
  );
};
export default DashboardTeacher;
