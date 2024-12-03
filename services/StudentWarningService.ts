import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, schoolYear, Warning } from '@/types';

export type WarningListParams = {
  q?: string;
} & BaseParamsList;

export const useStudentWarningService = () => {
  const getListWarning = (
    params: WarningListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<Warning[]>, any>> =>
    axiosInstance.get('/student-warning', { params });

  const createWarning = (data: Warning): Promise<AxiosResponse<ResultResponse<Warning>, any>> =>
    axiosInstance.post('/student-warning', data);

  const updateWarning = (data: Warning): Promise<AxiosResponse<ResultResponse<schoolYear>, any>> =>
    axiosInstance.put('/student-warning', data);

  const deleteWarning = (id: number): Promise<AxiosResponse<ResultResponse<schoolYear>, any>> =>
    axiosInstance.delete(`/student-warning/${id}`);

  const getWarning = (id: number): Promise<AxiosResponse<ResultResponse<Warning>, any>> =>
    axiosInstance.get(`/student-warning/${id}`);

  const imporExcelFileWarningStudent = (data: FormData): Promise<AxiosResponse<void, any>> =>
    axiosInstance.post('/student-warning/import-student', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  return {
    getListWarning,
    createWarning,
    getWarning,
    updateWarning,
    imporExcelFileWarningStudent,
    deleteWarning,
  };
};
