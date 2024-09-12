import { DataTable, DataTableProps } from 'mantine-datatable';
import { MetaResponse } from '@/types';

type CommonDataTableProps<T> = {
  columns: DataTableProps<T>['columns'];
  records: T[];
  meta: MetaResponse;
  onPageChange?: () => {};
  onRecordsPerPageChange?: () => {};
  noRecordsText?: string;
};

export default function CommonDataTable<T>({
  columns,
  records,
  meta,
  onPageChange,
  onRecordsPerPageChange,
  noRecordsText = 'Không có dữ liệu',
}: CommonDataTableProps<T>) {
  return (
    <DataTable
      minHeight={200}
      verticalSpacing="xs"
      striped
      highlightOnHover
      columns={columns}
      records={records}
      recordsPerPageOptions={[5, 10, 20, 50]}
      totalRecords={meta.total}
      page={meta.current_page}
      recordsPerPage={meta.per_page}
      noRecordsText={noRecordsText}
      recordsPerPageLabel=""
      onPageChange={onPageChange}
      onRecordsPerPageChange={onRecordsPerPageChange}
    />
  );
}
