import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { defaultPramsList } from '@/constants/commons';
import { AdmissionYear, ResultResonse, Student } from '@/types';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { HttpStatusEnum, StudentStatus } from '@/enums';
import { CommonDataTable, StatusStudentBadge } from '@/components';
import StudentNameCellTable from './StudentListTabComponent/Cells/StudentNameCellTable';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentStatusFilter from './StudentListTabComponent/Filters/StudentStatusFilter';
import { studentRoute } from '@/routes';
import SearchFilter from '@/components/Filters/SearchFilter';

type StudentListTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentListTabContent: FC<StudentListTabContentProps> = ({ admissionYear }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentParams>({
    admission_year_id: admissionYear?.id,
    ...defaultPramsList,
  } as GetListStudentParams);

  const { push } = useRouter();

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
        return error;
      });

  const { data, isLoading } = useSWR<ResultResonse<Student[]>>(
    ['getListStudent', getListStudentParams],
    handleGetListStudent
  );

  const columns: DataTableProps<Student>['columns'] = [
    {
      accessor: 'name',
      title: 'Sinh viên',
      render: (student) => <StudentNameCellTable student={student} />,
      sortable: true,
      filter: (
        <SearchFilter
          label="Tìm kiếm"
          placeholder="vd: Nguyễn Văn A,..."
          setParams={(value) => {
            setGetListStudentParams({
              ...getListStudentParams,
              q: value,
            });
          }}
          searchTermValue={getListStudentParams.q}
        />
      ),
      filtering: !!getListStudentParams.q,
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
          onRowClick={({ record }) => push(studentRoute.show(record?.id))}
        />
      </Paper>
    </StudentImportTabContentStyled>
  );
};

const StudentImportTabContentStyled = styled.div``;

export default StudentListTabContent;
