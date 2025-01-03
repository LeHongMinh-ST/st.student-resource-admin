import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios';
import Status from '@/enums/status.enum';
import { BaseParamsList, ResultResponse, TrainingIndustry } from '@/types';

export type TrainingIndustryListParams = {
  status?: Status;
  q?: string;
} & BaseParamsList;

export const useTrainingIndustryService = () => {
  const getList = (
    params: TrainingIndustryListParams | null = null
  ): Promise<AxiosResponse<ResultResponse<TrainingIndustry[]>, any>> =>
    axiosInstance.get('/training-industries', { params });

  const getTrainingIndustry = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<TrainingIndustry>, any>> =>
    axiosInstance.get(`/training-industries/${id}`);

  const createTrainingIndustry = (
    trainingIndustry: TrainingIndustry
  ): Promise<AxiosResponse<ResultResponse<TrainingIndustry>, any>> =>
    axiosInstance.post('/training-industries', trainingIndustry);

  const updateTrainingIndustry = (
    trainingIndustry: TrainingIndustry
  ): Promise<AxiosResponse<ResultResponse<TrainingIndustry>, any>> =>
    axiosInstance.put(`/training-industries/${trainingIndustry.id}`, trainingIndustry);

  const deleteTrainingIndustry = (
    id: number | string
  ): Promise<AxiosResponse<ResultResponse<null>, any>> =>
    axiosInstance.delete(`/training-industries/${id}`);

  const getTrainingIndustryClassByAdmissionYear = (
    admissionYearId: number | string
  ): Promise<AxiosResponse<TrainingIndustry[], any>> =>
    axiosInstance.get(`admission-year/${admissionYearId}/training-industry-class`);

  return {
    getList,
    getTrainingIndustry,
    createTrainingIndustry,
    updateTrainingIndustry,
    deleteTrainingIndustry,
    getTrainingIndustryClassByAdmissionYear,
  };
};
