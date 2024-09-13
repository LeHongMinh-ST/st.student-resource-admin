import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { AdmissionYear, BaseParamsList, ResultResonse } from '@/types';

export type AdmissionYearListParams = {} & BaseParamsList;

export const useStudentService = () => {
  const getListAdmission = (
    params: AdmissionYearListParams = {} as AdmissionYearListParams
  ): Promise<AxiosResponse<ResultResonse<AdmissionYear[]>, any>> =>
    axiosInstance.get('/admission-year', { params });

  return {
    getListAdmission,
  };
};
