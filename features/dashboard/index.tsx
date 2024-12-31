import { Container, Stack } from '@mantine/core';
import { PageHeader } from '@/components';
import { User } from '@/types';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import DashboardAdmin from '@/features/dashboard/DashboardAdmin';
import Role from '@/enums/role.enum';
import DashboardTeacher from './DashboardTeacher';

const Dashboard = () => {
  const authState = useAuthStore();
  const user: User = authState.authUser ?? ({} as User);
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader user={user} title="Welcome!" hasGreetings />
        {(user.role as Role) !== Role.Teacher && <DashboardAdmin user={user} />}
        {(user.role as Role) === Role.Teacher && <DashboardTeacher user={user} />}
      </Stack>
    </Container>
  );
};

export default Dashboard;
