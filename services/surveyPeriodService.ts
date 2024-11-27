import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, SurveyPeriod } from '@/types';

export type SurveyPeriodListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useSurveyPeriodService = () => {
  const getList = (
    params: SurveyPeriodListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod[]>, any>> =>
    axiosInstance.get('/survey-periods', { params });

  const getSurveyPeriod = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod>, any>> =>
    axiosInstance.get(`/survey-periods/${id}`);

  const createSurveyPeriod = (
    surveyPeriod: SurveyPeriod
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod>, any>> =>
    axiosInstance.post('/survey-periods', surveyPeriod);

  const updateSurveyPeriod = (
    surveyPeriod: SurveyPeriod
  ): Promise<AxiosResponse<ResultResponse<SurveyPeriod>, any>> =>
    axiosInstance.patch(`/survey-periods/${surveyPeriod.id}`, surveyPeriod);

  const deleteSurveyPeriod = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/survey-periods/${id}`);

  const sendMailSurveyPeriod = (
    id: number | string,
    options?: {
      is_all_mail_student?: boolean;
      list_student_mail?: string[];
    }
  ): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.post(`/survey-periods/${id}/send-mail`, options);

  return {
    getList,
    getSurveyPeriod,
    createSurveyPeriod,
    updateSurveyPeriod,
    deleteSurveyPeriod,
    sendMailSurveyPeriod,
  };
};
