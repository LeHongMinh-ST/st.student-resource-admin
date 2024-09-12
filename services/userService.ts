import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, User, ResultResonse } from '@/types';
import Role from '@/enums/role.enum';

export type UserListParams = {
  status?: Status;
  role?: Role;
} & BaseParamsList;

export const useUserService = () => {
  const getList = (
    params: UserListParams | null = null
  ): Promise<AxiosResponse<ResultResonse<User[]>, any>> => axiosInstance.get('/users', { params });

  const deleteUser = (id: number | string): Promise<AxiosResponse<ResultResonse<null>, any>> =>
    axiosInstance.delete(`/users/${id}`);

  return {
    getList,
    deleteUser,
  };
};
