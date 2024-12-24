'use client';

import styled from '@emotion/styled';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  Paper, Select,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { PageHeader, Surface } from '@/components';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { dashboardRoute, quitRoute } from '@/routes';
import { Semester, Quit, SelectList } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import '@mantine/dates/styles.css';
import { useQuitStudentService } from '@/services/QuitStudentService';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import { StudentStatus } from "@/enums";
import { studentStatusLabels } from "@/constants/labels";

type Props = {
  id: number;
};

const QuitEditPage: FC<Props> = ({ id }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    trigger,
    setError,
    reset
  } = useForm<Quit>({
    defaultValues: {},
  });

  const { updateQuitStudent, getQuitStudentById } = useQuitStudentService();

  const { data } = useSWR<Quit>([id], () => getQuitStudentById(id).then((res) => res?.data?.data));

  useEffect(() => {
    if (data) {
      reset(data);
      // setValue('semester_id', String(data?.semester_id));
      // trigger('semester_id');
    }
  }, [data]);
  const typeList: SelectList<string>[] = [
    { value: StudentStatus.Expelled, label: studentStatusLabels.expelled },
    { value: StudentStatus.ToDropOut, label: studentStatusLabels.to_drop_out },
    { value: StudentStatus.Deferred, label: studentStatusLabels.deferred },
    { value: StudentStatus.TransferStudy, label: studentStatusLabels.transfer_study },
  ]
  const { push } = useRouter();

  const onSubmit = async (data: Quit) => {
    if (!isSubmitting) {
      try {
        const res = await updateQuitStudent(data, id);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật đợt cảnh báo thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(quitRoute.show(res.data.data.id));
        }
      } catch (e: any) {
        if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
          const errors = e.response?.data?.errors;

          if (errors) {
            // @ts-ignore
            setFormErrors(errors, setError);
          }
        } else if (e?.status === HttpStatus.HTTP_FORBIDDEN) {
          notifications.show({
            title: 'Thất bại!',
            message: 'Bạn không có quyền thực hiện chức năng này',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        } else {
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
    <QuitEditPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt cảnh báo - Cập nhật"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt cảnh báo ', href: quitRoute.list },
              { title: 'Cập nhật', href: null },
            ]}
            withActions={
              <Button component={Link} href={quitRoute.list} leftSection={<IconLogout size={18} />}>
                Quay lại
              </Button>
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin đợt cảnh báo ">
                      <Stack>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <TextInput
                            withAsterisk
                            label="Tiêu đề"
                            placeholder="Danh sách sinh viên cảnh báo  ..."
                            {...register('name', {
                              required: ERROR_MESSAGES.quit.name.required,
                            })}
                            error={errors.name?.message}
                          />
                          <Controller
                            name="year"
                            control={control}
                            rules={{ required: ERROR_MESSAGES.quit.year.required }}
                            render={({ field }) => (
                              <YearPickerInput
                                withAsterisk
                                label="Năm"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.certification_date?.message}
                              />
                            )}
                          />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <TextInput
                            withAsterisk
                            label="Số quyết định buộc thôi học"
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
                                label="Ngày quyết định thôi học"
                                placeholder="Chọn ngày quyết định thôi học"
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
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <Select
                            withAsterisk
                            label="Loại"
                            placeholder="Chọn"
                            disabled
                            data={typeList}
                            value={String(getValues('type'))}
                            onChange={(value) => {
                              if (value) {
                                // @ts-ignore
                                setValue('type', value);
                                trigger('type');
                              }
                            }}
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
                Lưu
              </Button>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </QuitEditPageStyled>
  );
};

const QuitEditPageStyled = styled.div``;

export default QuitEditPage;
