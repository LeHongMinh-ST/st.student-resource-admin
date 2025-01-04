import React from 'react';
import { Box, SimpleGrid, Grid } from '@mantine/core';
import {
  IconUsersGroup,
  IconSchool,
  IconAlertTriangle,
  IconBook,
  IconUserEdit,
  IconMessageQuestion,
  IconMessage,
} from '@tabler/icons-react';
import useSWR from 'swr';
import CardList from './components/CardList';
import { useDashboardService, DashboardStatistical } from '@/services/dashboardService';
import { User } from '@/types';
import StatsCard from './components/StatsCard';
import { classRoute } from '@/routes';

type DashboardTeacherProp = {
  user: User;
};

const DashboardTeacher: React.FC<DashboardTeacherProp> = () => {
  const { getDashboardStatistical } = useDashboardService();

  const handleGetDashboardStatistical = () =>
    getDashboardStatistical()
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataDaashboardStatistical, isLoading: isLoadingDashboardStatistical } =
    useSWR<DashboardStatistical>(['getDashboardStatistical'], handleGetDashboardStatistical);

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
            link={classRoute.list}
          />
          <StatsCard
            icon={IconSchool}
            title="Sinh viên tốt nghiệp"
            value={dataDaashboardStatistical?.student_graduaed_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Tổng số sinh viên đã tốt nghiệp"
            link={classRoute.list}
          />
          <StatsCard
            icon={IconAlertTriangle}
            title="Cảnh báo sinh viên"
            value={dataDaashboardStatistical?.student_warning_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Sinh viên thuộc diện cảnh cáo"
            link={classRoute.list}
          />
          <StatsCard
            icon={IconBook}
            title="Lớp học"
            value={dataDaashboardStatistical?.class_count ?? 0}
            isLoading={isLoadingDashboardStatistical}
            description="Tổng số lớp học đang hoạt động"
            link={classRoute.list}
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
export default DashboardTeacher;
