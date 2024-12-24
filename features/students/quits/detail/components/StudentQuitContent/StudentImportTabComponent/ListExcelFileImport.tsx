import { FC, useEffect, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { Paper, Text } from '@mantine/core';
import useSWR from 'swr';
import Pusher from 'pusher-js';
import { CommonDataTable, StatusFileImportBadge } from '@/components';
import { ExcelFileImport, Quit, ResultResponse } from '@/types';
import { defaultPramsList } from '@/constants/commons';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import {
  GetListFileExcelImportByEntityIdParams,
  useExcelImportFileService,
} from '@/services/ExcelImportFileService';
import { ExcelFileImportType } from '@/enums';
import ExcelFileImportActionMenu from '@/features/students/quits/detail/components/StudentQuitContent/StudentImportTabComponent/Cells/ExcelFileImportActionMenu';

type ListExcelFileImportProps = {
  quit?: Quit;
  isReloadList?: boolean;
};

const ListExcelFileImport: FC<ListExcelFileImportProps> = ({ isReloadList = false, quit }) => {
  const [excelFileImportsParams, setExcelFileImportPrams] =
    useState<GetListFileExcelImportByEntityIdParams>({
      type: ExcelFileImportType.Quit,
      entity_id: quit?.id ?? 0,
      ...defaultPramsList,
    });
  const { getListFileImportByEntityId } = useExcelImportFileService();

  const handleGetListExcelFileImport = () =>
    getListFileImportByEntityId(excelFileImportsParams).then((res) => res.data);

  const { data, isLoading, mutate } = useSWR<ResultResponse<ExcelFileImport[]>>(
    [quit, excelFileImportsParams, isReloadList],
    handleGetListExcelFileImport
  );
  const auth = useAuthStore();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
      cluster: 'ap1',
    });

    const channel = pusher.subscribe(`import-student-quit-channel.${auth.authUser?.id}`);
    channel.bind('import-student-quit-event', () => {
      mutate().then();
    });
  }, []);

  const columns: DataTableProps<ExcelFileImport>['columns'] = [
    {
      accessor: 'name',
      title: 'Tên tệp',
    },
    {
      accessor: 'total_record',
      title: 'Tổng số bản ghi',
      textAlign: 'center',
    },
    {
      accessor: 'process_record',
      title: 'Bản ghi xử lý thành công',
      textAlign: 'center',
      render: (excelFileImport: ExcelFileImport) => (
        <Text fz="sm">{excelFileImport.process_record}</Text>
      ),
    },
    {
      accessor: 'file_errors_count',
      title: 'Bản ghi lỗi',
      textAlign: 'center',
    },
    {
      accessor: 'status',
      title: 'Trạng thái',
      render: (excelFileImport: ExcelFileImport) => (
        <StatusFileImportBadge
          status={excelFileImport?.status}
          total_record={excelFileImport.total_record}
          error_record={excelFileImport.file_errors_count}
          handle_record={excelFileImport.process_record}
        />
      ),
    },
    {
      accessor: 'user_name',
      title: 'Người tạo',

      render: (excelFileImport: ExcelFileImport) => (
        <Text fz="sm">
          {excelFileImport?.user?.last_name} {excelFileImport?.user?.first_name}
        </Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Hành động',
      width: 100,
      render: (excelFileImport: ExcelFileImport) => (
        <ExcelFileImportActionMenu excelFileImport={excelFileImport} />
      ),
    },
  ];

  return (
    <div className="excel-file-imports">
      <Paper p="md" shadow="md" radius="md">
        <CommonDataTable
          meta={data?.meta}
          columns={columns}
          records={data?.data}
          fetching={isLoading}
          onPageChange={(page: number) =>
            setExcelFileImportPrams((params: GetListFileExcelImportByEntityIdParams) => ({
              ...params,
              page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setExcelFileImportPrams((params: GetListFileExcelImportByEntityIdParams) => ({
              ...params,
              page: perPage,
            }))
          }
        />
      </Paper>
    </div>
  );
};

export default ListExcelFileImport;
