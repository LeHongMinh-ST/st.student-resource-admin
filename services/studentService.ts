import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { AdmissionYear, BaseParamsList, ExcelFileImport, ResultResonse } from '@/types';

export type AdmissionYearListParams = {} & BaseParamsList;
export type StudentFileImportListParams = {} & BaseParamsList;

export const useStudentService = () => {
  const getListAdmission = (
    params: AdmissionYearListParams = {} as AdmissionYearListParams
  ): Promise<AxiosResponse<ResultResonse<AdmissionYear[]>, any>> =>
    axiosInstance.get('/admission-year', { params });

  const getStudentFileImportListAdmission = (
    admissionYearId: number,
    params: StudentFileImportListParams = {} as StudentFileImportListParams
  ): Promise<AxiosResponse<ResultResonse<ExcelFileImport[]>, any>> =>
    axiosInstance.get(`/admission-year/${admissionYearId}/student-file-imports`, { params });

  const importStudent = (data: FormData): Promise<AxiosResponse<void, any>> =>
    axiosInstance.post('/students/import-course', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  return {
    getListAdmission,
    getStudentFileImportListAdmission,
    importStudent,
  };
};
