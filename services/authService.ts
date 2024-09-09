import axiosInstance from '@/utils/axios';

export type LoginPrams = {
  user_name: string;
  password: string;
  remember: boolean;
};

export type RefreshTokenPrams = {
  refresh_token: string;
};

export const useAuthService = () => {
  const login = (params: LoginPrams) => axiosInstance.post('/auth/login', params);

  const refreshToken = (params: RefreshTokenPrams) => axiosInstance.post('/auth/refresh', params);

  const getProfile = () => axiosInstance.get('/auth/profile');

  return {
    login,
    refreshToken,
    getProfile,
  };
};
