import { AxiosResponse } from 'axios';
import { ResultResponse } from '@/types';
import axiosInstance from '@/utils/axios';

export type DashboardStatistical = {
  student_count: number;
  student_graduated_count: number;
  student_warning_count: number;
  class_count: number;
};

export const useDashboardService = () => {
  const getDashboardStatistical = (): Promise<
    AxiosResponse<ResultResponse<DashboardStatistical>>
  > => axiosInstance.get('/dashboard/get-dashboard-statistical');

  return {
    getDashboardStatistical,
  };
};
