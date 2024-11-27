import styled from '@emotion/styled';
import { Button, Container, Paper, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { CommonDataTable, DeleteModal, PageHeader, StatusBadge } from '@/components';
import SearchFilter from '@/components/Filters/SearchFilter';
import { defaultPramsList } from '@/constants/commons';
import StatusEnum from '@/enums/status.enum';
import DepartmentActionMenu from '@/features/departments/components/Cells/DepartmentActionMenu';
import StatusFilter from '@/features/departments/components/Filters/StatusFilter';
import { dashboardRoute, departmentRoute } from '@/routes';
import { DepartmentListParams, useDepartmentService } from '@/services/departmentService';
import { Department, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const DepartmentPage = () => {
  const departmentService = useDepartmentService();
  const [departmentParams, setDepartmentParams] = useState<DepartmentListParams>({
    ...defaultPramsList,
  });

  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<Department | null>(null);

  const handleGetListDepartment = () =>
    departmentService
      .getList(departmentParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data, isLoading, mutate } = useSWR<ResultResponse<Department[]>>(
    [departmentParams],
    handleGetListDepartment
  );

  const columns: DataTableProps<Department>['columns'] = useMemo(
    () => [
      {
        accessor: 'code',
        title: 'Mã bộ môn',
        render: (department: Department) => <span>{department.code}</span>,
        sorting: true,
        filter: (
          <SearchFilter
            label="Tìm kiếm'"
            placeholder="vd: Mã bộ môn, tên bộ môn..."
            setParams={(value) => {
              setDepartmentParams({
                ...departmentParams,
                q: value,
              });
            }}
            searchTermValue={departmentParams.q}
          />
        ),
        filtering: !!departmentParams.q,
      },
      {
        accessor: 'name',
        title: 'Tên bộ môn',
        render: (department: Department) => <span>{department.name}</span>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        filter: (
          <StatusFilter
            value={departmentParams.status}
            onChange={(value) =>
              setDepartmentParams({ ...departmentParams, status: value as StatusEnum })
            }
          />
        ),
        render: (department: Department) => <StatusBadge status={department.status} />,
        sorting: true,
        filtering: !!departmentParams.status,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (department: Department) => (
          <Text fz="sm">{formatDateString(department?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (department: Department) => (
          <DepartmentActionMenu department={department} onOpen={onOpen} setSelected={setSelected} />
        ),
      },
    ],
    [authUser?.id, onOpen, setDepartmentParams, departmentParams.q, departmentParams.status]
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await departmentService.deleteDepartment(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, departmentService]);

  return (
    <DepartmentPageStyled>
      <DeleteModal entityName="bộ môn" onDelete={handleDelete} isOpen={isOpen} onClose={onClose} />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Bộ môn - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Bộ môn', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={departmentRoute.create}
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
              onPageChange={(page: number) =>
                setDepartmentParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setDepartmentParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </DepartmentPageStyled>
  );
};

const DepartmentPageStyled = styled.div``;

export default DepartmentPage;
