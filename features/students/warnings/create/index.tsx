'use client';

import styled from '@emotion/styled';
import useSWR from 'swr';
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
import { useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { PageHeader, Surface } from '@/components';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { dashboardRoute, warningRoute } from '@/routes';
import { SelectList, Semester, Warning } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import '@mantine/dates/styles.css';
import { useWarningStudentService } from '@/services/WarningStudentService';

const WarningCreatePage = () => {
  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<Warning>({
    defaultValues: {},
  });

  const { createWarningStudent, getSemesters } = useWarningStudentService();

  const { push } = useRouter();

  const { data: semesters } = useSWR<Semester[]>('getSemester', () =>
    getSemesters().then((res) => res.data)
  );

  const semesterList: SelectList<string>[] | undefined = useMemo(
    () =>
      semesters
        ? semesters?.map(
            (semester): SelectList<string> => ({
              value: String(semester.id),
              label: `Học kỳ ${semester.semester} - Năm học ${semester.school_year.start_year} - ${semester.school_year.end_year}`,
            })
          )
        : [],

    [semesters]
  );

  const onSubmit = async (data: Warning) => {
    if (!isSubmitting) {
      try {
        const res = await createWarningStudent(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới đợt cảnh báo  thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(warningRoute.show(res.data.data.id));
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
    <WarningCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt cảnh báo  - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt cảnh báo ', href: warningRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={warningRoute.list}
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
                    <Fieldset legend="Thông tin đợt cảnh báo ">
                      <Stack>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <TextInput
                            withAsterisk
                            label="Tiêu đề"
                            placeholder="Danh sách sinh viên cảnh báo  ..."
                            {...register('name', {
                              required: ERROR_MESSAGES.warning.name.required,
                            })}
                            error={errors.name?.message}
                          />
                          <Select
                            withAsterisk
                            label="Học kỳ"
                            placeholder="Chọn học kỳ"
                            data={semesterList}
                            value={String(getValues('semester_id'))}
                            onChange={(value) => {
                              if (value) {
                                // @ts-ignore
                                setValue('semester_id', value);
                                trigger('semester_id');
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
                Tạo
              </Button>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </WarningCreatePageStyled>
  );
};

const WarningCreatePageStyled = styled.div``;

export default WarningCreatePage;
