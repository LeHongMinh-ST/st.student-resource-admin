import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Paper, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DataTableProps } from 'mantine-datatable';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { useDisclosure } from '@mantine/hooks';
import { defaultPramsList } from '@/constants/commons';
import { FormJobSurvey, ResultResonse, Student } from '@/types';
import {
  GetListStudentBySurveyParams,
  GetListStudentParams,
  useStudentService,
} from '@/services/studentService';
import { HttpStatusEnum } from '@/enums';
import { CommonDataTable } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import StudentNameCellTable from '@/features/students/components/StudentAdmissionContent/StudentListTabComponent/Cells/StudentNameCellTable';
import StatusSurveyBadge from '@/components/Badge/StatusSurveyBadge/StatusSurveyBagde';
import ListStudentServeyActionMenu from '../Cells/ListStudentSurveyActionMenu';
import SurveyResponseModal from '../SurveyResponse/SurveyResponseModal';
import StatusSurveyFilter from '../Filters/StatusSurveyFilter';
import StatusSurvey from '@/enums/statusSurvey.enum';

type StudentListByServeyPeriodProps = {
  surveyPeriodId: number;
};

const StudentListByServeyPeriod: FC<StudentListByServeyPeriodProps> = ({ surveyPeriodId }) => {
  const [getListStudentParams, setGetListStudentParams] = useState<GetListStudentBySurveyParams>({
    ...defaultPramsList,
  } as GetListStudentBySurveyParams);

  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);

  const { getListStudentBySurveyPeriod } = useStudentService();
  const handleGetListStudent = () =>
    getListStudentBySurveyPeriod(surveyPeriodId, getListStudentParams)
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
  const [selected, setSelected] = useState<Student | null>(null);

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
      render: (student) => <Text>{student.info?.person_email ?? 'Chưa cập nhật'}</Text>,
    },
    {
      accessor: 'currentClass.number_mail_send',
      title: 'Số lần gửi mail',
      render: (student) => <Text>{student.current_survey_period?.number_mail_send}</Text>,
    },
    {
      accessor: 'status',
      title: 'Trạng thái',
      render: (student) => <StatusSurveyBadge student={student} />,

      filter: (
        <StatusSurveyFilter
          value={getListStudentParams?.status_survey}
          onChange={(value) =>
            setGetListStudentParams({
              ...getListStudentParams,
              status_survey: value as StatusSurvey,
            })
          }
        />
      ),
      filtering: !!getListStudentParams.status_survey,
    },
    {
      accessor: 'id',
      title: 'Hành động',
      width: 100,
      render: (student: Student) => (
        <ListStudentServeyActionMenu
          student={student}
          onOpenResponse={onOpen}
          setSelected={setSelected}
        />
      ),
    },
  ];

  return (
    <>
      <SurveyResponseModal
        formJobResponse={selected?.current_employment_response ?? ({} as FormJobSurvey)}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelected(null);
        }}
      />
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
    </>
  );
};

const StudentImportTabContentStyled = styled.div``;

export default StudentListByServeyPeriod;
