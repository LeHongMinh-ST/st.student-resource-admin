import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { AdmissionYear, BaseParamsList, ExcelFileImport, ResultResonse, Student } from '@/types';
import { StudentStatus } from '@/enums';

export type AdmissionYearListParams = {} & BaseParamsList;
export type StudentFileImportListParams = {} & BaseParamsList;
export type GetListStudentParams = {
  admission_year_id?: number;
  status?: StudentStatus;
} & BaseParamsList;

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

  const getListStudent = (
    params: GetListStudentParams = {} as GetListStudentParams
  ): Promise<AxiosResponse<ResultResonse<Student[]>, any>> =>
    axiosInstance.get('/students', { params });

  const getTotalStudent = (
    params: GetListStudentParams = {} as GetListStudentParams
  ): Promise<AxiosResponse<any>> => axiosInstance.get('/students/total', { params });

  const getStudentById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResonse<Student>, any>> => axiosInstance.get(`/students/${id}`);

  const downloadTemplateImportStudentAdmission = (): Promise<
    AxiosResponse<ResultResonse<any>, any>
  > => axiosInstance.get('students/import-course/download-template', { responseType: 'blob' });

  const importStudent = (data: FormData): Promise<AxiosResponse<void, any>> =>
    axiosInstance.post('/students/import-course', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  const downloadImportErrorRecord = (id?: number): Promise<AxiosResponse<any, any>> =>
    axiosInstance.get(`students/import-course/${id}/download-error`, { responseType: 'blob' });

  return {
    getStudentById,
    getListAdmission,
    getListStudent,
    getStudentFileImportListAdmission,
    importStudent,
    downloadTemplateImportStudentAdmission,
    downloadImportErrorRecord,
    getTotalStudent,
  };
};
