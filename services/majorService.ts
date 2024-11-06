import { AxiosResponse } from 'axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, Major, ResultResonse } from '@/types';
import axiosInstance from '@/utils/axios';

export type MajorListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useMajorService = () => {
  const getList = (
    params: MajorListParams | null = null
  ): Promise<AxiosResponse<ResultResonse<Major[]>, any>> =>
    axiosInstance.get('/training-industries', { params });

  const getMajor = (id: number | string): Promise<AxiosResponse<ResultResonse<Major>, any>> =>
    axiosInstance.get(`/training-industries/${id}`);

  const createMajor = (major: Major): Promise<AxiosResponse<ResultResonse<Major>, any>> =>
    axiosInstance.post('/training-industries', major);

  const updateMajor = (major: Major): Promise<AxiosResponse<ResultResonse<Major>, any>> =>
    axiosInstance.put(`/training-industries/${major.id}`, major);

  const deleteMajor = (id: number | string): Promise<AxiosResponse<ResultResonse<null>, any>> =>
    axiosInstance.delete(`/training-industries/${id}`);

  return {
    getList,
    getMajor,
    createMajor,
    updateMajor,
    deleteMajor,
  };
};
