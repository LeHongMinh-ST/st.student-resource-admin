import { FC, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { Paper, Text } from '@mantine/core';
import useSWR from 'swr';
import { CommonDataTable, StatusFileImportBadge } from '@/components';
import { AdmissionYear, ExcelFileImport, ResultResonse } from '@/types';
import { defaultPramsList } from '@/constants/commons';
import { StudentFileImportListParams, useStudentService } from '@/services/studentService';
import { formatDateString } from '@/utils/func/formatDateString';

type ListExcelFileImportProps = {
  admissionYear: AdmissionYear;
  isReloadList?: boolean;
};

const ListExcelFileImport: FC<ListExcelFileImportProps> = ({
  admissionYear,
  isReloadList = false,
}) => {
  const [excelFileImportsParams, setExcelFileImportPrams] = useState<StudentFileImportListParams>({
    ...defaultPramsList,
  });
  const { getStudentFileImportListAdmission } = useStudentService();

  const handleGetListExcelFileImport = () =>
    getStudentFileImportListAdmission(admissionYear.id ?? 0, excelFileImportsParams).then(
      (res) => res.data
    );

  const { data, isLoading } = useSWR<ResultResonse<ExcelFileImport[]>>(
    [admissionYear, excelFileImportsParams, isReloadList],
    handleGetListExcelFileImport
  );

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
        <StatusFileImportBadge status={excelFileImport.status} />
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
      accessor: 'created_at',
      title: 'Ngày tạo',
      sortable: true,
      render: (excelFileImport: ExcelFileImport) => (
        <Text fz="sm">{formatDateString(excelFileImport?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
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
            setExcelFileImportPrams((params: StudentFileImportListParams) => ({
              ...params,
              current_page: page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setExcelFileImportPrams((params: StudentFileImportListParams) => ({
              ...params,
              limit: perPage,
            }))
          }
        />
      </Paper>
    </div>
  );
};

export default ListExcelFileImport;
