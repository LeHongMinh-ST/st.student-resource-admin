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
import { IconInfoCircle, IconLogout, IconBook } from '@tabler/icons-react';
import { PageHeader } from '@/components';
import { dashboardRoute, studentRoute } from '@/routes';
import { useStudentService } from '@/services/studentService';
import StudentThumbnail from '@/features/students/detail/components/InfoStudent/StudentThumbnail';
import { ResultResponse, Student } from '@/types';

const GeneralInfoStudent = lazy(() => import('./components/InfoStudent/GeneralInfoStudent'));
const ClassStudent = lazy(() => import('./components/InfoStudent/ClassStudent'));

type ActiveTabType = 'general' | 'class' | 'learning_outcome';

const StudentDetailPage = () => {
  const { getStudentById } = useStudentService();
  const { query, back } = useRouter();
  const { id } = query;
  const handleGetStudentById = () => getStudentById(Number(id)).then((res) => res.data);
  const { data, isLoading, mutate } = useSWR<ResultResponse<Student>>([id], handleGetStudentById);
  const [activeTab, setActiveTab] = useState<ActiveTabType | null>('general');
  const iconStyle = { width: rem(24), height: rem(24) };

  console.log('data', data);
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
                <Button onClick={() => back()} leftSection={<IconLogout size={18} />}>
                  Quay lại
                </Button>
              }
            />
          </Skeleton>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
              <StudentThumbnail mutateStudent={mutate} student={data?.data} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 8, md: 8, lg: 9 }}>
              <Paper p="md" shadow="md" radius="md">
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value as ActiveTabType)}>
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
                    {/* <Tabs.Tab */}
                    {/*   value="learning_outcome" */}
                    {/*   leftSection={<IconBackpack style={iconStyle} />} */}
                    {/* > */}
                    {/*   <Text fw={500} size="md"> */}
                    {/*     Điểm */}
                    {/*   </Text> */}
                    {/* </Tabs.Tab> */}
                  </Tabs.List>

                  <Suspense fallback={<LoadingOverlay visible />}>
                    <Tabs.Panel value="general">
                      {activeTab === 'general' && <GeneralInfoStudent studentData={data?.data} />}
                    </Tabs.Panel>
                    <Tabs.Panel value="class">
                      {activeTab === 'class' && <ClassStudent studentId={data?.data?.id} />}
                    </Tabs.Panel>
                    {/* <Tabs.Panel value="learning_outcome"> */}
                    {/*   {activeTab === 'learning_outcome' && <GeneralInfoStudent />} */}
                    {/* </Tabs.Panel> */}
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
