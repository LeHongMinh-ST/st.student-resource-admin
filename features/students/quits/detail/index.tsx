import styled from '@emotion/styled';
import { Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { FC } from 'react';
import { Quit } from '@/types';
import { quitRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum, StudentStatus } from '@/enums';
import { PageHeader } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { useQuitStudentService } from '@/services/QuitStudentService';
import StudentQuit from '@/features/students/quits/detail/components/StudentQuitContent';
import { formatDateString } from '@/utils/func/formatDateString';
import { studentStatusLabels } from '@/constants/labels';

type QuitDetailPageProp = {
  id: number;
};

const QuitDetailPage: FC<QuitDetailPageProp> = ({ id }) => {
  const { getQuitStudentById } = useQuitStudentService();
  const { push } = useRouter();

  const handleGetQuitById = () =>
    getQuitStudentById(Number(id))
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

  const { data, isLoading } = useSWR<Quit>([id], handleGetQuitById);

  return (
    <QuitDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Đợt tốt nghiệp - Thông tin - #${data?.id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Thôi học sinh viên', href: quitRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Button
                      component={Link as any}
                      href={quitRoute.list}
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
                    <Stack gap={3} ta="left">
                      <Text size="md" fw={400}>
                        Tiêu đề:
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.name ?? ''}
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4} style={{ borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                    <Stack gap={3} ta="left">
                      <Text size="md" fw={400}>
                        Loại:
                      </Text>
                      <Text size="lg" fw={500}>
                        {data?.type ? studentStatusLabels[data?.type] : ''}
                      </Text>
                    </Stack>
                  </Grid.Col>
                  {data?.type === StudentStatus.Expelled && (
                    <Grid.Col span={4} style={{ borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                      <Stack gap={3} ta="left">
                        <Text size="md" fw={400}>
                          Số quyết định buộc thôi học:
                        </Text>
                        <Text size="lg" fw={500}>
                          Ban hành kèm theo quyết đinh số {data?.certification} ngày{' '}
                          {formatDateString(data?.certification_date, 'dd/mm/yyyy')}
                        </Text>
                      </Stack>
                    </Grid.Col>
                  )}
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>{data && <StudentQuit quit={data} />}</Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </QuitDetailPageStyled>
  );
};

const QuitDetailPageStyled = styled.div``;

export default QuitDetailPage;
