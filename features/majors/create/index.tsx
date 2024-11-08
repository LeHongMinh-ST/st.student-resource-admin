'use client';

import { IconAlertTriangle, IconCheck, IconLogout, IconDeviceFloppy } from '@tabler/icons-react';
import { Container, Stack, Button, Paper, Grid, Fieldset, TextInput, Select } from '@mantine/core';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import Status from '@/enums/status.enum';
import { dashboardRoute, majorRoute } from '@/routes';
import { useMajorService } from '@/services/majorService';
import { Major } from '@/types';
import HttpStatus from '@/enums/http-status.enum';
import { PageHeader, Surface } from '@/components';
import { StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

const MajorCreatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Major>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { createMajor } = useMajorService();

  const { push } = useRouter();

  const onSubmit = async (data: Major) => {
    if (!isSubmitting) {
      try {
        const res = await createMajor(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới chuyên ngành thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(majorRoute.update(res.data.data.id));
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
    <MajorCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Chuyên ngành - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Chuyên ngành', href: majorRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={majorRoute.list}
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
                    <Fieldset legend="Thông tin chung">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Mã chuyên ngành"
                          placeholder="Mã chuyên ngành"
                          {...register('code', {
                            required: ERROR_MESSAGES.major.code.required,
                          })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên chuyên ngành"
                          placeholder="Tên chuyên ngành"
                          {...register('name', {
                            required: ERROR_MESSAGES.major.name.required,
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
    </MajorCreatePageStyled>
  );
};

const MajorCreatePageStyled = styled.div``;

export default MajorCreatePage;
