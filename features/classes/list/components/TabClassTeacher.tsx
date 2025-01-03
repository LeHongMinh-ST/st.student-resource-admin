import { LoadingOverlay, rem, Tabs, Text } from '@mantine/core';
import styled from '@emotion/styled';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconNotebook } from '@tabler/icons-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { CommonDataTable, DeleteModal, StatusBadge } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import { defaultPramsList } from '@/constants/commons';
import StatusEnum from '@/enums/status.enum';
import ClassActionMenu from '@/features/classes/components/Cells/ClassActionMenu';
import TeacherNameCellTable from '@/features/classes/components/Cells/TeacherNameCellTable';
import StatusFilter from '@/features/departments/components/Filters/StatusFilter';
import { classRoute } from '@/routes';
import { ClassListParams, useClassService } from '@/services/classService';
import { GeneralClass, ResultResponse, TrainingIndustry } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAdmissionYearClassProps } from '@/utils/recoil/classess/AdmissionYearClassState';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';

type ActiveTabType = 'teacher' | 'sub_teacher';
const TabClassTeacher = () => {
  const admissionYearSelected = useAdmissionYearClassProps();
  const classService = useClassService();
  const { getTrainingIndustryClassByAdmissionYear } = useTrainingIndustryService();
  const [classParams, setClassParams] = useState<ClassListParams>({
    status: StatusEnum.Enable,
    admission_year_id: admissionYearSelected?.id,
    ...defaultPramsList,
  });

  const [activeTab, setActiveTab] = useState<ActiveTabType | null>('teacher');
  const iconStyle = { width: rem(24), height: rem(24) };

  const { push } = useRouter();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<GeneralClass | null>(null);

  const { data: trainingIndustries } = useSWR<TrainingIndustry[]>(
    ['getTrainingIndustryClassByAdmissionYear', admissionYearSelected],
    () =>
      getTrainingIndustryClassByAdmissionYear(Number(admissionYearSelected?.id))
        .then((res) => res.data)
        .catch((e) => e)
  );
  console.log(trainingIndustries);

  const { data, isLoading, mutate } = useSWR<ResultResponse<GeneralClass[]>>([classParams], () =>
    classService
      .getList(classParams)
      .then((res) => res.data)
      .catch((error) => error)
  );

  const columns = useMemo(
    () => [
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
        render: (generalClass: GeneralClass) => (
          <TeacherNameCellTable user={generalClass?.teacher} />
        ),
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
        title: 'Số lượng sinh viên',
        render: (generalClass: GeneralClass) => (
          <Text>{generalClass.students_count} sinh viên</Text>
        ),
        filtering: false,
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
    ],
    [classParams.status, onOpen, setSelected]
  );
  const renderDataTable = useCallback(
    () => (
      <CommonDataTable
        meta={data?.meta}
        columns={columns}
        records={data?.data}
        fetching={isLoading}
        onPageChange={(page) => setClassParams((params) => ({ ...params, page }))}
        onRecordsPerPageChange={(perPage) =>
          setClassParams((params) => ({ ...params, limit: perPage }))
        }
      />
    ),
    [data, columns, isLoading, setClassParams]
  );

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
    <ClassListStyled>
      <DeleteModal entityName="bộ môn" onDelete={handleDelete} isOpen={isOpen} onClose={onClose} />

      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value as ActiveTabType);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="teacher" leftSection={<IconNotebook style={iconStyle} />}>
            <Text fw={500} size="md">
              Lớp chủ nhiệm
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value="sub_teacher" leftSection={<IconBook style={iconStyle} />}>
            <Text fw={500} size="md">
              Lớp cố vấn học tập
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Suspense fallback={<LoadingOverlay visible />}>
          <Tabs.Panel value="teacher">{activeTab === 'teacher' && renderDataTable()}</Tabs.Panel>
          <Tabs.Panel value="sub_teacher">
            {activeTab === 'sub_teacher' && renderDataTable()}
          </Tabs.Panel>
        </Suspense>
      </Tabs>
    </ClassListStyled>
  );
};

const ClassListStyled = styled.div`
  .classList-header {
    display: flex;
    align-items: center;
    justify-content: end;
  }
`;

export default TabClassTeacher;
