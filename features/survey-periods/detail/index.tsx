import styled from '@emotion/styled';
import {
  Button,
  Container,
  Divider,
  Grid,
  Menu,
  Paper,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconDotsVertical, IconDownload, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { SurveyPeriod, ResultResponse } from '@/types';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import { surveyPeriodRoute, dashboardRoute } from '@/routes';
import { HttpStatusEnum } from '@/enums';
import { PageHeader } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentListByServeyPeriod from '@/features/survey-periods/components/StudentListBySurveyPeriodComponent/StudentListByServeyPeriod';
import { useReportSurveyService } from '@/services/ReportSurveyService';

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

  const { downloadReportTemplate03, downloadReportTemplate01 } = useReportSurveyService();

  const handleDownloadTemplateFileImport = async (): Promise<void> => {
    try {
      const res = await downloadReportTemplate03({
        survey_id: Number(id),
      });
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mau_03_danh_sach_sinh_vien_phan_hoi.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: 'Lỗi!',
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  const handleDownloadTemplateOneFileImport = async (): Promise<void> => {
    try {
      const res = await downloadReportTemplate01({
        survey_id: Number(id),
      });
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'mau_01_danh_sach_sinh_vien_phan_hoi.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: 'Lỗi!',
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
  };
  const { data, isLoading } = useSWR<ResultResponse<SurveyPeriod>>(id, handleGetSurveyPeriodById);

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
                <div className="">
                  <Stack>
                    <Button
                      component={Link as any}
                      href={surveyPeriodRoute.list}
                      leftSection={<IconLogout size={18} />}
                    >
                      Quay lại
                    </Button>
                    <Menu withArrow width={150} shadow="md">
                      <Menu.Target>
                        <div style={{ cursor: 'pointer', display: 'flex' }}>
                          <Button variant="filled" size="sx">
                            Dowload file báo cáo
                            <IconDotsVertical color="white" size={18} />
                          </Button>
                        </div>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          fw={600}
                          fz="sm"
                          color="blue"
                          variant="filled"
                          // component={Link}
                          leftSection={<IconDownload size={18} />}
                          onClick={handleDownloadTemplateOneFileImport}
                          // href={studentRoute.show(student?.id)}
                        >
                          Báo cáo mẫu 01
                        </Menu.Item>
                        <Menu.Item
                          fw={600}
                          fz="sm"
                          color="blue"
                          variant="filled"
                          // component={Link}
                          leftSection={<IconDownload size={18} />}
                          onClick={handleDownloadTemplateFileImport}
                          // href={studentRoute.show(student?.id)}
                        >
                          Báo cáo mẫu 03
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                    {/* <Button
                      onClick={handleDownloadTemplateFileImport}
                      leftSection={<IconDownload size={18} />}
                    >
                      Dowload file báo cáo mẫu 03
                    </Button> */}
                  </Stack>
                </div>
              }
            />
          </Skeleton>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <Skeleton visible={isLoading}>
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
                        <Text size="lg" fw={500}>
                          Thời gian khảo sát từ ngày{' '}
                          <b>{formatDateString(data?.data?.start_date, 'dd/mm/yyyy')}</b> đến ngày{' '}
                          <b>{formatDateString(data?.data?.end_date, 'dd/mm/yyyy')}</b>
                        </Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6} style={{ borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                      <Stack gap={3} ta="left">
                        <Text size="md" fw={400}>
                          Tổng số sinh viên phản hồi/ Tổng số sinh viên:
                        </Text>
                        <Text size="lg" fw={500}>
                          {data?.data?.total_student_responses ?? ''} / {data?.data?.total_student}
                        </Text>
                      </Stack>
                      <Stack gap={3} ta="left" mt={20}>
                        <Text size="md" fw={400}>
                          Tỷ lệ sinh viên phản hồi:
                        </Text>
                        <Text size="lg" fw={500}>
                          {(
                            (Number(data?.data?.total_student_responses) /
                              Number(data?.data?.total_student ?? 1)) *
                            100
                          ).toFixed(2)}
                          %
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
              </Skeleton>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </SurveyPeriodDetailPageStyled>
  );
};

const SurveyPeriodDetailPageStyled = styled.div``;

export default SurveyPeriodDetailPage;
