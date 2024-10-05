'use client';

import styled from '@emotion/styled';
import { Button, Container, Fieldset, Grid, Paper, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { dashboardRoute, departmentRoute } from '@/routes';
import { Department } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useDepartmentService } from '@/services/departmentService';
import Status from '@/enums/status.enum';

const DepartmentCreatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Department>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { createDepartment } = useDepartmentService();
  const { push } = useRouter();

  const onSubmit = async (data: Department) => {
    if (!isSubmitting) {
      try {
        const res = await createDepartment(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới bộ môn thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(departmentRoute.update(res.data.data.id));
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
    <DepartmentCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Bộ môn - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Bộ môn', href: departmentRoute.list },
              { title: 'Tạo mới', href: null },
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

          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin tài khoản">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Mã bộ môn"
                          placeholder="Mã bộ môn"
                          {...register('code', {
                            required: ERROR_MESSAGES.department.code.required,
                          })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên bộ môn"
                          placeholder="Tên bộ môn"
                          {...register('name', {
                            required: ERROR_MESSAGES.department.name.required,
                          })}
                          error={errors.name?.message}
                        />
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
                        <Select
                          withAsterisk
                          label="Trạng thái"
                          placeholder="Chọn trạng thái"
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
    </DepartmentCreatePageStyled>
  );
};

const DepartmentCreatePageStyled = styled.div``;

export default DepartmentCreatePage;
