import styled from '@emotion/styled';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  LoadingOverlay,
  MultiSelect,
  Paper,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { DateTimePicker, YearPickerInput } from '@mantine/dates';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { dashboardRoute, surveyPeriodRoute } from '@/routes';
import { Graduation, ResultResponse, SurveyPeriod } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import Status from '@/enums/status.enum';
import '@mantine/dates/styles.css';
import { GraduationListParams, useGraduationService } from '@/services/graduationService';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const SurveyPeriodCreatePage = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SurveyPeriod>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { createSurveyPeriod } = useSurveyPeriodService();
  const { getList } = useGraduationService();
  const { authUser } = useAuthStore();

  const { push } = useRouter();

  const graduationParams: GraduationListParams = {
    ...defaultPramsList,
    limit: 100,
    facultyId: authUser?.faculty_id ?? undefined,
    is_graduation_doesnt_have_survey_period: 1,
  };

  const [startDate, endDate, year] = watch(['start_date', 'end_date', 'year']);

  const handleGetListGraduation = (graduationParams: GraduationListParams) =>
    getList(graduationParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataGraduation, isLoading: isLoadingDataGraduation } = useSWR<
    ResultResponse<Graduation[]>
  >(year ? [year] : null, async () => {
    const yearFormat = dayjs(year).format('YYYY');
    return handleGetListGraduation({
      ...graduationParams,
      year: yearFormat,
      page: undefined,
    });
  });

  const [dataOptionGraduation, setDataOptionGraduation] = useState<any[]>([]);

  useEffect(() => {
    if (dataGraduation?.data) {
      setDataOptionGraduation(
        dataGraduation?.data?.map((item: Graduation) => ({
          label: `${item.name}`,
          value: `${item.id}`,
        }))
      );

      setValue('graduation_ceremony_ids', []);
    }
  }, [dataGraduation]);

  const onSubmit = async (data: SurveyPeriod) => {
    if (!isSubmitting) {
      try {
        data.start_date = dayjs(data.start_date).format('YYYY-MM-DD HH:mm');
        data.end_date = dayjs(data.end_date).format('YYYY-MM-DD HH:mm');
        data.year = Number(dayjs(data.year).format('YYYY'));
        const res = await createSurveyPeriod(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới đợt khảo sát việc làm thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(surveyPeriodRoute.list);
        }
      } catch (e: any) {
        if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
          const errors = e.response?.data?.errors;

          if (errors) {
            // @ts-ignore
            setFormErrors(errors, setError);
          }
        }
        if (e?.status === HttpStatus.HTTP_INTERNAL_SERVER_ERROR) {
          notifications.show({
            title: 'Thất bại!',
            message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
      }
    }
  };

  return (
    <SurveyPeriodCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt khảo sát việc làm - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'đợt khảo sát việc làm', href: surveyPeriodRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={surveyPeriodRoute.list}
                leftSection={<IconLogout size={18} />}
              >
                Quay lại
              </Button>
            }
          />

          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin chung">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Tiêu đề"
                          placeholder="Tiêu đề đợt khảo sát việc làm"
                          {...register('title', {
                            required: ERROR_MESSAGES.surveyPeriod.title.required,
                          })}
                          error={errors.title?.message}
                        />
                        <Textarea
                          label="Mô tả"
                          placeholder="Nội dung mô tả"
                          {...register('description', {})}
                          autosize
                          minRows={3}
                        />
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <Controller
                            name="start_date"
                            control={control}
                            rules={{
                              required: ERROR_MESSAGES.surveyPeriod.start_date.required,
                            }}
                            render={({ field }) => (
                              <DateTimePicker
                                highlightToday
                                withAsterisk
                                label="Thời gian bắt đầu khảo sát"
                                placeholder="HH:mm DD/MM/YYYY"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                onBlur={field.onBlur}
                                minDate={new Date()}
                                maxDate={endDate ? new Date(endDate) : undefined}
                                name={field.name}
                                ref={field.ref}
                                valueFormat="HH:mm DD/MM/YYYY"
                                error={errors.start_date?.message}
                              />
                            )}
                          />
                          <Controller
                            name="end_date"
                            control={control}
                            rules={{
                              required: ERROR_MESSAGES.surveyPeriod.end_date.required,
                            }}
                            render={({ field }) => (
                              <DateTimePicker
                                highlightToday
                                withAsterisk
                                label="Thời gian kết thúc khảo sát"
                                placeholder="HH:mm DD/MM/YYYY"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                valueFormat="HH:mm DD/MM/YYYY"
                                minDate={startDate ? new Date(startDate) : undefined}
                                error={errors.end_date?.message}
                              />
                            )}
                          />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1 }}>
                          <Controller
                            name="year"
                            control={control}
                            rules={{
                              required: ERROR_MESSAGES.surveyPeriod.end_date.required,
                            }}
                            render={({ field }) => (
                              <YearPickerInput
                                label="Năm tốt nghiệp"
                                placeholder="Chọn năm tốt nghiệp"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                maxDate={new Date()}
                              />
                            )}
                          />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1 }} style={{ position: 'relative' }}>
                          <LoadingOverlay visible={isLoadingDataGraduation} />
                          <Controller
                            name="graduation_ceremony_ids"
                            control={control}
                            rules={{
                              required:
                                ERROR_MESSAGES.surveyPeriod.graduation_ceremony_ids.required,
                            }}
                            render={({ field }) => (
                              <MultiSelect
                                value={field.value?.map(String)}
                                disabled={!year}
                                label="Các đợt xét tốt nghiệp"
                                placeholder="Chọn đợt xét tốt nghiệp"
                                data={
                                  dataOptionGraduation?.length
                                    ? dataOptionGraduation
                                    : [
                                        {
                                          label: 'Không có dữ liệu',
                                          value: '0',
                                          disabled: true,
                                        },
                                      ]
                                }
                                searchable
                                clearable
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                error={errors.graduation_ceremony_ids?.message}
                              />
                            )}
                          />
                        </SimpleGrid>
                      </Stack>
                    </Fieldset>
                  </Stack>
                </Surface>
              </Grid.Col>
            </Grid>
            <Surface mt="lg">
              <Button
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                leftSection={<IconDeviceFloppy size={18} />}
              >
                Tạo
              </Button>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </SurveyPeriodCreatePageStyled>
  );
};

const SurveyPeriodCreatePageStyled = styled.div``;

export default SurveyPeriodCreatePage;
