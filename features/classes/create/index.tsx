'use client';

import styled from '@emotion/styled';
import { Button, Container, Fieldset, Grid, Paper, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useSWR from 'swr';
import { dashboardRoute, classRoute } from '@/routes';
import { Class, ResultResponse, User } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { ClassTypeSelectList, defaultPramsList, StatusList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { useClassService } from '@/services/classService';
import Status from '@/enums/status.enum';
import { UserListParams, useUserService } from '@/services/userService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { ClassType } from '@/enums';
import { useSearchFilter } from '@/hooks/useSearchFilter';

const ClassCreatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Class>({
    defaultValues: {
      status: Status.Enable,
      type: ClassType.Basic,
    },
  });

  const { createClass } = useClassService();
  const { getList } = useUserService();
  const { authUser } = useAuthStore();

  // @ts-ignore
  const [userParams, setUserParams] = useState<UserListParams>({
    ...defaultPramsList,
    facultyId: authUser?.faculty_id ?? undefined,
  });
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
  const { push } = useRouter();

  const dataOptionUser = dataUser?.data?.map((item: User) => ({
    label: `${item.first_name} ${item.last_name}`,
    value: `${item.id}`,
  }));

  const onSubmit = async (data: Class) => {
    if (data.teacher_id) {
      data.teacher_id = Number(data.teacher_id);
    }
    if (!isSubmitting) {
      try {
        const res = await createClass(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới lớp học thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(classRoute.update(res.data.data.id));
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
    <ClassCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Lớp học - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Lớp học', href: classRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={classRoute.list}
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
                    <Fieldset legend="Thông tin lớp học">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Mã lớp"
                          placeholder="Mã lớp"
                          {...register('code', {
                            required: ERROR_MESSAGES.department.code.required,
                          })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên lớp"
                          placeholder="Tên lớp"
                          {...register('name', {
                            required: ERROR_MESSAGES.department.name.required,
                          })}
                          error={errors.name?.message}
                        />
                        {/*<SelectSearch />*/}
                        <Select
                          label="Giáo viên chủ nhiệm"
                          placeholder="Chọn giáo viên"
                          data={dataOptionUser}
                          searchable
                          clearable
                          onKeyUp={(e) => {
                            // @ts-ignore
                            handleInputSearchChange(e.target?.value ?? '');
                          }}
                          onChange={(value) => {
                            // @ts-ignore
                            setValue('teacher_id', value);
                            trigger('teacher_id');
                          }}
                        />
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
    </ClassCreatePageStyled>
  );
};

const ClassCreatePageStyled = styled.div``;

export default ClassCreatePage;
