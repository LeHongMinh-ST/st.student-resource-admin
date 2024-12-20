import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, GeneralClass, Student } from '@/types';

export type ClassListParams = {
  status?: Status;
  q?: string;
  type?: string;
} & BaseParamsList;

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
    generalClass: GeneralClass
  ): Promise<AxiosResponse<ResultResponse<GeneralClass>, any>> =>
    axiosInstance.patch(`/classes/${generalClass.id}`, generalClass);

  const deleteClass = (id: number | string): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/classes/${id}`);

  return {
    getList,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getStudentStatisticalById,
  };
};
