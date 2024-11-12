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
import { dashboardRoute, trainingIndustryRoute } from '@/routes';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';
import { TrainingIndustry } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import Status from '@/enums/status.enum';

const TrainingIndustryUpdatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TrainingIndustry>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { updateTrainingIndustry, getTrainingIndustry } = useTrainingIndustryService();
  const { query } = useRouter();
  const { id } = query;

  const handleGetTrainingIndustry = () => getTrainingIndustry(Number(id)).then((res) => res.data);

  const { data, isLoading } = useSWR([id], handleGetTrainingIndustry);

  useEffect(() => {
    if (data) {
      reset(data.data);
    }
  }, [data]);

  const onSubmit = async (data: TrainingIndustry) => {
    if (!isSubmitting) {
      try {
        const res = await updateTrainingIndustry(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật ngành đào tạo thành công',
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
    <TrainingIndustryUpdatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Ngành đào tạo - Chỉnh sửa - #${id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Ngành đào tạo', href: trainingIndustryRoute.list },
                { title: 'Chỉnh sửa', href: null },
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
          </Skeleton>
          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin ngành đào tạo">
                      <Stack>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Mã ngành đào tạo"
                            disabled
                            {...register('code')}
                          />
                        </Skeleton>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Tên ngành đào tạo"
                            placeholder="Tên ngành đào tạo"
                            {...register('name', {
                              required: ERROR_MESSAGES.trainingIndustry.name.required,
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
    </TrainingIndustryUpdatePageStyled>
  );
};

const TrainingIndustryUpdatePageStyled = styled.div``;

export default TrainingIndustryUpdatePage;
