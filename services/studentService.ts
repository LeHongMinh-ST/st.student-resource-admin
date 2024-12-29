import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import {
  AdmissionYear,
  BaseParamsList,
  ExcelFileImport,
  GeneralClass,
  ResultResponse,
  Student,
} from '@/types';
import { Gender, SocialPolicyObject, StudentStatus, TrainingType } from '@/enums';
import StatusSurvey from '@/enums/statusSurvey.enum';

export type AdmissionYearListParams = {} & BaseParamsList;
export type StudentFileImportListParams = {} & BaseParamsList;
export type GetListStudentParams = {
  status?: StudentStatus;
} & BaseParamsList;
export type GetListStudentBySurveyParams = {
  status_survey?: StatusSurvey;
} & BaseParamsList;

export type ChangeStatusStudent = {
  status: StudentStatus;
};

export type UpdateStudentRequestData = {
  last_name?: string;
  first_name?: string;
  code?: string;
  gender?: Gender;
  thumbnail?: File | null;
  person_email?: string;
  permanent_residence?: string;
  dob?: string; // Format: d-m-Y
  pob?: string;
  countryside?: string;
  address?: string;
  training_type?: TrainingType;
  phone?: string;
  nationality?: string;
  citizen_identification?: string;
  ethnic?: string;
  religion?: string;
  social_policy_object?: SocialPolicyObject;
  note?: string;
};

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

  const getStatisticalAdmissionYear = (id: number | string): Promise<AxiosResponse<any, any>> =>
    axiosInstance.get(`/admission-year/${id}/student-statistical`);

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

  const updateStudent = (
    data: Student,
    id: number
  ): Promise<AxiosResponse<ResultResponse<Student>, any>> =>
    axiosInstance.post(`/students/${id}`, data);

  const getStudentClassesById = (
    id: string | number | undefined
  ): Promise<AxiosResponse<ResultResponse<GeneralClass[]>, any>> =>
    axiosInstance.get(`/students/${id}/classes`);

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

  const changeStatusStudent = (id: string | number, data: ChangeStatusStudent) =>
    axiosInstance.put(`students/${id}/change-status`, data);

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
    changeStatusStudent,
    getStudentClassesById,
    updateStudent,
    getStatisticalAdmissionYear,
  };
};
