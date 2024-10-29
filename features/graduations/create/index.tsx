'use client';

import styled from '@emotion/styled';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { PageHeader, Surface } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { dashboardRoute, graduationRoute } from '@/routes';
import { useGraduationService } from '@/services/graduationService';
import { SchoolYearListParams, useSchoolYearService } from '@/services/schoolYearService';
import { Graduation, ResultResonse, schoolYear } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import '@mantine/dates/styles.css';

const GraduationCreatePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Graduation>({
    defaultValues: {},
  });

  const { createGraduation } = useGraduationService();
  const { getList } = useSchoolYearService();

  // @ts-ignore
  const schoolYearListParams: SchoolYearListParams = { ...defaultPramsList };

  const handleGetListUser = () =>
    getList(schoolYearListParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataSchoolYear } = useSWR<ResultResonse<schoolYear[]>>(
    ['getList', schoolYearListParams],
    handleGetListUser
  );
  const { push } = useRouter();

  const dataOptionSchoolYear = dataSchoolYear?.data?.map((item: schoolYear) => ({
    label: `${item.start_year} - ${item.end_year}`,
    value: `${item.id}`,
  }));

  const onSubmit = async (data: Graduation) => {
    if (!isSubmitting) {
      try {
        data.school_year_id = parseInt(data.school_year_id.toString(), 10);
        const res = await createGraduation(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới đợt tốt nghiệp thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(graduationRoute.show(res.data.data.id));
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

  // @ts-ignore
  return (
    <GraduationCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt tốt nghiệp - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt tốt nghiệp', href: graduationRoute.list },
              { title: 'Tạo mới', href: null },
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
          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin đợt tốt nghiệp">
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
                            name="school_year_id"
                            control={control}
                            rules={{ required: ERROR_MESSAGES.graduation.school_year_id.required }}
                            render={({ field }) => (
                              <Select
                                label="Năm học"
                                withAsterisk
                                placeholder="Chọn năm học"
                                data={dataOptionSchoolYear}
                                {...field}
                                value={field.value?.toString() || ''}
                                allowDeselect={false}
                                error={errors.school_year_id?.message}
                              />
                            )}
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
    </GraduationCreatePageStyled>
  );
};

const GraduationCreatePageStyled = styled.div``;

export default GraduationCreatePage;
