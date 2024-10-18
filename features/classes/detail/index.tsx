import styled from '@emotion/styled';
import { Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { lazy, useState } from 'react';
import useSWR from 'swr';
import { Class, ResultResonse } from '@/types';
import { useClassService } from '@/services/classService';
import { classRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { classTypeLabels } from '@/constants/labels';
import HttpStatus from '@/enums/http-status.enum';

const StudentListByClass = lazy(
  () => import('@/features/classes/components/StudentListByClassComponent/StudentListByClass')
);

const ClassDetailPage = () => {
  const { getClassById } = useClassService();
  const { query, push } = useRouter();
  const { id } = query;

  const handleGetClassById = () =>
    getClassById(Number(id))
      .then((res) => res.data)
      .catch((error) => {
        if (error.status === HttpStatus.HTTP_NOT_FOUND) {
          push('/404').then();
        } else if (error?.status === HttpStatusEnum.HTTP_FORBIDDEN) {
          notifications.show({
            title: 'Cảnh báo!',
            message: 'Bạn không có quyền truy cập!',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        } else {
          notifications.show({
            title: 'Lỗi',
            message: 'Có lỗi sảy ra vui lòng thử lại sau !',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
        return error;
      });
  const [getListStudentParams] = useState<GetListStudentParams>({
    class_id: Number(id),
  } as GetListStudentParams);

  const { getTotalStudent } = useStudentService();
  const handleGetTotalStudentByClass = () =>
    getTotalStudent(getListStudentParams)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.status === HttpStatusEnum.HTTP_FORBIDDEN) {
          notifications.show({
            title: 'Cảnh báo!',
            message: 'Bạn không có quyền truy cập!',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        } else {
          notifications.show({
            title: 'Lỗi',
            message: 'Có lỗi sảy ra vui lòng thử lại sau !',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
        return error;
      });

  const { data: dataTotalStudent } = useSWR<any>(
    ['getTotalStudent', getListStudentParams],
    handleGetTotalStudentByClass
  );

  const { data, isLoading } = useSWR<ResultResonse<Class>>(id, handleGetClassById);

  return (
    <ClassDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Lớp - Thông tin lớp - ${data?.data?.code ?? ''}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Danh sách lớp', href: classRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Button
                      component={Link as any}
                      href={classRoute.list}
                      leftSection={<IconLogout size={18} />}
                    >
                      Quay lại
                    </Button>
                  </Stack>
                </div>
              }
            />
          </Skeleton>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <Paper p="md" shadow="md" radius="md">
                <Grid>
                  <Grid.Col span={3}>
                    <Stack gap={4} ta="left">
                      <Text size="md" fw={400}>
                        Mã lớp:
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.data?.code ?? ''}
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col
                    span={3}
                    style={{
                      root: {
                        border: 1,
                      },
                    }}
                  >
                    <Stack gap={4} ta="left">
                      <ClassDetailContainerInfo>
                        <Text size="md" fw={400}>
                          Tên lớp:
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.name ?? 'Chưa cập nhật'}
                        </Text>
                      </ClassDetailContainerInfo>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col
                    span={3}
                    style={{
                      root: {
                        border: 1,
                      },
                    }}
                  >
                    <Stack gap={4} ta="left">
                      <ClassDetailContainerInfo>
                        <Text size="md" fw={400}>
                          Loại lớp:
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.type ? classTypeLabels[data.data.type] : 'Chưa cập nhật'}
                        </Text>
                      </ClassDetailContainerInfo>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap={4} ta="left">
                      <ClassDetailContainerInfo>
                        <Text size="md" fw={400}>
                          {data?.data?.type &&
                          classTypeLabels[data.data.type] === classTypeLabels.major
                            ? 'Giáo viên môn học:'
                            : 'Giáo viên chủ nhiệm:'}
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.teacher?.first_name
                            ? `${data?.data?.teacher?.first_name} ${data?.data?.teacher?.last_name}`
                            : 'Chưa cập nhật'}
                        </Text>
                      </ClassDetailContainerInfo>
                    </Stack>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>
                      <Text size="lg" ta="left">
                        <span>Danh sách sinh viên lớp: </span>
                        <ClassInfoTotalStudent>
                          {data?.data?.code ?? ''} ({dataTotalStudent?.total} sinh viên)
                        </ClassInfoTotalStudent>
                      </Text>
                      <StudentListByClass classId={Number(id)} />
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </ClassDetailPageStyled>
  );
};

const ClassDetailPageStyled = styled.div``;
const ClassDetailContainerInfo = styled.div`
  border-top: 0px;
  border-right: 0px;
  border-bottom: 0px;
  border-left: 1px;
  border-color: #e8ebec;
  border-style: solid;
  padding-left: 20px;
`;
const ClassInfoTotalStudent = styled.span`
  font-weight: 600;
`;

export default ClassDetailPage;
