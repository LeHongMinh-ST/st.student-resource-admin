import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, Department } from '@/types';

export type DepartmentListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useDepartmentService = () => {
  const getList = (
    params: DepartmentListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<Department[]>, any>> =>
    axiosInstance.get('/departments', { params });

  const getDepartment = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<Department>, any>> =>
    axiosInstance.get(`/departments/${id}`);

  const createDepartment = (
    department: Department
  ): Promise<AxiosResponse<ResultResponse<Department>, any>> =>
    axiosInstance.post('/departments', department);

  const updateDepartment = (
    department: Department
  ): Promise<AxiosResponse<ResultResponse<Department>, any>> =>
    axiosInstance.put(`/departments/${department.id}`, department);

  const deleteDepartment = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/departments/${id}`);

  return {
    getList,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
