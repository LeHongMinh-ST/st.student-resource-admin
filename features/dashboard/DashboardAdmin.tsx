import React from 'react';
import {
  IconAlertTriangle,
  IconBook,
  IconMessage,
  IconMessageQuestion,
  IconSchool,
  IconUserEdit,
  IconUsersGroup,
} from '@tabler/icons-react';
import { Box, Grid, SimpleGrid } from '@mantine/core';
import { User } from '@/types';
import StatsCard from '@/features/dashboard/components/StatsCard';
import CardList from '@/features/dashboard/components/CardList';

type DashboardAdminProp = {
  user: User;
};

const DashboardAdmin: React.FC<DashboardAdminProp> = (props) => {
  const { user } = props;
  console.log(user);
  return (
    <>
      <Box>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <StatsCard
            icon={IconUsersGroup}
            title="Tổng sinh viên"
            value={1000}
            description="Tổng số sinh viên đang theo học"
          />
          <StatsCard
            icon={IconSchool}
            title="Sinh viên tốt nghiệp"
            value={400}
            description="Tổng số sinh viên đã tốt nghiệp"
          />
          <StatsCard
            icon={IconAlertTriangle}
            title="Cảnh báo sinh viên"
            value={100}
            description="Sinh viên thuộc diện cảnh cáo"
          />
          <StatsCard
            icon={IconBook}
            title="Lớp học"
            value={30}
            description="Tổng số lớp học đang hoạt động"
          />
        </SimpleGrid>
      </Box>
      <Grid gutter={{ base: 'md', sm: 'md', md: 'xl' }}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CardList title="Yêu cầu duyệt thông tin" titleIcon={IconUserEdit} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CardList
            title="Phản ánh sinh viên"
            titleIcon={IconMessageQuestion}
            emptyImage="/images/empty3.svg"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CardList title="Thông báo" titleIcon={IconMessage} emptyImage="/images/empty2.svg" />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default DashboardAdmin;
