'use client';

import styled from '@emotion/styled';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { classRoute, dashboardRoute } from '@/routes';
import { useClassService } from '@/services/classService';
import { AdmissionYear, GeneralClass, ResultResponse, SelectList, User } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { ClassTypeSelectList, StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import Status from '@/enums/status.enum';
import { UserListParams, useUserService } from '@/services/userService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useStudentService } from '@/services/studentService';

const ClassUpdatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<GeneralClass>({
    defaultValues: {
      status: Status.Enable,
    },
  });

  const { updateClass, getClass } = useClassService();
  const { getListAdmission } = useStudentService();
  const { query, back } = useRouter();
  const { id } = query;
  const { authUser } = useAuthStore();
  const handleGetClass = () => getClass(Number(id)).then((res) => res.data);

  const { getList } = useUserService();

  const [userParams, setUserParams] = useState<UserListParams>({
    facultyId: authUser?.faculty_id ?? undefined,
  });

  const { data: admissions } = useSWR<AdmissionYear[]>(['getListAdmission'], () =>
    getListAdmission().then((res) => res?.data?.data)
  );
  const { handleInputSearchChange } = useSearchFilter(
    (value: string) => setUserParams((prev) => ({ ...prev, q: value })),
    userParams.q
  );

  const handleGetListUser = () =>
    getList(userParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data: dataUser } = useSWR<ResultResponse<User[]>>(
    ['getList', userParams],
    handleGetListUser
  );

  const dataOptionUser: SelectList<string>[] = dataUser?.data
    ? dataUser?.data?.map(
        (item: User): SelectList<string> => ({
          label: `${item.first_name} ${item.last_name}`,
          value: `${item.id}`,
        })
      )
    : [];

  const dataOptionAdmission: SelectList<string>[] = admissions
    ? admissions?.map(
        (item): SelectList<string> => ({
          label: `K${item.admission_year}`,
          value: `${item?.id}`,
        })
      )
    : [];

  const { data, isLoading } = useSWR<ResultResponse<GeneralClass>>([id], handleGetClass);

  // if (error) {
  //   if (error.status === HttpStatus.HTTP_NOT_FOUND) {
  //     push('/404').then();
  //   }
  // }

  useEffect(() => {
    if (data) {
      const dataClass = data?.data;
      const currentTeacher = dataOptionUser.find(
        (item) => item.value === String(dataClass?.teacher_id)
      );
      if (currentTeacher) {
        dataOptionUser.push({
          label: `${dataClass?.teacher?.last_name} ${dataClass?.teacher?.first_name} `,
          value: `${dataClass?.teacher?.id}`,
        });
      }

      const currentSubTeacher = dataOptionUser.find(
        (item) => item.value === String(dataClass?.sub_teacher_id)
      );
      if (currentSubTeacher) {
        dataOptionUser.push({
          label: `${dataClass?.sub_teacher?.last_name} ${dataClass?.sub_teacher?.first_name} `,
          value: `${dataClass?.sub_teacher?.id}`,
        });
      }
      reset(dataClass);
    }
  }, [data]);

  const onSubmit = async (data: GeneralClass) => {
    if (data.teacher_id) {
      data.teacher_id = Number(data.teacher_id);
    }
    if (!isSubmitting) {
      try {
        const res = await updateClass(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật lớp học thành công',
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
    <ClassUpdatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Lớp - Chỉnh sửa - #${id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Lớp', href: classRoute.list },
                { title: 'Chỉnh sửa', href: null },
              ]}
              withActions={
                <Button onClick={() => back()} leftSection={<IconLogout size={18} />}>
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
                    <Fieldset legend="Thông tin lớp học">
                      <Stack>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Mã lớp học"
                            disabled
                            {...register('code')}
                          />
                        </Skeleton>
                        <Skeleton visible={isLoading}>
                          <TextInput
                            withAsterisk
                            label="Tên lớp học"
                            placeholder="Tên lớp học"
                            {...register('name', {
                              required: ERROR_MESSAGES.class.name.required,
                            })}
                            error={errors.name?.message}
                          />
                        </Skeleton>
                        <Skeleton visible={isLoading}>
                          <Select
                            label="Giáo viên chủ nhiệm (GVCN)"
                            placeholder="Chọn giảng viên"
                            data={dataOptionUser}
                            onKeyUp={(e) => {
                              // @ts-ignore
                              handleInputSearchChange(e.target?.value ?? '');
                            }}
                            clearable
                            searchable
                            defaultValue={String(data?.data.teacher_id)}
                            value={`${getValues('teacher_id')}`}
                            onChange={(value) => {
                              // @ts-ignore
                              setValue('teacher_id', value);
                              trigger('teacher_id');
                            }}
                          />
                        </Skeleton>
                        <Skeleton visible={isLoading}>
                          <Select
                            label="Cố vấn học tập (CVHT)"
                            placeholder="Chọn giảng viên"
                            data={dataOptionUser}
                            onKeyUp={(e) => {
                              // @ts-ignore
                              handleInputSearchChange(e.target?.value ?? '');
                            }}
                            defaultValue={String(data?.data.sub_teacher_id)}
                            clearable
                            searchable
                            value={`${getValues('sub_teacher_id')}`}
                            onChange={(value) => {
                              // @ts-ignore
                              setValue('sub_teacher_id', value);
                              trigger('sub_teacher_id');
                            }}
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
                    <Fieldset legend="Thông tin chung">
                      <Stack>
                        <Skeleton visible={isLoading}>
                          <Select
                            withAsterisk
                            label="Loại lớp"
                            placeholder="Chọn loại lớp"
                            data={ClassTypeSelectList}
                            value={getValues('type')}
                            onChange={(value) => {
                              if (value) {
                                // @ts-ignore
                                setValue('type', value);
                                trigger('type');
                              }
                            }}
                          />
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
                          <Select
                            withAsterisk
                            label="Khoá hoc"
                            placeholder="Chọn khoá học"
                            data={dataOptionAdmission}
                            defaultValue={`${getValues('admission_year_id')}`}
                            value={`${getValues('admission_year_id')}`}
                            onChange={(value) => {
                              if (value) {
                                // @ts-ignore
                                setValue('admission_year_id', value as Number);
                                trigger('admission_year_id');
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
    </ClassUpdatePageStyled>
  );
};

const ClassUpdatePageStyled = styled.div``;

export default ClassUpdatePage;
