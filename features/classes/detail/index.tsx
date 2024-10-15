import styled from '@emotion/styled';
import { Button, Container, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Class, ResultResonse } from '@/types';
import { useClassService } from '@/services/classService';
import { classRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';

const ClassDetailPage = () => {
  const { getClassById } = useClassService();
  const { query } = useRouter();
  const { id } = query;
  const handleGetClassById = () =>
    getClassById(Number(id))
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

  const { data, isLoading } = useSWR<ResultResonse<Class>>(id, handleGetClassById);

  return (
    <ClassDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title="Lớp - Thông tin lớp"
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
                  <Grid.Col span={4}>
                    <Stack gap={4}>
                      <Text size="xl">Mã lớp:</Text>
                      <Text size="xl">{data?.data?.code ?? ''}</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack gap={4}>
                      <Text size="xl">Tên lớp:</Text>
                      <Text size="xl">{data?.data?.name ?? ''}</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack gap={4}>
                      <Text size="xl">Giáo viên chủ nhiệm:</Text>
                      <Text size="xl">
                        {data?.data?.teacher?.first_name
                          ? `${data?.data?.teacher?.first_name} ${data?.data?.teacher?.last_name}`
                          : 'Chưa cập nhật'}
                      </Text>
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

export default ClassDetailPage;
