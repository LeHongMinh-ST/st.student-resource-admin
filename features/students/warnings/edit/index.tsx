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
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { FC, useEffect, useMemo } from 'react';
import useSWR from 'swr';
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

type Props = {
  id: number;
};

const WarningEditPage: FC<Props> = ({ id }) => {
  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    reset,
  } = useForm<Warning>({
    defaultValues: {},
  });

  const { getSemesters, updateWarningStudent, getWarningStudentById } = useWarningStudentService();

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

  const { data } = useSWR<Warning>([id], () =>
    getWarningStudentById(id).then((res) => res?.data?.data)
  );

  useEffect(() => {
    if (data) {
      reset(data);
      // setValue('semester_id', String(data?.semester_id));
      // trigger('semester_id');
    }
  }, [data]);

  const { push } = useRouter();

  const onSubmit = async (data: Warning) => {
    if (!isSubmitting) {
      try {
        const res = await updateWarningStudent(data, id);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật đợt cảnh báo thành công',
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
    <WarningEditPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt cảnh báo - Cập nhật"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt cảnh báo ', href: warningRoute.list },
              { title: 'Cập nhật', href: null },
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
                Lưu
              </Button>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </WarningEditPageStyled>
  );
};

const WarningEditPageStyled = styled.div``;

export default WarningEditPage;
