import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { defaultPramsList } from '@/constants/commons';
import { Quit, Student, ResultResponse } from '@/types';
import { HttpStatusEnum } from '@/enums';
import { CommonDataTable } from '@/components';
import StudentNameCellTable from './StudentListTabComponent/Cells/StudentNameCellTable';
import { formatDateString } from '@/utils/func/formatDateString';
import { studentRoute } from '@/routes';
import SearchFilter from '@/components/Filters/SearchFilter';
import { useQuitStudentService, QuitListParams } from '@/services/QuitStudentService';

type StudentListTabContentProps = {
  quit?: Quit;
};

const StudentListTabContent: FC<StudentListTabContentProps> = ({ quit }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<QuitListParams>({
    ...defaultPramsList,
  } as QuitListParams);

  const { push } = useRouter();

  const { getListStudent } = useQuitStudentService();
  const handleGetListStudent = () =>
    getListStudent(Number(quit?.id), getListStudentParams)
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
    ['getListStudent', getListStudentParams, quit],
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
            setGetListStudentParams((params: QuitListParams) => ({
              ...params,
              page,
            }))
          }
          onRecordsPerPageChange={(perPage: number) =>
            setGetListStudentParams((params: QuitListParams) => ({
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
