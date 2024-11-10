import styled from '@emotion/styled';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  Paper,
  MultiSelect,
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
import { DateTimePicker } from '@mantine/dates';
import useSWR from 'swr';
import { dashboardRoute, surveyPeriodRoute } from '@/routes';
import { Graduation, ResultResonse, SurveyPeriod } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import Status from '@/enums/status.enum';
import '@mantine/dates/styles.css';
import { useGraduationService } from '@/services/graduationService';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const SurveyPeriodCreatePage = () => {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    getValues,
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

  const userParams = {
    ...defaultPramsList,
    facultyId: authUser?.faculty_id ?? undefined,
  };

  const handleGetListUser = () =>
    getList(userParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataGraduation } = useSWR<ResultResonse<Graduation[]>>(
    ['getList', userParams],
    handleGetListUser
  );

  const dataOptionUser = dataGraduation?.data?.map((item: Graduation) => ({
    label: `${item.name}`,
    value: `${item.id}`,
  }));

  const onSubmit = async (data: SurveyPeriod) => {
    if (!isSubmitting) {
      try {
        data.start_date = formatDateToICT(data.start_date);
        data.end_date = formatDateToICT(data.end_date);
        const res = await createSurveyPeriod(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới đợt tốt nghiệp thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(surveyPeriodRoute.update(res.data.data.id));
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

  function formatDateToICT(date: any) {
    // Chuyển đổi sang múi giờ ICT
    const utcOffset = 7 * 60; // ICT là UTC+7
    const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <SurveyPeriodCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt tốt nghiệp - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt tốt nghiệp', href: surveyPeriodRoute.list },
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
                          placeholder="Tiêu đề đợt tốt nghiệp"
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
                                  const oldValue = getValues('start_date');
                                  field.onChange(date);
                                  // @ts-ignore
                                  if (date.getTime() !== new Date(oldValue).getTime()) {
                                    // @ts-ignore
                                    setValue('end_date', null);
                                    trigger('end_date');
                                  }
                                }}
                                onBlur={field.onBlur}
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
                                  trigger('end_date');
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                valueFormat="HH:mm DD/MM/YYYY"
                                minDate={
                                  getValues('start_date')
                                    ? new Date(getValues('start_date'))
                                    : undefined
                                }
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
                                label="Đợt tốt nghiệp"
                                placeholder="Chọn đợt tốt nghiệp"
                                data={dataOptionUser}
                                searchable
                                clearable
                                onFocus={() => {
                                  trigger('start_date');
                                }}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // @ts-ignore
                                  setValue('graduation_ceremony_ids', value);
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
