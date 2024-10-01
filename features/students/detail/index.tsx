import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Button, Container, Grid, Paper, Skeleton, Stack } from '@mantine/core';
import Link from 'next/link';
import { IconLogout } from '@tabler/icons-react';
import { PageHeader } from '@/components';
import { dashboardRoute, studentRoute } from '@/routes';
import { useStudentService } from '@/services/studentService';
import StudentThumbnail from '@/features/students/detail/components/InfoStudent/StudentThumbnail';
import { ResultResonse, Student } from '@/types';

const StudentDetailPage = () => {
  const { getStudentById } = useStudentService();
  const { query } = useRouter();
  const { id } = query;
  const handleGetStudentById = () => getStudentById(Number(id)).then((res) => res.data);
  const { data, isLoading } = useSWR<ResultResonse<Student>>([id], handleGetStudentById);

  return (
    <StudentDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title="Sinh Viên - Thông tin sinh viên"
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Danh sách sinh viên', href: studentRoute.listCourse },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <Button
                  component={Link}
                  href={studentRoute.listCourse}
                  leftSection={<IconLogout size={18} />}
                >
                  Quay lại
                </Button>
              }
            />
          </Skeleton>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
              <StudentThumbnail student={data?.data} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 8, md: 8, lg: 9 }}>
              <Paper p="md" shadow="md" radius="md">
                3
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </StudentDetailPageStyled>
  );
};

const StudentDetailPageStyled = styled.div``;

export default StudentDetailPage;
