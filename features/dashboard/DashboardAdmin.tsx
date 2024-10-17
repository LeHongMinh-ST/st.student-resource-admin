import React from 'react';
import { User } from '@/types';

type DashboardAdminProp = {
  user: User;
};

const DashboardAdmin: React.FC<DashboardAdminProp> = (props) => {
  const { user } = props;
  return (
    <>
      Admin {user?.last_name} {user?.first_name}
    </>
  );
};

export default DashboardAdmin;
