import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { lazy, Suspense, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  LoadingOverlay,
  Paper,
  rem,
  Skeleton,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { IconInfoCircle, IconLogout, IconBook, IconBackpack } from '@tabler/icons-react';
import { PageHeader } from '@/components';
import { dashboardRoute, studentRoute } from '@/routes';
import { useStudentService } from '@/services/studentService';
import StudentThumbnail from '@/features/students/detail/components/InfoStudent/StudentThumbnail';
import { ResultResonse, Student } from '@/types';

const GeneralInfoStudent = lazy(() => import('./components/InfoStudent/GeneralInfoStudent'));

type ActiveTabType = 'general' | 'class' | 'learning_outcome';

const StudentDetailPage = () => {
  const { getStudentById } = useStudentService();
  const { query } = useRouter();
  const { id } = query;
  const handleGetStudentById = () => getStudentById(Number(id)).then((res) => res.data);
  const { data, isLoading } = useSWR<ResultResonse<Student>>([id], handleGetStudentById);
  const [activeTab, setActiveTab] = useState<ActiveTabType | null>('general');
  const iconStyle = { width: rem(24), height: rem(24) };

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
                <Tabs value={activeTab} onChange={(value: ActiveTabType) => setActiveTab(value)}>
                  <Tabs.List>
                    <Tabs.Tab value="general" leftSection={<IconInfoCircle style={iconStyle} />}>
                      <Text fw={500} size="md">
                        Thông tin chung
                      </Text>
                    </Tabs.Tab>
                    <Tabs.Tab value="class" leftSection={<IconBook style={iconStyle} />}>
                      <Text fw={500} size="md">
                        Lớp học
                      </Text>
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="learning_outcome"
                      leftSection={<IconBackpack style={iconStyle} />}
                    >
                      <Text fw={500} size="md">
                        Điểm
                      </Text>
                    </Tabs.Tab>
                  </Tabs.List>

                  <Suspense fallback={<LoadingOverlay visible />}>
                    <Tabs.Panel value="general">
                      {activeTab === 'general' && <GeneralInfoStudent />}
                    </Tabs.Panel>
                    <Tabs.Panel value="class">
                      {activeTab === 'class' && <GeneralInfoStudent />}
                    </Tabs.Panel>
                    <Tabs.Panel value="learning_outcome">
                      {activeTab === 'learning_outcome' && <GeneralInfoStudent />}
                    </Tabs.Panel>
                  </Suspense>
                </Tabs>
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
