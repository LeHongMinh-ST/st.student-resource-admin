import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, schoolYear } from '@/types';

export type SchoolYearListParams = {
  q?: string;
} & BaseParamsList;

export const useSchoolYearService = () => {
  const getList = (
    params: SchoolYearListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<schoolYear[]>, any>> =>
    axiosInstance.get('/school-year', { params });
  return {
    getList,
  };
};
