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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { dashboardRoute, graduationRoute } from '@/routes';
import { useGraduationService } from '@/services/graduationService';
import { Graduation } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import '@mantine/dates/styles.css';

const GraduationUpdatePage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Graduation>({
    defaultValues: {},
  });

  const { updateGraduation, getGraduation } = useGraduationService();
  const { query } = useRouter();
  const { id } = query;

  const handleGetGraduation = () => getGraduation(Number(id)).then((res) => res.data);

  const { data, isLoading } = useSWR([id], handleGetGraduation);

  useEffect(() => {
    if (data) {
      reset(data.data);
    }
  }, [data]);

  const onSubmit = async (data: Graduation) => {
    if (!isSubmitting) {
      try {
        data.year = isDate(data.year) ? Number(dayjs(data.year).format('YYYY')) : data.year;
        data.certification_date = dayjs(data.certification_date).format('YYYY-MM-DD');
        const res = await updateGraduation(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật đợt tốt nghiệp thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
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

  const isDate = (date: any): boolean => date instanceof Date && !Number.isNaN(date.valueOf());

  return (
    data?.data.year && (
      <GraduationUpdatePageStyled>
        <Container fluid>
          <Stack gap="lg">
            <Skeleton visible={isLoading}>
              <PageHeader
                title={`Đợt tốt nghiệp - Chỉnh sửa - #${id}`}
                breadcrumbItems={[
                  { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                  { title: 'Đợt tốt nghiệp', href: graduationRoute.list },
                  { title: 'Chỉnh sửa', href: null },
                ]}
                withActions={
                  <Button
                    component={Link}
                    href={graduationRoute.list}
                    leftSection={<IconLogout size={18} />}
                  >
                    Quay lại
                  </Button>
                }
              />
            </Skeleton>
            <Paper p="md" shadow="md" radius="md">
              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Stack>
                      <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <TextInput
                          withAsterisk
                          label="Tiêu đề"
                          placeholder="Danh sách sinh viên tốt nghiệp ..."
                          {...register('name', {
                            required: ERROR_MESSAGES.graduation.name.required,
                          })}
                          error={errors.name?.message}
                        />
                        <Controller
                          name="year"
                          control={control}
                          rules={{ required: ERROR_MESSAGES.graduation.year.required }}
                          render={({ field }) => {
                            console.log(field.value, new Date(field.value, 0, 1));

                            return (
                              <YearPickerInput
                                withAsterisk
                                label="Năm tốt nghiệp"
                                placeholder="Năm tốt nghiệp"
                                value={
                                  field.value
                                    ? isDate(field.value)
                                      ? new Date(field.value)
                                      : new Date(field.value, 0, 1)
                                    : null
                                }
                                onChange={(date) => field.onChange(date)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.certification_date?.message}
                              />
                            );
                          }}
                        />
                      </SimpleGrid>
                      <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <TextInput
                          withAsterisk
                          label="Số quyết định tốt nghiệp"
                          {...register('certification', {
                            required: ERROR_MESSAGES.graduation.certification.required,
                          })}
                          error={errors.certification?.message}
                        />
                        <Controller
                          name="certification_date"
                          control={control}
                          rules={{
                            required: ERROR_MESSAGES.graduation.certification_date.required,
                          }}
                          render={({ field }) => (
                            <DatePickerInput
                              withAsterisk
                              label="Ngày quyết định tốt nghiệp"
                              placeholder="Chọn ngày quyết định tốt nghiệp"
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              valueFormat="DD/MM/YYYY"
                              error={errors.certification_date?.message}
                            />
                          )}
                        />
                      </SimpleGrid>
                    </Stack>
                  </Surface>
                </Grid.Col>
              </Grid>
              <Surface mt="lg">
                <Skeleton width="5%" visible={isLoading}>
                  <Button
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
      </GraduationUpdatePageStyled>
    )
  );
};

const GraduationUpdatePageStyled = styled.div``;

export default GraduationUpdatePage;
