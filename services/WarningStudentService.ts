import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, Semester, Student, Warning } from '@/types';
import { GraduationListParams } from '@/services/graduationService';

export type WarningListParams = {
  q?: string;
} & BaseParamsList;

export const useWarningStudentService = () => {
  const getListWarningStudent = (
    params: GraduationListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<Warning[]>, any>> =>
    axiosInstance.get('/warning', { params });

  const createWarningStudent = (
    data: Warning
  ): Promise<AxiosResponse<ResultResponse<Warning>, any>> => axiosInstance.post('/warning', data);

  const updateWarningStudent = (
    data: Warning,
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Warning>, any>> =>
    axiosInstance.patch(`/warning/${id}`, data);

  const deleteWarningStudent = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> => axiosInstance.delete(`/warning/${id}`);

  const getWarningStudentById = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Warning>, any>> => axiosInstance.get(`/warning/${id}`);

  const getSemesters = (): Promise<AxiosResponse<Semester[], any>> =>
    axiosInstance.get('/semesters');

  const getListStudent = (
    id: number | string,
    params: WarningListParams
  ): Promise<AxiosResponse<ResultResponse<Student[]>, any>> =>
    axiosInstance.get(`/warning/${id}/students`, { params });

  return {
    getListWarningStudent,
    createWarningStudent,
    updateWarningStudent,
    deleteWarningStudent,
    getWarningStudentById,
    getSemesters,
    getListStudent,
  };
};
