import styled from '@emotion/styled';
import {
  Container,
  Grid,
  LoadingOverlay,
  Paper,
  rem,
  Select,
  Stack,
  Tabs,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconClipboardData,
  IconDatabaseImport,
  IconHelpOctagon,
  IconUserSearch,
} from '@tabler/icons-react';
import { YearPickerInput } from '@mantine/dates';
import { Suspense, useState } from 'react';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { PageHeader } from '@/components';
import { dashboardRoute } from '@/routes';
import '@mantine/dates/styles.css';
import TableReportTmp01 from './components/TableReportTmp01';
import TableReportTmp02 from './components/TableReportTmp02';
import TableReportTmp03 from './components/TableReportTmp03';
import { ResultResponse, SurveyPeriod } from '@/types';
import { SurveyPeriodListParams, useSurveyPeriodService } from '@/services/surveyPeriodService';
import Status from '@/enums/status.enum';

type StudentAdminTab = 'reportTemplateOne' | 'reportTemplateTwo' | 'reportTemplateThree';

const StatisticOverview = () => {
  const [activeTab, setActiveTab] = useState<StudentAdminTab | null>('reportTemplateOne');
  const iconStyle = { width: rem(24), height: rem(24) };
  const listStatistics = [
    {
      id: 1,
      name: 'Báo cáo tình hình việc làm của sinh viên tốt nghiệp',
      icon: IconUserSearch,
      link: 'reportTemplateOne',
    },
    {
      id: 2,
      name: 'Báo cáo danh sách sinh viên tốt nghiệp',
      icon: IconDatabaseImport,
      link: 'reportTemplateTwo',
    },
    {
      id: 3,
      name: 'Báo cáo danh sách sinh viên phản hồi khảo sát',
      icon: IconClipboardData,
      link: 'reportTemplateThree',
    },
  ];

  const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
  const [year, setYear] = useState<number | null>(null);
  const surveyPeriodService = useSurveyPeriodService();

  const [surveyPeriodParams, setSurveyPeriodParams] = useState<SurveyPeriodListParams>({
    status: Status.Enable,
    ...(year && { year: Number(year) }),
  });
  const handleGetListSurveyPeriod = () =>
    surveyPeriodService
      .getList(surveyPeriodParams)
      .then((res) => res.data)
      .catch((error) => error);
  const { data, isLoading } = useSWR<ResultResponse<SurveyPeriod[]>>(
    [surveyPeriodParams],
    handleGetListSurveyPeriod
  );

  const dataOptionSurvey = data?.data?.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const survey = data?.data.find((item) => item.id === Number(selectedSurvey));

  return (
    <StatisticOverviewPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Báo cáo - Tổng hợp báo cáo khảo sát việc làm"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Báo cáo - thống kê', href: null },
            ]}
          />
          <Paper p="md" shadow="md" radius="md">
            <Grid style={{ margin: '16px 16px 16px 16px', marginBottom: '26px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: '20px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <p
                    style={{ margin: 0, fontSize: '18px', fontWeight: '500', marginRight: '10px' }}
                  >
                    Năm tốt nghiệp
                  </p>
                  <YearPickerInput
                    value={year ? new Date(year, 0) : null}
                    leftSection={icon}
                    placeholder="Chọn năm tốt nghiệp"
                    maxDate={new Date()}
                    style={{
                      height: '100%',
                      borderRadius: '4px',
                      width: '300px',
                    }}
                    size="md"
                    onChange={(date) => {
                      setYear(dayjs(date).year());
                      setSurveyPeriodParams((params) => ({
                        ...params,
                        year: dayjs(date).year(),
                      }));
                      setSelectedSurvey(null);
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginRight: '10px',
                    }}
                  >
                    <span style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>
                      Chọn đợt khảo sát việc làm
                    </span>
                    <Tooltip
                      multiline
                      w={500}
                      withArrow
                      position="bottom-start"
                      transitionProps={{ duration: 200 }}
                      label="Chọn năm tốt nghiệp để hiển thị danh sách đợt khảo sát việc làm"
                      offset={20}
                    >
                      <IconHelpOctagon
                        style={{ width: rem(20), height: rem(20), cursor: 'pointer' }}
                        stroke={1.8}
                      />
                    </Tooltip>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <LoadingOverlay visible={isLoading} />
                    <Select
                      value={selectedSurvey}
                      disabled={!year}
                      placeholder="Chọn đợt khảo sát việc làm"
                      style={{
                        height: '100%',
                        borderRadius: '4px',
                        width: '500px',
                      }}
                      data={
                        dataOptionSurvey?.length
                          ? dataOptionSurvey.map((item) => ({
                              ...item,
                              value: String(item.value),
                            }))
                          : [
                              {
                                label: 'Không có dữ liệu',
                                value: '0',
                                disabled: true,
                              },
                            ]
                      }
                      searchable
                      clearable={false}
                      onChange={(value) => {
                        setSelectedSurvey(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid>
              <Grid.Col span={12}>
                <Stack gap={4}>
                  <Tabs
                    value={activeTab}
                    onChange={(value) => setActiveTab(value as StudentAdminTab)}
                  >
                    <Tabs.List style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
                      {listStatistics.map((item) => (
                        <Tooltip
                          color="blue"
                          multiline
                          w={500}
                          withArrow
                          position="bottom-start"
                          transitionProps={{ duration: 200 }}
                          label={item.name}
                          offset={20}
                        >
                          <Tabs.Tab
                            style={{}}
                            key={item.id}
                            value={item.link}
                            leftSection={<item.icon style={iconStyle} />}
                          >
                            <span
                              style={{
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '20px',
                                maxWidth: '300px', // Adjust the maxWidth as needed
                                display: 'inline-block',
                              }}
                            >
                              {item.name}
                            </span>
                          </Tabs.Tab>
                        </Tooltip>
                      ))}
                    </Tabs.List>

                    <Suspense fallback={<LoadingOverlay visible />}>
                      <Tabs.Panel value="reportTemplateOne">
                        {activeTab === 'reportTemplateOne' && (
                          <>
                            <TableReportTmp01 survey={survey} />
                          </>
                        )}
                      </Tabs.Panel>
                      <Tabs.Panel value="reportTemplateTwo">
                        {activeTab === 'reportTemplateTwo' && (
                          <>
                            <TableReportTmp02 survey={survey} />
                          </>
                        )}
                      </Tabs.Panel>
                      <Tabs.Panel value="reportTemplateThree">
                        {activeTab === 'reportTemplateThree' && (
                          <>
                            <TableReportTmp03 survey={survey} />
                          </>
                        )}
                      </Tabs.Panel>
                    </Suspense>
                  </Tabs>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </StatisticOverviewPageStyled>
  );
};

const StatisticOverviewPageStyled = styled.div`
  .mantine-Select-wrapper,
  .mantine-Select-input {
    height: 100%;
  }
`;

export default StatisticOverview;
