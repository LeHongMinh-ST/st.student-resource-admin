import axiosInstance from '@/utils/axios';

export type LoginPrams = {
  username: string;
  password: string;
  isRemember: boolean;
};

export type RefreshTokenPrams = {
  refreshToken: string;
};

export const useAuthService = () => {
  const login = (params: LoginPrams) => axiosInstance.post('/login', params);

  const refreshToken = (params: RefreshTokenPrams) => axiosInstance.post('/refresh', params);

  const getProfile = () => axiosInstance.get('/profile');

  return {
    login,
    refreshToken,
    getProfile,
  };
};
