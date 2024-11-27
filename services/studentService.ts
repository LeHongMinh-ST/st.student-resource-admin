import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { AdmissionYear, BaseParamsList, ExcelFileImport, ResultResponse, Student } from '@/types';
import { StudentStatus } from '@/enums';
import StatusSurvey from '@/enums/statusSurvey.enum';

export type AdmissionYearListParams = {} & BaseParamsList;
export type StudentFileImportListParams = {} & BaseParamsList;
export type GetListStudentParams = {
  status?: StudentStatus;
} & BaseParamsList;
export type GetListStudentBySurveyParams = {
  status_survey?: StatusSurvey;
} & BaseParamsList;

export const useStudentService = () => {
  const getListAdmission = (
    params: AdmissionYearListParams = {} as AdmissionYearListParams
  ): Promise<AxiosResponse<ResultResponse<AdmissionYear[]>, any>> =>
    axiosInstance.get('/admission-year', { params });

  const getStudentFileImportListAdmission = (
    admissionYearId: number,
    params: StudentFileImportListParams = {} as StudentFileImportListParams
  ): Promise<AxiosResponse<ResultResponse<ExcelFileImport[]>, any>> =>
    axiosInstance.get(`/admission-year/${admissionYearId}/student-file-imports`, { params });

  const getListStudent = (
    params: GetListStudentParams = {} as GetListStudentParams
  ): Promise<AxiosResponse<ResultResponse<Student[]>, any>> =>
    axiosInstance.get('/students', { params });

  const getListStudentBySurveyPeriod = (
    surveyPeriodId: number,
    params: GetListStudentBySurveyParams = {} as GetListStudentParams
  ): Promise<AxiosResponse<ResultResponse<Student[]>, any>> =>
    axiosInstance.get(`/students/survey-period/${surveyPeriodId}`, { params });

  const getTotalStudent = (
    params: GetListStudentParams = {} as GetListStudentParams
  ): Promise<AxiosResponse<any>> => axiosInstance.get('/students/total', { params });

  const getStudentById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResponse<Student>, any>> => axiosInstance.get(`/students/${id}`);

  const downloadTemplateImportStudentAdmission = (): Promise<
    AxiosResponse<ResultResponse<any>, any>
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
    getListStudentBySurveyPeriod,
  };
};
