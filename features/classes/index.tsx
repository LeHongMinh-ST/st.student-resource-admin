import { Button, Container, Paper, Stack, Text } from '@mantine/core';
import styled from '@emotion/styled';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
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
import { GeneralClass, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const ClassPage = () => {
  const classService = useClassService();
  const [classParams, setClassParams] = useState<ClassListParams>({
    ...defaultPramsList,
  });

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

  const columns: DataTableProps<GeneralClass>['columns'] = useMemo(
    () => [
      {
        accessor: 'code',
        title: 'Mã lớp',
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
        sorting: true,
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
        accessor: 'name',
        title: 'Tên lớp',
        render: (generalClass: GeneralClass) => <Text>{generalClass.name}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'teacher_name',
        title: 'Giảng viên chủ nhiệm',
        render: (generalClass: GeneralClass) => (
          <TeacherNameCellTable user={generalClass?.teacher} />
        ),
        sorting: true,
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
        sorting: true,
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
    [authUser?.id, onOpen, setClassParams, classParams.q, classParams.status]
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await classService.deleteClass(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, classService]);

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
              <Button
                component={Link}
                href={classRoute.create}
                leftSection={<IconPlus size={18} />}
              >
                Tạo mới
              </Button>
            }
          />
          <Paper p="md" shadow="md" radius="md">
            <CommonDataTable
              meta={data?.meta}
              columns={columns}
              records={data?.data}
              fetching={isLoading}
              onPageChange={(page: number) => setClassParams((params) => ({ ...params, page }))}
              onRecordsPerPageChange={(perPage: number) =>
                setClassParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </ClassPageStyled>
  );
};

const ClassPageStyled = styled.div``;

export default ClassPage;
