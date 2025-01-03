import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, User, ResultResponse } from '@/types';
import Role from '@/enums/role.enum';

export type UserListParams = {
  status?: Status;
  role?: Role;
  facultyId?: number;
} & BaseParamsList;

export const useUserService = () => {
  const getList = (
    params: UserListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<User[]>, any>> => axiosInstance.get('/users', { params });

  const getUser = (id: number | string): Promise<AxiosResponse<ResultResponse<User>, any>> =>
    axiosInstance.get(`/users/${id}`);

  const createUser = (user: User): Promise<AxiosResponse<ResultResponse<User>, any>> =>
    axiosInstance.post('/users', user);

  const updateUser = (user: User): Promise<AxiosResponse<ResultResponse<User>, any>> =>
    axiosInstance.post(`/users/${user.id}`, user);

  const deleteUser = (id: number | string): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/users/${id}`);

  return {
    getList,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
};
