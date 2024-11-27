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

  return {
    downloadReportTemplate03,
    downloadReportTemplate01,
    downloadReportTemplate02,
  };
};
