import { Container, Stack } from '@mantine/core';
import { PageHeader } from '@/components';
import { User } from '@/types';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';
import DashboardAdmin from '@/features/dashboard/DashboardAdmin';
import DashboardTeacher from '@/features/dashboard/DashboardTeacher';

const Dashboard = () => {
  const authState = useAuthStore();
  const user: User = authState.authUser ?? ({} as User);
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader user={user} title="Welcome!" hasGreetings />
        {user?.role === Role.Admin ? (
          <DashboardAdmin user={user} />
        ) : (
          <DashboardTeacher user={user} />
        )}
      </Stack>
    </Container>
  );
};

export default Dashboard;
