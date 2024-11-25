import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResonse } from '@/types';
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
  ): Promise<AxiosResponse<ResultResonse<any>, any>> =>
    axiosInstance.get('/reports/employment-survey-template-three', {
      params,
      responseType: 'blob',
    });

  const downloadReportTemplate01 = (
    params: DownloadFileExcelTemplateImportParams
  ): Promise<AxiosResponse<ResultResonse<any>, any>> =>
    axiosInstance.get('/reports/employment-survey-template-one', {
      params,
      responseType: 'blob',
    });

  // const getListFileImportByEntityId = (
  //   params: GetListFileExcelImportByEntityIdParams
  // ): Promise<AxiosResponse<ResultResonse<ExcelFileImport[]>, any>> =>
  //   axiosInstance.get(`/excel-import-files`, { params });

  // const downloadImportErrorRecord = (id?: number): Promise<AxiosResponse<any, any>> =>
  //   axiosInstance.get(`/excel-import-files/${id}/download-error`, { responseType: 'blob' });

  // const importFile = (data: FormData): Promise<AxiosResponse<void, any>> =>
  //   axiosInstance.post('/excel-import-files/import', data, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  return {
    downloadReportTemplate03,
    downloadReportTemplate01,
  };
};
