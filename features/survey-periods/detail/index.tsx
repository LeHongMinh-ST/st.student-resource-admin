import styled from '@emotion/styled';
import { Button, Container, Divider, Grid, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { SurveyPeriod, ResultResonse } from '@/types';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import { surveyPeriodRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentListByServeyPeriod from '@/features/survey-periods/components/StudentListBySurveyPeriodComponent/StudentListByServeyPeriod';

const SurveyPeriodDetailPage = () => {
  const { getSurveyPeriod } = useSurveyPeriodService();
  const { query, push } = useRouter();
  const { id } = query;

  const handleGetSurveyPeriodById = () =>
    getSurveyPeriod(Number(id))
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

  const { data, isLoading } = useSWR<ResultResonse<SurveyPeriod>>(id, handleGetSurveyPeriodById);

  return (
    <SurveyPeriodDetailPageStyled>
      <Container fluid>
        <Stack>
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Đợt khảo sát - Thông tin - #${data?.data?.id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Đợt khảo sát', href: surveyPeriodRoute.list },
                { title: 'Thông tin', href: null },
              ]}
              withActions={
                <div className="flex">
                  <Stack gap={4}>
                    <Button
                      component={Link as any}
                      href={surveyPeriodRoute.list}
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
                        {data?.data?.title ?? ''}
                      </Text>
                    </Stack>
                    <Stack gap={3} ta="left" mt={20}>
                      <Text size="md" fw={400}>
                        Thời gian khảo sát:
                      </Text>
                      <Text size="lg">
                        Thời gian khảo sát từ ngày{' '}
                        <b>{formatDateString(data?.data?.start_date, 'dd/mm/yyyy')}</b> đến ngày{' '}
                        <b>{formatDateString(data?.data?.end_date, 'dd/mm/yyyy')}</b>
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={12}>
                    <Divider size="xs" my={30} />
                    <Stack gap={4}>
                      {data?.data && (
                        <StudentListByServeyPeriod surveyPeriodId={Number(data.data.id)} />
                      )}
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </SurveyPeriodDetailPageStyled>
  );
};

const SurveyPeriodDetailPageStyled = styled.div``;

export default SurveyPeriodDetailPage;
