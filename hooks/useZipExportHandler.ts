import { useEffect } from 'react';
import useSWR from 'swr';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import {
  useSetZipExportFileProps,
  useZipExportFileProps,
} from '@/utils/recoil/fileExport/FileExportState';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import { ResultResponse, ZipExportFile } from '@/types';

export const useZipExportHandler = () => {
  const auth = useAuthStore();
  const zipExportFile = useZipExportFileProps();
  const setZipExportFile = useSetZipExportFileProps();
  const { getFileZipSurveyResponse, downloadFileZipSurveyResponse } = useSurveyPeriodService();

  const fetchZipSurveyResponse = async (): Promise<ResultResponse<ZipExportFile>> => {
    try {
      const res = await getFileZipSurveyResponse(Number(zipExportFile?.id));
      return res.data;
    } catch (error) {
      setZipExportFile(null);
      throw error;
    }
  };

  const { data, mutate } = useSWR<ResultResponse<ZipExportFile>>(
    zipExportFile?.id ? [zipExportFile] : null,
    fetchZipSurveyResponse
  );

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
      cluster: 'ap1',
    });

    const channel = pusher.subscribe(`export-survey-response-channel.${auth.authUser?.id}`);
    channel.bind('export-survey-response-event', () => {
      mutate().then();
    });

    return () => {
      pusher.unsubscribe(`export-survey-response-channel.${auth.authUser?.id}`);
    };
  }, []);

  const handleDownloadZipFileResponse = async (id: string | number): Promise<void> => {
    try {
      const res = await downloadFileZipSurveyResponse(id);
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `response_survey_${id}.zip`);
      document.body.appendChild(link);
      link.click();

      // Clean up after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Clear popup after 1s
      setTimeout(() => {
        setZipExportFile(null);
      }, 2000);
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  return {
    data,
    handleDownloadZipFileResponse,
  };
};
