import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse } from '@/types';
import { ExcelFileImportType } from '@/enums';

export type GetListFileExcelImportByEntityIdParams = {
  type: ExcelFileImportType;
  entity_id: number;
} & BaseParamsList;

export type DownloadFileExcelTemplateImportParams = {
  survey_id?: number;
};

export type getReportTemplateImportParams = {
  survey_id?: number;
};

export const useReportSurveyService = () => {
  const downloadReportTemplate03 = (
    params: DownloadFileExcelTemplateImportParams
  ): Promise<AxiosResponse<ResultResponse<any>, any>> =>
    axiosInstance.get('/reports/employment-survey-template-three', {
      params,
      responseType: 'blob',
    });

  const downloadReportTemplate01 = (
    params: DownloadFileExcelTemplateImportParams
  ): Promise<AxiosResponse<ResultResponse<any>, any>> =>
    axiosInstance.get('/reports/employment-survey-template-one', {
      params,
      responseType: 'blob',
    });

  const downloadReportTemplate02 = (
    params: DownloadFileExcelTemplateImportParams
  ): Promise<AxiosResponse<ResultResponse<any>, any>> =>
    axiosInstance.get('/reports/employment-survey-template-two', {
      params,
      responseType: 'blob',
    });

  const getReportTemplate01 = (
    params: getReportTemplateImportParams | null = null
  ): Promise<AxiosResponse<ResultResponse<[]>, any>> =>
    axiosInstance.get('/reports/get-employment-survey-template-one', { params });

  const getReportTemplate02 = (
    params: getReportTemplateImportParams | null = null
  ): Promise<AxiosResponse<ResultResponse<[]>, any>> =>
    axiosInstance.get('/reports/get-employment-survey-template-two', { params });

  const getReportTemplate03 = (
    params: getReportTemplateImportParams | null = null
  ): Promise<AxiosResponse<ResultResponse<[]>, any>> =>
    axiosInstance.get('/reports/get-employment-survey-template-three', { params });

  return {
    downloadReportTemplate03,
    downloadReportTemplate01,
    downloadReportTemplate02,
    getReportTemplate01,
    getReportTemplate02,
    getReportTemplate03,
  };
};
