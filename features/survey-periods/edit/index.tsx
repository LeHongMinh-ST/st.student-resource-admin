'use client';

import styled from '@emotion/styled';
import {
  Container,
  Stack,
  Button,
  Paper,
  Grid,
  TextInput,
  Skeleton,
  SimpleGrid,
  Fieldset,
  Textarea,
  MultiSelect,
  Select,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import '@mantine/dates/styles.css';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { dashboardRoute, surveyPeriodRoute } from '@/routes';
import { useGraduationService } from '@/services/graduationService';
import { Graduation, ResultResponse, SurveyPeriod } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';

import { defaultPramsList, StatusListActive } from '@/constants/commons';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Status from '@/enums/status.enum';

const SurveyPeriodUpdatePage = () => {
  const {
    control,
    register,
    getValues,
    setValue,
    trigger,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SurveyPeriod>({
    defaultValues: {},
  });

  const { updateSurveyPeriod, getSurveyPeriod } = useSurveyPeriodService();
  const { query } = useRouter();
  const { id } = query;

  const handleGetSurveyPeriod = () => getSurveyPeriod(Number(id)).then((res) => res.data);

  const { data, isLoading } = useSWR([id], handleGetSurveyPeriod);
  const [startDate, endDate] = watch(['start_date', 'end_date']);

  useEffect(() => {
    if (data) {
      reset(data.data);
    }
  }, [data]);

  const { push } = useRouter();

  const onSubmit = async (dataUpdate: SurveyPeriod) => {
    if (!isSubmitting) {
      try {
        if (data?.data.start_date === dataUpdate.start_date) {
          delete dataUpdate.start_date;
        } else {
          dataUpdate.start_date = isDate(dataUpdate.start_date)
            ? dayjs(dataUpdate.start_date).format('YYYY-MM-DD HH:mm')
            : dayjs(dataUpdate.start_date).format('YYYY-MM-DD HH:mm');
        }

        if (data?.data.end_date === dataUpdate.end_date) {
          delete dataUpdate.end_date;
        } else {
          dataUpdate.end_date = isDate(dataUpdate.end_date)
            ? dayjs(dataUpdate.end_date).format('YYYY-MM-DD HH:mm')
            : dayjs(dataUpdate.end_date).format('YYYY-MM-DD HH:mm');
        }

        const res = await updateSurveyPeriod(dataUpdate);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật đợt khảo sát việc làm thành công',
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
  const { getList } = useGraduationService();
  const { authUser } = useAuthStore();
  const graduationParams = {
    ...defaultPramsList,
    limit: 100,
    facultyId: authUser?.faculty_id ?? undefined,
    is_graduation_doesnt_have_survey_period: 1,
  };

  const handleGetListUser = () =>
    getList(graduationParams)
      .then((res: { data: any }) => res.data)
      .catch((error: any) => error);

  const { data: dataGraduation } = useSWR<ResultResponse<Graduation[]>>(
    ['getList', graduationParams],
    handleGetListUser
  );

  const dataOptionGraduation = [
    ...(dataGraduation?.data || []),
    ...(data?.data.graduation_ceremonies || []),
  ].map((item: Graduation) => ({
    label: `${item.name}`,
    value: `${item.id}`,
  }));

  const isDate = (date: any): boolean => date instanceof Date && !Number.isNaN(date.valueOf());

  return (
    data?.data.year && (
      <SurveyPeriodUpdatePageStyled>
        <Container fluid>
          <Stack gap="lg">
            <Skeleton visible={isLoading}>
              <PageHeader
                title={`đợt khảo sát việc làm - Chỉnh sửa - #${id}`}
                breadcrumbItems={[
                  { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                  { title: 'đợt khảo sát việc làm', href: surveyPeriodRoute.list },
                  { title: 'Chỉnh sửa', href: null },
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
            </Skeleton>
            <Paper p="md" shadow="md" radius="md">
              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Stack gap={32}>
                      <Fieldset legend="Thông tin chung">
                        <Stack>
                          <TextInput
                            withAsterisk
                            label="Tiêu đề"
                            disabled={getValues('status') === Status.Disable}
                            placeholder="Tiêu đề đợt khảo sát việc làm"
                            {...register('title', {
                              required: ERROR_MESSAGES.surveyPeriod.title.required,
                            })}
                            error={errors.title?.message}
                          />
                          <Textarea
                            label="Mô tả"
                            disabled={getValues('status') === Status.Disable}
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
                                  disabled={
                                    dayjs().isAfter(dayjs(data?.data.start_date)) ||
                                    getValues('status') === Status.Disable
                                  }
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
                                  disabled={getValues('status') === Status.Disable}
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
                              name="graduation_ceremony_ids"
                              control={control}
                              rules={{
                                required:
                                  ERROR_MESSAGES.surveyPeriod.graduation_ceremony_ids.required,
                              }}
                              render={({ field }) => (
                                <MultiSelect
                                  disabled={getValues('status') === Status.Disable}
                                  value={field.value?.map(String)}
                                  label="Các đợt xét tốt nghiệp"
                                  placeholder="Chọn đợt tốt nghiệp"
                                  data={
                                    dataOptionGraduation.length
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
                                    // @ts-ignore
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
                <Grid.Col span={{ base: 12, md: 4 }} h="100%">
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Stack justify="space-between" gap={16} h="100%">
                      <Fieldset legend="Vai trò">
                        <Stack>
                          <Skeleton visible={isLoading}>
                            <Select
                              disabled={getValues('status') === Status.Disable}
                              withAsterisk
                              data={StatusListActive}
                              label="Trạng thái"
                              value={getValues('status')}
                              onChange={(value) => {
                                if (value) {
                                  // @ts-ignore
                                  setValue('status', value);
                                  trigger('status');
                                }
                              }}
                            />
                          </Skeleton>
                        </Stack>
                      </Fieldset>
                    </Stack>
                  </Surface>
                </Grid.Col>
              </Grid>
              <Surface mt="lg">
                <Skeleton width="5%" visible={isLoading}>
                  <Button
                    display={getValues('status') === Status.Disable ? 'none' : 'block'}
                    loading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    leftSection={<IconDeviceFloppy size={18} />}
                  >
                    Lưu
                  </Button>
                </Skeleton>
              </Surface>
            </Paper>
          </Stack>
        </Container>
      </SurveyPeriodUpdatePageStyled>
    )
  );
};

const SurveyPeriodUpdatePageStyled = styled.div``;

export default SurveyPeriodUpdatePage;
