import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { defaultPramsList } from '@/constants/commons';
import { AdmissionYear, ResultResonse, Student } from '@/types';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { HttpStatusEnum, StudentStatus } from '@/enums';
import { CommonDataTable, StatusStudentBadge } from '@/components';
import StudentNameCellTable from './StudentListTabComponent/Cells/StudentNameCellTable';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentStatusFilter from './StudentListTabComponent/Filters/StudentStatusFilter';

type StudentListTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentListTabContent: FC<StudentListTabContentProps> = ({ admissionYear }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentParams>({
    admission_year_id: admissionYear?.id,
    ...defaultPramsList,
  } as GetListStudentParams);
  const { getListStudent } = useStudentService();
  const handleGetListStudent = () =>
    getListStudent(getListStudentParams)
      .then((res) => res.data)
      .catch((error) => {
        if (error?.status === HttpStatusEnum.HTTP_FORBIDDEN) {
          notifications.show({
            title: 'Cảnh báo!',
            message: 'Bạn không có quyền truy cập!',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        } else {
          notifications.show({
            title: 'Lỗi',
            message: 'Có lỗi sảy ra vui lòng thử lại sau !',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
      });

  const { data, isLoading } = useSWR<ResultResonse<Student>>(
    ['getListStudent', getListStudentParams],
    handleGetListStudent
  );

  const columns: DataTableProps<Student>['columns'] = [
    {
      accessor: 'name',
      title: 'Sinh viên',
      render: (student) => <StudentNameCellTable student={student} />,
      sortable: true,
    },
    {
      accessor: 'code',
      title: 'Mã sinh viên',
    },
    {
      accessor: 'currentClass.name',
      title: 'Lớp',
      render: (student) => (
        <Text>
          {student.currentClass?.code} - {student.currentClass?.name}
        </Text>
      ),
    },
    {
      accessor: 'status',
      title: 'Trạng thái',
      render: (student) => <StatusStudentBadge status={student.status} />,

      filter: (
        <StudentStatusFilter
          value={getListStudentParams?.status}
          onChange={(value) =>
            setGetListStudentParams({ ...getListStudentParams, status: value as StudentStatus })
          }
        />
      ),
      filtering: !!getListStudentParams.status,
    },
    {
      accessor: 'created_at',
      title: 'Ngày tạo',
      sortable: true,
      render: (student) => (
        <Text fz="sm">{formatDateString(student?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
      ),
    },
  ];

  return (
    <StudentImportTabContentStyled>
      <Paper p="md" shadow="md" radius="md">
        <CommonDataTable
          meta={data?.meta}
          columns={columns}
          records={data?.data}
          fetching={isLoading}
          onPageChange={(page: number) =>
            setGetListStudentParams((params: GetListStudentParams) => ({
              ...params,
              page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setGetListStudentParams((params: GetListStudentParams) => ({
              ...params,
              limit: perPage,
            }))
          }
        />
      </Paper>
    </StudentImportTabContentStyled>
  );
};

const StudentImportTabContentStyled = styled.div``;

export default StudentListTabContent;
