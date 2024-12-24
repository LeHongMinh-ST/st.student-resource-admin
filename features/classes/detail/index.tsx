import styled from '@emotion/styled';
import { Box, Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { lazy } from 'react';
import useSWR from 'swr';
import { GeneralClass, ResultResponse } from '@/types';
import { useClassService } from '@/services/classService';
import { classRoute, dashboardRoute } from '@/routes';
import { ClassType, HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import { classTypeLabels } from '@/constants/labels';
import HttpStatus from '@/enums/http-status.enum';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';

const StudentListByClass = lazy(
  () => import('@/features/classes/components/StudentListByClassComponent/StudentListByClass')
);

const ClassDetailPage = () => {
  const { getStudentStatisticalById, getClassById } = useClassService();
  const { query, push, back } = useRouter();
  const { id } = query;
  const { authUser } = useAuthStore();

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

  const { data: dataStatistical } = useSWR<any>(['getDataStudentStatistical', id], () =>
    getStudentStatisticalById(Number(id)).then((res) => res.data)
  );

  const { data, isLoading } = useSWR<ResultResponse<GeneralClass>>(id, handleGetClassById);

  return (
    <ClassDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Lớp ${classTypeLabels[data?.data?.type as ClassType] ?? ''} - ${data?.data?.code ?? ''} - ${data?.data?.name ?? ''} `}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Danh sách lớp', href: classRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {authUser?.role === Role.Admin && (
                        <Button
                          component={Link as any}
                          href={classRoute.update(data?.data?.id)}
                          leftSection={<IconEdit size={18} />}
                        >
                          Chỉnh sửa
                        </Button>
                      )}
                      <Button onClick={() => back()} leftSection={<IconLogout size={18} />}>
                        Quay lại
                      </Button>
                    </Box>
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
                        {data?.data?.type &&
                        classTypeLabels[data.data.type as ClassType] === classTypeLabels.subject
                          ? 'Giáo viên môn học:'
                          : 'Giáo viên chủ nhiệm:'}
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.data?.teacher?.first_name
                          ? `${data?.data?.teacher?.last_name} ${data?.data?.teacher?.first_name} `
                          : 'Chưa cập nhật'}
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
                      <Text size="md" fw={400}>
                        Cố vấn học tập:
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.data?.sub_teacher?.first_name
                          ? `${data?.data?.sub_teacher?.last_name} ${data?.data?.sub_teacher?.first_name} `
                          : 'Chưa cập nhật'}
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
                          Lớp trưởng:
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.officer?.student_president?.full_name ?? 'Chưa có'}
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
                          Bí thư:
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.officer?.student_secretary?.full_name ?? 'Chưa có'}
                        </Text>
                      </ClassDetailContainerInfo>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap={4} ta="left">
                      <ClassDetailContainerInfo></ClassDetailContainerInfo>
                    </Stack>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>
                      <Text size="lg" ta="left">
                        <span>Danh sách sinh viên lớp: </span>
                        <ClassInfoTotalStudent>{data?.data?.code ?? ''} </ClassInfoTotalStudent>
                      </Text>

                      <Grid>
                        <Grid.Col
                          span={2}
                          style={{
                            root: {
                              border: 1,
                            },
                          }}
                        >
                          <Stack gap={4} ta="left">
                            <Text size="md" fw={400}>
                              Sĩ số ban đầu
                            </Text>
                            <Text size="lg" fw={500}>
                              {dataStatistical?.total ?? 0} Sinh viên
                            </Text>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={2}
                          style={{
                            root: {
                              border: 1,
                            },
                          }}
                        >
                          <Stack gap={4} ta="left">
                            <Text size="md" fw={400}>
                              Đang học
                            </Text>
                            <Text size="lg" fw={500}>
                              {dataStatistical?.study ?? 0} Sinh viên
                            </Text>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={2}
                          style={{
                            root: {
                              border: 1,
                            },
                          }}
                        >
                          <Stack gap={4} ta="left">
                            <ClassDetailContainerInfo>
                              <Text size="md" fw={400}>
                                Đã tốt nghiệp
                              </Text>
                              <Text size="lg" fw={500}>
                                {dataStatistical?.graduated ?? 0} Sinh viên
                              </Text>
                            </ClassDetailContainerInfo>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={2}
                          style={{
                            root: {
                              border: 1,
                            },
                          }}
                        >
                          <Stack gap={4} ta="left">
                            <ClassDetailContainerInfo>
                              <Text size="md" fw={400}>
                                Bảo lưu
                              </Text>
                              <Text size="lg" fw={500}>
                                {dataStatistical?.deferred ?? 0} Sinh viên
                              </Text>
                            </ClassDetailContainerInfo>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col
                          span={2}
                          style={{
                            root: {
                              border: 1,
                            },
                          }}
                        >
                          <Stack gap={4} ta="left">
                            <ClassDetailContainerInfo>
                              <Text size="md" fw={400}>
                                Đã nghỉ học
                              </Text>
                              <Text size="lg" fw={500}>
                                {dataStatistical?.to_drop_out ?? 0} Sinh viên
                              </Text>
                            </ClassDetailContainerInfo>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <Stack gap={4} ta="left">
                            <ClassDetailContainerInfo></ClassDetailContainerInfo>
                          </Stack>
                        </Grid.Col>
                      </Grid>
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
