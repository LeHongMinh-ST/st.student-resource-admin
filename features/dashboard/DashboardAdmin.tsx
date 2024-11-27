import { Box, Grid, SimpleGrid } from '@mantine/core';
import {
  IconAlertTriangle,
  IconBook,
  IconMessage,
  IconMessageQuestion,
  IconSchool,
  IconUserEdit,
  IconUsersGroup,
} from '@tabler/icons-react';
import React from 'react';
import useSWR from 'swr';
import CardList from '@/features/dashboard/components/CardList';
import { User } from '@/types';
import StatsCard from '@/features/dashboard/components/StatsCard';
import { DashboardStatistical, useDashboardService } from '@/services/dashboardService';

type DashboardAdminProp = {
  user: User;
};

const DashboardAdmin: React.FC<DashboardAdminProp> = (props) => {
  const { user } = props;

  const { getDashboardStatistical } = useDashboardService();

  const handleGetDashboardStatistical = () =>
    getDashboardStatistical()
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataDaashboardStatistical, isLoading: isLoadingDashboardStatistical } =
    useSWR<DashboardStatistical>(['getDashboardStatistical'], handleGetDashboardStatistical);

  // eslint-disable-next-line no-console
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
            value={dataDaashboardStatistical?.student_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Tổng số sinh viên đang theo học"
          />
          <StatsCard
            icon={IconSchool}
            title="Sinh viên tốt nghiệp"
            value={dataDaashboardStatistical?.student_graduated_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Tổng số sinh viên đã tốt nghiệp"
          />
          <StatsCard
            icon={IconAlertTriangle}
            title="Cảnh báo sinh viên"
            value={dataDaashboardStatistical?.student_warning_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Sinh viên thuộc diện cảnh cáo"
          />
          <StatsCard
            icon={IconBook}
            title="Lớp học"
            value={dataDaashboardStatistical?.class_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Tổng số lớp học đang hoạt động"
          />
        </SimpleGrid>
      </Box>
      <Grid gutter={{ base: 'md', sm: 'md', md: 'xl' }}>
        <Grid.Col span={{ base: 12, md: 4, sm: 6 }}>
          <CardList title="Yêu cầu duyệt thông tin" titleIcon={IconUserEdit} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, sm: 6 }}>
          <CardList
            title="Phản ánh sinh viên"
            titleIcon={IconMessageQuestion}
            emptyImage="/images/empty3.svg"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
          <CardList title="Thông báo" titleIcon={IconMessage} emptyImage="/images/empty2.svg" />
        </Grid.Col>
      </Grid>
    </>
  );
};
export default DashboardAdmin;
