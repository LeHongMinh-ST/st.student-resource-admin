import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { DataTableProps } from 'mantine-datatable';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { defaultPramsList } from '@/constants/commons';
import { AdmissionYear, ResultResponse, Student } from '@/types';
import { GetListStudentParams, useStudentService } from '@/services/studentService';
import { StudentStatus } from '@/enums';
import { CommonDataTable, StatusStudentBadge } from '@/components';
import StudentNameCellTable from './StudentListTabComponent/Cells/StudentNameCellTable';
import { formatDateString } from '@/utils/func/formatDateString';
import StudentStatusFilter from './StudentListTabComponent/Filters/StudentStatusFilter';
import { studentRoute } from '@/routes';
import SearchFilter from '@/components/Filters/SearchFilter';

type StudentListTabContentProps = {
  admissionYear: AdmissionYear | null;
};

const StudentListTabContent: FC<StudentListTabContentProps> = ({ admissionYear }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentParams>({
    admission_year_id: admissionYear?.id,
    ...defaultPramsList,
  } as GetListStudentParams);

  const { push } = useRouter();

  const { getStatisticalAdmissionYear, getListStudent } = useStudentService();

  const { data, isLoading } = useSWR<ResultResponse<Student[]>>(
    ['getListStudent', getListStudentParams],
    () =>
      getListStudent(getListStudentParams)
        .then((res) => res.data)
        .catch((error) => error)
  );

  const { data: studentStatistical } = useSWR<any>([
    ['getStatisticalAdmissionYear'],
    () => getStatisticalAdmissionYear(Number(admissionYear?.id)).then((res) => res.data),
  ]);
  console.log(studentStatistical);

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
      accessor: 'dob',
      title: 'Ngày sinh',
      render: (student) => <Text>{formatDateString(student?.info?.dob, 'dd/mm/yyyy')}</Text>,
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
