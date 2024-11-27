import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { defaultPramsList } from '@/constants/commons';
import { ResultResponse, Student } from '@/types';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { HttpStatusEnum, StudentStatus } from '@/enums';
import { CommonDataTable, StatusStudentBadge } from '@/components';
import { studentRoute } from '@/routes';
import SearchFilter from '@/components/Filters/SearchFilter';
import StudentNameCellTable from '@/features/students/components/StudentAdmissionContent/StudentListTabComponent/Cells/StudentNameCellTable';
import StudentStatusFilter from '@/features/students/components/StudentAdmissionContent/StudentListTabComponent/Filters/StudentStatusFilter';

type StudentListByClassProps = {
  classId: number;
};

const StudentListByClass: FC<StudentListByClassProps> = ({ classId }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentParams>({
    class_id: classId,
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

  const { data, isLoading } = useSWR<ResultResponse<Student[]>>(
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
      render: (student) => <Text>{student.currentClass?.code}</Text>,
    },
    {
      accessor: 'currentClass.phoneNumber',
      title: 'SĐT',
      render: (student) => <Text>{student.info?.phone ?? 'Chưa cập nhật'}</Text>,
    },
    {
      accessor: 'currentClass.email',
      title: 'Email',
      render: (student) => <Text>{student.email}</Text>,
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

export default StudentListByClass;
