import {
  Button,
  Container,
  LoadingOverlay,
  Paper,
  rem,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import styled from '@emotion/styled';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconNotebook, IconPlus } from '@tabler/icons-react';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { CommonDataTable, DeleteModal, PageHeader, StatusBadge } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import { defaultPramsList } from '@/constants/commons';
import StatusEnum from '@/enums/status.enum';
import ClassActionMenu from '@/features/classes/components/Cells/ClassActionMenu';
import TeacherNameCellTable from '@/features/classes/components/Cells/TeacherNameCellTable';
import StatusFilter from '@/features/departments/components/Filters/StatusFilter';
import { classRoute, dashboardRoute } from '@/routes';
import { ClassListParams, useClassService } from '@/services/classService';
import { AdmissionYear, GeneralClass, ResultResponse, SelectList } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';
import { useStudentService } from '@/services/studentService';

type ActiveTabType = 'teacher' | 'sub_teacher';
const ClassPage = () => {
  const classService = useClassService();
  const [classParams, setClassParams] = useState<ClassListParams>({
    status: StatusEnum.Enable,
    ...defaultPramsList,
  });

  const [activeTab, setActiveTab] = useState<ActiveTabType | null>('teacher');
  const iconStyle = { width: rem(24), height: rem(24) };

  const { push } = useRouter();
  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<GeneralClass | null>(null);

  const handleGetListClass = () =>
    classService
      .getList(classParams)
      .then((res) => res.data)
      .catch((error) => error);

  // @ts-ignore
  const { data, isLoading, mutate } = useSWR<ResultResponse<Class[]>>(
    [classParams],
    handleGetListClass
  );

  const { getListAdmission } = useStudentService();

  const { data: admissions } = useSWR<AdmissionYear[]>(['getListAdmission'], () =>
    getListAdmission().then((res) => res?.data?.data)
  );
  const dataOptionAdmission: SelectList<string>[] = admissions
    ? admissions?.map(
        (item): SelectList<string> => ({
          label: `K${item.admission_year}`,
          value: `${item?.id}`,
        })
      )
    : [];

  const columns: DataTableProps<GeneralClass>['columns'] = [
    {
      accessor: 'code',
      title: 'Lớp',
      render: (generalClass: GeneralClass) => (
        <Text
          style={{ cursor: 'pointer' }}
          fw={500}
          c="blue"
          onClick={() => push(classRoute.show(generalClass.id))}
        >
          {generalClass.code}
        </Text>
      ),
      filter: (
        <SearchFilter
          label="Tìm kiếm'"
          placeholder="vd: Tên lớp, mã lớp..."
          setParams={(value) => {
            setClassParams({
              ...classParams,
              q: value,
            });
          }}
          searchTermValue={classParams.q}
        />
      ),
      filtering: !!classParams.q,
    },
    {
      accessor: 'teacher_name',
      title: 'Giáo viên chủ nhiệm ',
      render: (generalClass: GeneralClass) => <TeacherNameCellTable user={generalClass?.teacher} />,
      filtering: true,
    },
    {
      accessor: 'teacher_name',
      title: 'Cố vấn học tập ',
      render: (generalClass: GeneralClass) => (
        <TeacherNameCellTable user={generalClass?.sub_teacher} />
      ),
      filtering: true,
    },

    {
      accessor: 'admission_years',
      title: 'Khoá',
      filter: () => (
        <Select
          label="Khoá hoc"
          placeholder="Chọn khoá học"
          data={dataOptionAdmission}
          value={`${classParams.admission_year_id}`}
          onChange={(value) => {
            if (value) {
              setClassParams((pre) => ({
                ...pre,
                admission_year_id: String(value),
              }));
            }
          }}
        />
      ),
      render: (generalClass: GeneralClass) => (
        <Text>Khoá {generalClass.admission_year?.admission_year}</Text>
      ),
      filtering: true,
    },
    {
      accessor: 'status',
      title: 'Trạng thái',
      filter: (
        <StatusFilter
          value={classParams.status}
          onChange={(value) => setClassParams({ ...classParams, status: value as StatusEnum })}
        />
      ),
      render: (generalClass: GeneralClass) => <StatusBadge status={generalClass.status} />,
      filtering: !!classParams.status,
    },
    {
      accessor: 'created_at',
      title: 'Ngày tạo',
      sortable: true,
      render: (generalClass: GeneralClass) => (
        <Text fz="sm">{formatDateString(generalClass?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
      ),
    },
    {
      accessor: 'id',
      title: 'Hành động',
      width: 100,
      render: (generalClass: GeneralClass) => (
        <ClassActionMenu generalClass={generalClass} onOpen={onOpen} setSelected={setSelected} />
      ),
    },
  ];

  const handleDelete = useCallback(async () => {
    if (selected) {
      await classService.deleteClass(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, classService]);

  useEffect(() => {
    setClassParams((pre) => ({
      ...pre,
      type: activeTab as string,
    }));
  }, [activeTab]);

  return (
    <ClassPageStyled>
      <DeleteModal entityName="bộ môn" onDelete={handleDelete} isOpen={isOpen} onClose={onClose} />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Lớp học - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Lớp học', href: null },
            ]}
            withActions={
              authUser?.role === Role.Admin && (
                <Button
                  component={Link}
                  href={classRoute.create}
                  leftSection={<IconPlus size={18} />}
                >
                  Tạo mới
                </Button>
              )
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <Tabs
              value={activeTab}
              onChange={(value) => {
                setActiveTab(value as ActiveTabType);
              }}
            >
              <Tabs.List>
                <Tabs.Tab value="teacher" leftSection={<IconNotebook style={iconStyle} />}>
                  <Text fw={500} size="md">
                    {authUser?.role === Role.Teacher ? 'Lớp phụ trách chủ nhiệm' : 'Tất cả các lớp'}
                  </Text>
                </Tabs.Tab>
                {authUser?.role === Role.Teacher && (
                  <Tabs.Tab value="sub_teacher" leftSection={<IconBook style={iconStyle} />}>
                    <Text fw={500} size="md">
                      Lớp cố vấn học tập
                    </Text>
                  </Tabs.Tab>
                )}
                {/* <Tabs.Tab value="class" leftSection={<IconBook style={iconStyle} />}> */}
                {/*   <Text fw={500} size="md"> */}
                {/*     Lớp học */}
                {/*   </Text> */}
                {/* </Tabs.Tab> */}
                {/* <Tabs.Tab */}
                {/*   value="learning_outcome" */}
                {/*   leftSection={<IconBackpack style={iconStyle} />} */}
                {/* > */}
                {/*   <Text fw={500} size="md"> */}
                {/*     Điểm */}
                {/*   </Text> */}
                {/* </Tabs.Tab> */}
              </Tabs.List>

              <Suspense fallback={<LoadingOverlay visible />}>
                <Tabs.Panel value="teacher">
                  {activeTab === 'teacher' && (
                    <CommonDataTable
                      meta={data?.meta}
                      columns={columns}
                      records={data?.data}
                      fetching={isLoading}
                      onPageChange={(page: number) =>
                        setClassParams((params) => ({ ...params, page }))
                      }
                      onRecordsPerPageChange={(perPage: number) =>
                        setClassParams((params) => ({ ...params, limit: perPage }))
                      }
                    />
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="sub_teacher">
                  {activeTab === 'sub_teacher' && (
                    <CommonDataTable
                      meta={data?.meta}
                      columns={columns}
                      records={data?.data}
                      fetching={isLoading}
                      onPageChange={(page: number) =>
                        setClassParams((params) => ({ ...params, page }))
                      }
                      onRecordsPerPageChange={(perPage: number) =>
                        setClassParams((params) => ({ ...params, limit: perPage }))
                      }
                    />
                  )}
                </Tabs.Panel>
                {/* <Tabs.Panel value="class"> */}
                {/*   {activeTab === 'class' && <ClassStudent studentId={data?.data?.id} />} */}
                {/* </Tabs.Panel> */}
                {/* <Tabs.Panel value="learning_outcome"> */}
                {/*   {activeTab === 'learning_outcome' && <GeneralInfoStudent />} */}
                {/* </Tabs.Panel> */}
              </Suspense>
            </Tabs>
          </Paper>
        </Stack>
      </Container>
    </ClassPageStyled>
  );
};

const ClassPageStyled = styled.div``;

export default ClassPage;
