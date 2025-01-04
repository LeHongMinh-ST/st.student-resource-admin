'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { UserListParams, useUserService } from '@/services/userService';
import {
  AdmissionYear,
  ResultResponse,
  SelectList,
  Student,
  TrainingIndustry,
  User,
} from '@/types';
import { useSearchFilter } from './useSearchFilter';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';

export const useStudentOptions = (classId: number | undefined) => {
  const { getListStudent } = useStudentService();

  const [studentParams, setStudentParams] = useState<GetListStudentParams>({
    class_id: classId,
  } as GetListStudentParams);

  const { data: dataStudent } = useSWR<Student[]>(
    classId ? ['getListStudent', classId] : null,
    () => getListStudent(studentParams).then((res) => res.data.data)
  );

  const studentOptions: SelectList<string>[] =
    dataStudent?.map((student) => ({
      label: `${student.code} - ${student.last_name} ${student.first_name}`,
      value: `${student.id}`,
    })) || [];

  const { handleInputSearchChange: setSearchQuery } = useSearchFilter(
    (value: string) => setStudentParams((pre) => ({ ...pre, q: value })),
    studentParams.q
  );

  return {
    studentOptions,
    isLoading: !dataStudent && classId !== undefined,
    studentParams,
    setSearchQuery,
  };
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
      label: `${user.last_name} ${user.first_name} - ${user.email}`,
      value: `${user.id}`,
    })) || [];

  const { handleInputSearchChange: setSearchQuery } = useSearchFilter(
    (value: string) => setUserParams((pre) => ({ ...pre, q: value })),
    userParams.q
  );

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

export const useTrainingIndustryOptions = () => {
  const { getList } = useTrainingIndustryService();

  const { data: trainingIndustries, error } = useSWR<TrainingIndustry[]>(
    ['getListTrainingIndustry'],
    () => getList().then((res) => res.data.data)
  );

  const trainingIndustryOptions: SelectList<string>[] =
    trainingIndustries?.map((industry) => ({
      label: industry.name,
      value: `${industry.id}`,
    })) || [];

  return {
    trainingIndustryOptions,
    isLoading: !trainingIndustries && !error,
    error,
  };
};
