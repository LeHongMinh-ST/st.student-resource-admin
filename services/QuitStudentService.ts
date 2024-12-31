import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import { BaseParamsList, ResultResponse, Semester, Student, Quit } from '@/types';
import { GraduationListParams } from '@/services/graduationService';

export type QuitListParams = {
  q?: string;
} & BaseParamsList;

export const useQuitStudentService = () => {
  const getListQuitStudent = (
    params: GraduationListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<Quit[]>, any>> => axiosInstance.get('/quit', { params });

  const createQuitStudent = (data: Quit): Promise<AxiosResponse<ResultResponse<Quit>, any>> =>
    axiosInstance.post('/quit', data);

  const updateQuitStudent = (
    data: Quit,
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Quit>, any>> => axiosInstance.patch(`/quit/${id}`, data);

  const deleteQuitStudent = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> => axiosInstance.delete(`/quit/${id}`);

  const getQuitStudentById = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Quit>, any>> => axiosInstance.get(`/quit/${id}`);

  const getSemesters = (): Promise<AxiosResponse<Semester[], any>> =>
    axiosInstance.get('/semesters');

  const getListStudent = (
    id: number | string,
    params: QuitListParams
  ): Promise<AxiosResponse<ResultResponse<Student[]>, any>> =>
    axiosInstance.get(`/quit/${id}/students`, { params });

  return {
    getListQuitStudent,
    createQuitStudent,
    updateQuitStudent,
    deleteQuitStudent,
    getQuitStudentById,
    getSemesters,
    getListStudent,
  };
};
