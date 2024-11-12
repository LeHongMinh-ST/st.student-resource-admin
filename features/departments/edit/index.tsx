'use client';

import styled from '@emotion/styled';
import {
  Container,
  Stack,
  Button,
  Paper,
  Fieldset,
  Grid,
  Select,
  TextInput,
  Skeleton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { dashboardRoute, departmentRoute } from '@/routes';
import { useDepartmentService } from '@/services/departmentService';
import { Department } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import Status from '@/enums/status.enum';

const DepartmentUpdatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Department>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { updateDepartment, getDepartment } = useDepartmentService();
  const { query } = useRouter();
  const { id } = query;

  const handleGetDepartment = () => getDepartment(Number(id)).then((res) => res.data);

  const { data, isLoading } = useSWR([id], handleGetDepartment);

  useEffect(() => {
    if (data) {
      reset(data.data);
    }
  }, [data]);

  const onSubmit = async (data: Department) => {
    if (!isSubmitting) {
      try {
        const res = await updateDepartment(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật bộ môn thành công',
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

  return (
    <DepartmentUpdatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Bộ môn - Chỉnh sửa - #${id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Bộ môn', href: departmentRoute.list },
                { title: 'Chỉnh sửa', href: null },
              ]}
              withActions={
                <Button
                  component={Link}
                  href={departmentRoute.list}
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
                    <Fieldset legend="Thông tin bộ môn">
                      <Stack>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Mã bộ môn"
                            disabled
                            {...register('code')}
                          />
                        </Skeleton>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Tên bộ môn"
                            placeholder="Tên bộ môn"
                            {...register('name', {
                              required: ERROR_MESSAGES.department.name.required,
                            })}
                            error={errors.name?.message}
                          />
                        </Skeleton>
                      </Stack>
                    </Fieldset>
                  </Stack>
                </Surface>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }} h="100%">
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack justify="space-between" gap={16} h="100%">
                    <Fieldset legend="Trạng thái">
                      <Stack>
                        <Skeleton visible={isLoading}>
                          <Select
                            withAsterisk
                            label="Trạng thái"
                            data={StatusList}
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
    </DepartmentUpdatePageStyled>
  );
};

const DepartmentUpdatePageStyled = styled.div``;

export default DepartmentUpdatePage;
