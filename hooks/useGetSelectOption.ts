'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { UserListParams, useUserService } from '@/services/userService';
import { AdmissionYear, ResultResponse, SelectList, Student, User } from '@/types';

export const useStudentOptions = (classId: number | undefined) => {
  const { getListStudent } = useStudentService();

  const { data: dataStudent } = useSWR<Student[]>(
    classId ? ['getListStudent', classId] : null,
    () => getListStudent({ class_id: classId } as GetListStudentParams).then((res) => res.data.data)
  );

  const studentOptions: SelectList<string>[] =
    dataStudent?.map((student) => ({
      label: `${student.last_name} ${student.first_name}`,
      value: `${student.id}`,
    })) || [];

  return { studentOptions, isLoading: !dataStudent && classId !== undefined };
};

export const useUserOptions = (facultyId: number | undefined) => {
  const { getList } = useUserService();
  const [userParams, setUserParams] = useState<UserListParams>({
    facultyId,
  });

  const { data: dataUser } = useSWR<ResultResponse<User[]>>(['getList', userParams], () =>
    getList(userParams).then((res) => res.data)
  );

  const userOptions: SelectList<string>[] =
    dataUser?.data?.map((user) => ({
      label: `${user.last_name} ${user.first_name}`,
      value: `${user.id}`,
    })) || [];

  const setSearchQuery = (query: string) => setUserParams((prev) => ({ ...prev, q: query }));

  return { userOptions, isLoading: !dataUser, setSearchQuery, userParams };
};

export const useAdmissionOptions = () => {
  const { getListAdmission } = useStudentService();

  const { data: admissions } = useSWR<AdmissionYear[]>(['getListAdmission'], () =>
    getListAdmission().then((res) => res.data.data)
  );

  const admissionOptions: SelectList<string>[] =
    admissions?.map((admission) => ({
      label: `K${admission.admission_year}`,
      value: `${admission.id}`,
    })) || [];

  return { admissionOptions, isLoading: !admissions };
};
