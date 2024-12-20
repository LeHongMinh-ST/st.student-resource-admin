'use client';

import styled from '@emotion/styled';
import { Button, Container, Fieldset, Grid, Paper, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { dashboardRoute, trainingIndustryRoute } from '@/routes';
import { TrainingIndustry } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';
import Status from '@/enums/status.enum';

const TrainingIndustryCreatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TrainingIndustry>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { createTrainingIndustry } = useTrainingIndustryService();
  const { push } = useRouter();

  const onSubmit = async (data: TrainingIndustry) => {
    if (!isSubmitting) {
      try {
        const res = await createTrainingIndustry(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới ngành đào tạo thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(trainingIndustryRoute.update(res.data.data.id));
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
    <TrainingIndustryCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Ngành đào tạo - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Ngành đào tạo', href: trainingIndustryRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={trainingIndustryRoute.list}
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
                          label="Mã ngành đào tạo"
                          placeholder="Mã ngành đào tạo"
                          {...register('code', {
                            required: ERROR_MESSAGES.trainingIndustry.code.required,
                          })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên ngành đào tạo"
                          placeholder="Tên ngành đào tạo"
                          {...register('name', {
                            required: ERROR_MESSAGES.trainingIndustry.name.required,
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
                    <Fieldset legend="Trạng thái">
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
    </TrainingIndustryCreatePageStyled>
  );
};

const TrainingIndustryCreatePageStyled = styled.div``;

export default TrainingIndustryCreatePage;
