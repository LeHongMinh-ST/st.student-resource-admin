import { DataTableProps } from 'mantine-datatable';
import styled from '@emotion/styled';
import { useCallback, useMemo, useState } from 'react';
import { Text, Container, Stack, Button, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import useSWR from 'swr';
import { defaultPramsList } from '@/constants/commons';
import { MajorListParams, useMajorService } from '@/services/majorService';
import { Department, Major, ResultResonse } from '@/types';
import { CommonDataTable, DeleteModal, PageHeader, StatusBadge } from '@/components';
import { dashboardRoute, majorRoute } from '@/routes';
import { formatDateString } from '@/utils/func/formatDateString';
import DepartmentActionMenu from '../departments/components/Cells/DepartmentActionMenu';

const MajorPage = () => {
  const majorService = useMajorService();
  const [majorParmas, setMajorParams] = useState<MajorListParams>({
    ...defaultPramsList,
  });

  const [selected, setSelected] = useState<Major | null>(null);
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const handleGetListMajor = () =>
    majorService
      .getList()
      .then((res) => res.data)
      .catch((err) => err);

  const { data, isLoading, mutate } = useSWR<ResultResonse<Major[]>>(
    [majorParmas],
    handleGetListMajor
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await mutate();
      await majorService.deleteMajor(selected?.id ?? '');
      onClose();
    }
  }, [selected, majorService]);

  const columns: DataTableProps<Major>['columns'] = useMemo(
    () => [
      {
        accessor: 'code',
        title: 'Mã bộ môn',
        render: (major: Major) => <span>{major.code}</span>,
        sorting: true,
      },
      {
        accessor: 'name',
        title: 'Tên bộ môn',
        render: (major: Major) => <span>{major.name}</span>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        render: (major: Major) => <StatusBadge status={major.status} />,
        sorting: true,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (major: Major) => (
          <Text fz="sm">{formatDateString(major?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
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
    [onOpen, setMajorParams, majorParmas.q, majorParmas.status]
  );
  return (
    <MajorPageStyled>
      <DeleteModal
        entityName="chuyen nganh"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="chuyen nganh - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Chuyên nganh', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={majorRoute.create}
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
                setMajorParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setMajorParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </MajorPageStyled>
  );
};

const MajorPageStyled = styled.div``;

export default MajorPage;
