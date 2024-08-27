import { Container, Stack } from '@mantine/core';
import { PageHeader } from '@/components';
import { User } from '@/types';

const Dashboard = () => {
  const user = { first_name: 'John Doe' } as User;
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader user={user} title="Welcome!" hasGreetings />
      </Stack>
    </Container>
  );
};

export default Dashboard;
