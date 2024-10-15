import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResonse, Class, Student } from '@/types';

export type ClassListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useClassService = () => {
  const getList = (
    params: ClassListParams | null = null
  ): Promise<AxiosResponse<ResultResonse<Class[]>, any>> =>
    axiosInstance.get('/classes', { params });

  const getClass = (id: number | string): Promise<AxiosResponse<ResultResonse<Class>, any>> =>
    axiosInstance.get(`/classes/${id}`);

  const createClass = (generalClass: Class): Promise<AxiosResponse<ResultResonse<Class>, any>> =>
    axiosInstance.post('/classes', generalClass);

  const getClassById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResonse<Student>, any>> => axiosInstance.get(`/classes/${id}`);

  const updateClass = (generalClass: Class): Promise<AxiosResponse<ResultResonse<Class>, any>> =>
    axiosInstance.patch(`/classes/${generalClass.id}`, generalClass);

  const deleteClass = (id: number | string): Promise<AxiosResponse<ResultResonse<null>, any>> =>
    axiosInstance.delete(`/classes/${id}`);

  return {
    getList,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
  };
};
