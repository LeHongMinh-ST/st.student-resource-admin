import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResonse, TrainingIndustry } from '@/types';

export type TrainingIndustryListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useTrainingIndustryService = () => {
  const getList = (
    params: TrainingIndustryListParams | null = null
  ): Promise<AxiosResponse<ResultResonse<TrainingIndustry[]>, any>> =>
    axiosInstance.get('/training-industries', { params });

  const getTrainingIndustry = (
    id: number | string
  ): Promise<AxiosResponse<ResultResonse<TrainingIndustry>, any>> =>
    axiosInstance.get(`/training-industries/${id}`);

  const createTrainingIndustry = (
    trainingIndustry: TrainingIndustry
  ): Promise<AxiosResponse<ResultResonse<TrainingIndustry>, any>> =>
    axiosInstance.post('/training-industries', trainingIndustry);

  const updateTrainingIndustry = (
    trainingIndustry: TrainingIndustry
  ): Promise<AxiosResponse<ResultResonse<TrainingIndustry>, any>> =>
    axiosInstance.put(`/training-industries/${trainingIndustry.id}`, trainingIndustry);

  const deleteTrainingIndustry = (
    id: number | string
  ): Promise<AxiosResponse<ResultResonse<null>, any>> =>
    axiosInstance.delete(`/training-industries/${id}`);

  return {
    getList,
    getTrainingIndustry,
    createTrainingIndustry,
    updateTrainingIndustry,
    deleteTrainingIndustry,
  };
};
