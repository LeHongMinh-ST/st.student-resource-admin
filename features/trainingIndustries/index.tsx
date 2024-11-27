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
import { dashboardRoute, trainingIndustryRoute } from '@/routes';
import { ResultResponse, TrainingIndustry } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import {
  TrainingIndustryListParams,
  useTrainingIndustryService,
} from '@/services/trainingIndustryService';
import TrainingIndustryActionMenu from '@/features/trainingIndustries/components/Cells/TrainingIndustryActionMenu';
import StatusFilter from '@/features/trainingIndustries/components/Filters/StatusFilter';

const TrainingIndustryPage = () => {
  const trainingIndustryService = useTrainingIndustryService();
  const [trainingIndustryParams, setTrainingIndustryParams] = useState<TrainingIndustryListParams>({
    ...defaultPramsList,
  });

  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<TrainingIndustry | null>(null);

  const handleGetListTrainingIndustry = () =>
    trainingIndustryService
      .getList(trainingIndustryParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data, isLoading, mutate } = useSWR<ResultResponse<TrainingIndustry[]>>(
    [trainingIndustryParams],
    handleGetListTrainingIndustry
  );

  const columns: DataTableProps<TrainingIndustry>['columns'] = useMemo(
    () => [
      {
        accessor: 'code',
        title: 'Mã ngành đào tạo',
        render: (trainingIndustry: TrainingIndustry) => <span>{trainingIndustry.code}</span>,
        sorting: true,
        filter: (
          <SearchFilter
            label="Tìm kiếm'"
            placeholder="vd: Mã ngành đào tạo, tên ngành đào tạo..."
            setParams={(value) => {
              setTrainingIndustryParams({
                ...trainingIndustryParams,
                q: value,
              });
            }}
            searchTermValue={trainingIndustryParams.q}
          />
        ),
        filtering: !!trainingIndustryParams.q,
      },
      {
        accessor: 'name',
        title: 'Tên ngành đào tạo',
        render: (trainingIndustry: TrainingIndustry) => <span>{trainingIndustry.name}</span>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'status',
        title: 'Trạng thái',
        filter: (
          <StatusFilter
            value={trainingIndustryParams.status}
            onChange={(value) =>
              setTrainingIndustryParams({ ...trainingIndustryParams, status: value as StatusEnum })
            }
          />
        ),
        render: (trainingIndustry: TrainingIndustry) => (
          <StatusBadge status={trainingIndustry.status} />
        ),
        sorting: true,
        filtering: !!trainingIndustryParams.status,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (trainingIndustry: TrainingIndustry) => (
          <Text fz="sm">{formatDateString(trainingIndustry?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (trainingIndustry: TrainingIndustry) => (
          <TrainingIndustryActionMenu
            trainingIndustry={trainingIndustry}
            onOpen={onOpen}
            setSelected={setSelected}
          />
        ),
      },
    ],
    [
      authUser?.id,
      onOpen,
      setTrainingIndustryParams,
      trainingIndustryParams.q,
      trainingIndustryParams.status,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await trainingIndustryService.deleteTrainingIndustry(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, trainingIndustryService]);

  return (
    <TrainingIndustryPageStyled>
      <DeleteModal
        entityName="ngành đào tạo"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Ngành đào tạo - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Ngành đào tạo', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={trainingIndustryRoute.create}
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
                setTrainingIndustryParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setTrainingIndustryParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </TrainingIndustryPageStyled>
  );
};

const TrainingIndustryPageStyled = styled.div``;

export default TrainingIndustryPage;
