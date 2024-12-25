'use client';

import styled from '@emotion/styled';
import {
  Button,
  Container,
  Divider,
  Fieldset,
  Grid,
  Paper,
  Select,
  Skeleton,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconDeviceFloppy,
  IconLogout,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { DatePickerInput } from '@mantine/dates';
import { dashboardRoute, studentRoute } from '@/routes';
import { useStudentService } from '@/services/studentService';
import { Family, ResultResponse, Student } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import {
  FamilyRelationshipList,
  GenderList,
  SocialPolicyObjectList,
  TrainingTypeList,
} from '@/constants/commons';
import { FamilyRelationship, Gender, SocialPolicyObject, TrainingType } from '@/enums';
import { formatDateString } from '@/utils/func/formatDateString';

const StudentEditPage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Student>();

  const { updateStudent, getStudentById } = useStudentService();
  const { query, push } = useRouter();
  const { id } = query;

  const handleGetStudent = () => getStudentById(Number(id)).then((res) => res.data);

  const { data, isLoading } = useSWR<ResultResponse<Student>>([id], handleGetStudent);

  useEffect(() => {
    if (data) {
      reset(data.data);
      setFamilyMembers(data.data.families);
    }
  }, [data]);
  const [familyMembers, setFamilyMembers] = useState<Family[]>(data?.data?.families || []);

  const handleAddFamilyMember = () => {
    const newFamilyMember: Family = {
      relationship: FamilyRelationship.Other,
      full_name: '',
      phone: '',
      job: '',
    };
    setFamilyMembers([...familyMembers, newFamilyMember]);
  };

  const handleRemoveFamilyMember = (index: number) => {
    const updatedFamilyMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedFamilyMembers);
    const resetData = data?.data;
    if (resetData) {
      resetData.families = updatedFamilyMembers;
      reset(resetData);
    }
  };

  const onSubmit = async (data: Student) => {
    try {
      const res = await updateStudent(data, Number(id));
      if (res) {
        notifications.show({
          title: 'Thành công!',
          message: 'Cập nhật thông tin sinh viên thành công',
          icon: <IconCheck />,
          color: 'green.8',
          autoClose: 5000,
        });

        push(studentRoute.show(Number(id)));
      }
    } catch (e: any) {
      if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
        const errors = e.response?.data?.errors;

        if (errors) {
          setFormErrors(errors, setError);
        }
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
  };

  return (
    <StudentEditPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <Skeleton visible={isLoading}>
            <PageHeader
              title={`Sinh viên - Chỉnh sửa - #${data?.data.code}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: `Sinh viên ${data?.data.code}`, href: studentRoute.show(Number(id)) },
                { title: 'Chỉnh sửa', href: null },
              ]}
              withActions={
                <Button
                  onClick={() => push(studentRoute.show(Number(id)))}
                  leftSection={<IconLogout size={18} />}
                >
                  Quay lại
                </Button>
              }
            />
          </Skeleton>

          <Paper p="md" shadow="md" radius="md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin cá nhân">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Mã sinh viên"
                          disabled
                          {...register('code', { required: ERROR_MESSAGES.student.code.required })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          label="Email"
                          disabled
                          {...register('email', {
                            required: ERROR_MESSAGES.student.email.required,
                          })}
                          error={errors.email?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Họ và tên"
                          {...register('last_name', {
                            required: ERROR_MESSAGES.student.last_name.required,
                          })}
                          error={errors.last_name?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên"
                          {...register('first_name', {
                            required: ERROR_MESSAGES.student.first_name.required,
                          })}
                          error={errors.first_name?.message}
                        />

                        <TextInput
                          label="Email cá nhân"
                          {...register('info.person_email')}
                          error={errors.info?.person_email?.message}
                        />
                        <TextInput
                          label="Số điện thoại"
                          {...register('info.phone')}
                          error={errors.info?.phone?.message}
                        />

                        <TextInput
                          label="Số CMND/CCCD"
                          {...register('info.citizen_identification')}
                          error={errors.info?.citizen_identification?.message}
                        />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin bổ sung">
                      <Stack>
                        <DatePickerInput
                          {...register('info.dob', {})}
                          rightSection={
                            <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                          }
                          label="Ngày sinh"
                          placeholder="Chọn ngày sinh"
                          locale="vi"
                          valueFormat="DD/MM/YYYY"
                          defaultValue={
                            data?.data.info?.dob ? new Date(data?.data.info?.dob) : null
                          }
                          value={
                            getValues('info.dob') ? new Date(getValues('info.dob') ?? '') : null
                          }
                          onChange={(value) => {
                            if (value) {
                              // @ts-ignore
                              setValue('info.dob', formatDateString(value, 'mm/dd/yyyy') as String);
                            } else {
                              setValue('info.dob', '');
                            }
                            trigger('info.dob');
                          }}
                        />
                        <Select
                          label="Giới tính"
                          data={GenderList}
                          value={getValues('info.gender')}
                          onChange={(value) => {
                            setValue('info.gender', (value as Gender) || Gender.Unspecified);
                            trigger('info.gender');
                          }}
                          error={errors.info?.gender?.message}
                        />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin khác">
                      <Stack>
                        <TextInput
                          label="Địa chỉ"
                          {...register('info.address')}
                          error={errors.info?.address?.message}
                        />
                        <TextInput
                          label="Địa chỉ thường chú"
                          {...register('info.permanent_residence')}
                          error={errors.info?.permanent_residence?.message}
                        />
                        <TextInput
                          label="Nơi sinh"
                          {...register('info.pob')}
                          error={errors.info?.pob?.message}
                        />
                        <TextInput
                          label="Quê quán"
                          {...register('info.countryside')}
                          error={errors.info?.countryside?.message}
                        />
                        <Select
                          label="Loại hình đào tạo"
                          data={TrainingTypeList}
                          value={getValues('info.training_type')}
                          onChange={(value) => {
                            setValue('info.training_type', value as TrainingType);
                            trigger('info.training_type');
                          }}
                          error={errors.info?.training_type?.message}
                        />
                        <TextInput
                          label="Dân tộc"
                          {...register('info.ethnic')}
                          error={errors.info?.ethnic?.message}
                        />
                        <TextInput
                          label="Tôn giáo"
                          {...register('info.religion')}
                          error={errors.info?.religion?.message}
                        />

                        <Select
                          label="Chế độ chính sách"
                          data={SocialPolicyObjectList}
                          value={getValues('info.social_policy_object')}
                          onChange={(value) => {
                            setValue('info.social_policy_object', value as SocialPolicyObject);
                            trigger('info.social_policy_object');
                          }}
                          error={errors.info?.social_policy_object?.message}
                        />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin gia đình">
                      <Stack>
                        {familyMembers?.map((familyMember: Family, index: number) => (
                          <div key={index}>
                            {index > 0 && <Divider style={{ marginBottom: '1rem' }} />}
                            <Select
                              label={`Người thân ${index + 1}`}
                              data={FamilyRelationshipList}
                              value={getValues(`families.${index}.relationship`)}
                              onChange={(value) => {
                                setValue(
                                  `families.${index}.relationship`,
                                  (value as FamilyRelationship) || FamilyRelationship.Other
                                );
                                trigger(`families.${index}.relationship`);
                              }}
                              error={errors.info?.gender?.message}
                            />
                            <TextInput
                              label="Tên"
                              {...register(`families.${index}.full_name`, {
                                required: ERROR_MESSAGES.family.full_name.required,
                              })}
                            />
                            <TextInput
                              label="Số điện thoại"
                              {...register(`families.${index}.phone`)}
                            />
                            <TextInput label="Nghề nghiệp" {...register(`families.${index}.job`)} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                onClick={() => handleRemoveFamilyMember(index)}
                                style={{ marginTop: '1rem' }}
                                size="xs"
                                color="red"
                                className="mt-5"
                                leftSection={<IconTrash />}
                              >
                                Xoá
                              </Button>
                            </div>
                            <div style={{ marginBottom: '1rem' }} />
                          </div>
                        ))}
                        <Button onClick={handleAddFamilyMember} leftSection={<IconPlus />}>
                          Thêm mới
                        </Button>
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Ghi chú">
                      <Stack>
                        <Textarea rows={5} {...register('info.note')} />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Button
                className="mt-5"
                style={{ marginTop: '1rem' }}
                type="submit"
                loading={isSubmitting}
                leftSection={<IconDeviceFloppy size={18} />}
              >
                Lưu
              </Button>
            </form>
          </Paper>
        </Stack>
      </Container>
    </StudentEditPageStyled>
  );
};

const StudentEditPageStyled = styled.div``;

export default StudentEditPage;
