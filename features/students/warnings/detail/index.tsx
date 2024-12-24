import styled from '@emotion/styled';
import { Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { FC } from 'react';
import { Warning } from '@/types';
import { warningRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { useWarningStudentService } from '@/services/WarningStudentService';
import StudentWarning from '@/features/students/warnings/detail/components/StudentWarningContent';

type WarningDetailPageProp = {
  id: number;
};

const WarningDetailPage: FC<WarningDetailPageProp> = ({ id }) => {

  const { getWarningStudentById } = useWarningStudentService();
  const { push } = useRouter();

  const handleGetWarningById = () =>
    getWarningStudentById(Number(id))
      .then((res) => res?.data.data)
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

  const { data, isLoading } = useSWR<Warning>([id], handleGetWarningById);

  return (
    <WarningDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Cảnh báo sinh viên - Thông tin - #${data?.id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Cảnh báo sinh viên', href: warningRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Button
                      component={Link as any}
                      href={warningRoute.list}
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
                  <Grid.Col span={6}>
                    <Stack gap={3} ta="left">
                      <Text size="md" fw={400}>
                        Tiêu đề:
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.name ?? ''}
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6} style={{ borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                    <Stack gap={3} ta="left">
                      <Text size="md" fw={400}>
                        Học kỳ:
                      </Text>
                      <Text size="lg" fw={500}>
                        Học kỳ {data?.semester?.semester ?? ''} - Năm học {data?.school_year}
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>{data && <StudentWarning warning={data} />}</Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </WarningDetailPageStyled>
  );
};

const WarningDetailPageStyled = styled.div``;

export default WarningDetailPage;
