import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, GeneralClass, Student } from '@/types';
import { ClassType } from '@/enums';

export type ClassListParams = {
  status?: Status;
  q?: string;
  type?: string;
  admission_year_id?: number | string;
  training_industry_id?: number | string;
  type_class?: ClassType;
} & BaseParamsList;

export type GeneralClassUpdate = {
  id: number;
  name: string;
  officer: {
    student_president?: Student;
    student_secretary?: Student;
  };
  sub_teacher_id?: number;
  teacher_id?: number;
  type: ClassType;
  training_industry_id?: number;
  status: Status;
};

export const useClassService = () => {
  const getList = (
    params: ClassListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<GeneralClass[]>, any>> =>
    axiosInstance.get('/classes', { params });

  const getClass = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<GeneralClass>, any>> =>
    axiosInstance.get(`/classes/${id}`);

  const createClass = (
    generalClass: GeneralClass
  ): Promise<AxiosResponse<ResultResponse<GeneralClass>, any>> =>
    axiosInstance.post('/classes', generalClass);

  const getClassById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResponse<Student>, any>> => axiosInstance.get(`/classes/${id}`);

  const getStudentStatisticalById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResponse<Student>, any>> =>
    axiosInstance.get(`/classes/${id}/student-statistical`);

  const updateClass = (
    generalClass: GeneralClassUpdate
  ): Promise<AxiosResponse<ResultResponse<GeneralClass>, any>> =>
    axiosInstance.put(`/classes/${generalClass.id}`, generalClass);

  const deleteClass = (id: number | string): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/classes/${id}`);

  const getStatisticalClassAdmissionYear = (
    id: number | string
  ): Promise<AxiosResponse<any, any>> =>
    axiosInstance.get(`/admission-year/${id}/class-statistical`);

  return {
    getList,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getStudentStatisticalById,
    getStatisticalClassAdmissionYear,
  };
};
