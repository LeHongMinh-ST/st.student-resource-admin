import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, Graduation, Student } from '@/types';

export type GraduationListParams = {
  q?: string;
  year?: string;
  facultyId?: number;
  is_graduation_doesnt_have_survey_period?: number;
  with_id_survey_period?: number;
} & BaseParamsList;

export const useGraduationService = () => {
  const getList = (
    params: GraduationListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<Graduation[]>, any>> =>
    axiosInstance.get('/graduates', { params });

  const getGraduation = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Graduation>, any>> =>
    axiosInstance.get(`/graduates/${id}`);

  const createGraduation = (
    generalGraduation: Graduation
  ): Promise<AxiosResponse<ResultResponse<Graduation>, any>> =>
    axiosInstance.post('/graduates', generalGraduation);

  const getGraduationById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResponse<Student>, any>> => axiosInstance.get(`/graduates/${id}`);

  const updateGraduation = (
    generalGraduation: Graduation
  ): Promise<AxiosResponse<ResultResponse<Graduation>, any>> =>
    axiosInstance.patch(`/graduates/${generalGraduation.id}`, generalGraduation);

  const deleteGraduation = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> => axiosInstance.delete(`/graduates/${id}`);

  const imporExcelFileGraduationStudent = (data: FormData): Promise<AxiosResponse<void, any>> =>
    axiosInstance.post('/graduates/import-student', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  return {
    getList,
    getGraduation,
    createGraduation,
    updateGraduation,
    deleteGraduation,
    getGraduationById,
    imporExcelFileGraduationStudent,
  };
};
