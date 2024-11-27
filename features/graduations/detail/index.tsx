import styled from '@emotion/styled';
import { Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Graduation, ResultResponse } from '@/types';
import { useGraduationService } from '@/services/graduationService';
import { graduationRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentGraduation from '../components/StudentGraduationContent';

const GraduationDetailPage = () => {
  const { getGraduationById } = useGraduationService();
  const { query, push } = useRouter();
  const { id } = query;

  const handleGetGraduationById = () =>
    getGraduationById(Number(id))
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

  const { data, isLoading } = useSWR<ResultResponse<Graduation>>(id, handleGetGraduationById);

  return (
    <GraduationDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Đợt tốt nghiệp - Thông tin - #${data?.data?.id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Đợt tốt nghiệp', href: graduationRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Button
                      component={Link as any}
                      href={graduationRoute.list}
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
                        {data?.data?.name ?? ''}
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6} style={{ borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                    <Stack gap={3} ta="left">
                      <Text size="md" fw={400}>
                        Số quyết định tốt nghiệp:
                      </Text>
                      <Text size="lg" fw={500}>
                        Ban hành kèm theo quyết đinh số {data?.data?.certification} ngày{' '}
                        {formatDateString(data?.data?.certification_date, 'dd/mm/yyyy')}
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>
                      {data?.data && <StudentGraduation graduation={data?.data} />}
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </GraduationDetailPageStyled>
  );
};

const GraduationDetailPageStyled = styled.div``;

export default GraduationDetailPage;
