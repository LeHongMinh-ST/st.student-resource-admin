import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, SurveyPeriod, ZipExportFile } from '@/types';

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
      student_ids?: number[];
    }
  ): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.post(`/survey-periods/${id}/send-mail`, options);

  const createFileZipSurveyResponse = (
    id: number | string,
    options?: {
      is_all_student?: boolean;
      student_ids?: number[];
    }
  ): Promise<AxiosResponse<ResultResponse<ZipExportFile>, any>> =>
    axiosInstance.post(`/survey-periods/${id}/create-response-survey-zip-file`, options);

  const getFileZipSurveyResponse = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<ZipExportFile>, any>> =>
    axiosInstance.get(`/survey-periods/zip-file/${id}`);

  const downloadFileZipSurveyResponse = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<ZipExportFile>, any>> =>
    axiosInstance.get(`/survey-periods/${id}/download-zip-file`, {
      responseType: 'blob',
    });

  return {
    getFileZipSurveyResponse,
    getList,
    getSurveyPeriod,
    createSurveyPeriod,
    updateSurveyPeriod,
    deleteSurveyPeriod,
    sendMailSurveyPeriod,
    createFileZipSurveyResponse,
    downloadFileZipSurveyResponse,
  };
};
