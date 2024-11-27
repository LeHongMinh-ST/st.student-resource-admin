import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ExcelFileImport, ResultResponse } from '@/types';
import { ExcelFileImportType } from '@/enums';

export type GetListFileExcelImportByEntityIdParams = {
  type: ExcelFileImportType;
  entity_id: number;
} & BaseParamsList;

export type DownloadFileExcelTemplateImportParams = {
  type?: ExcelFileImportType;
};

export const useExcelImportFileService = () => {
  const downloadTemplateFileImport = (
    params: DownloadFileExcelTemplateImportParams
  ): Promise<AxiosResponse<ResultResponse<any>, any>> =>
    axiosInstance.get('/excel-import-files/download-template', {
      params,
      responseType: 'blob',
    });

  const getListFileImportByEntityId = (
    params: GetListFileExcelImportByEntityIdParams
  ): Promise<AxiosResponse<ResultResponse<ExcelFileImport[]>, any>> =>
    axiosInstance.get(`/excel-import-files`, { params });

  const downloadImportErrorRecord = (id?: number): Promise<AxiosResponse<any, any>> =>
    axiosInstance.get(`/excel-import-files/${id}/download-error`, { responseType: 'blob' });

  const importFile = (data: FormData): Promise<AxiosResponse<void, any>> =>
    axiosInstance.post('/excel-import-files/import', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  return {
    downloadImportErrorRecord,
    downloadTemplateFileImport,
    getListFileImportByEntityId,
    importFile,
  };
};
