import { Button, Container, Paper, Stack, Text, Tooltip } from '@mantine/core';
import styled from '@emotion/styled';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { CommonDataTable, DeleteModal, PageHeader } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { graduationRoute, dashboardRoute } from '@/routes';
import { GraduationListParams, useGraduationService } from '@/services/graduationService';
import { Graduation, ResultResonse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import GraduationActionMenu from './components/Cells/GraduationActionMenu';

const GraduationPage = () => {
  const graduationService = useGraduationService();
  const [graduationParams, setGraduationParams] = useState<GraduationListParams>({
    ...defaultPramsList,
  });

  const { push } = useRouter();
  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<Graduation | null>(null);

  const handleGetListGraduation = () =>
    graduationService
      .getList(graduationParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data, isLoading, mutate } = useSWR<ResultResonse<Graduation[]>>(
    [graduationParams],
    handleGetListGraduation
  );

  const columns: DataTableProps<Graduation>['columns'] = useMemo(
    () => [
      {
        accessor: 'name',
        title: 'Đợt tốt nghiệp',
        render: (generalGraduation: Graduation) => (
          <Tooltip
            multiline
            w={500}
            withArrow
            position="bottom"
            transitionProps={{ duration: 200 }}
            label={generalGraduation.name}
          >
            <Text
              style={{
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '800px',
              }}
              fw={500}
              c="blue"
              onClick={() => push(graduationRoute.show(generalGraduation.id))}
            >
              {generalGraduation.name}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessor: 'school_year',
        title: 'Năm học',
        render: (generalGraduation: Graduation) => (
          <Text>{`${generalGraduation.school_year?.start_year}-${generalGraduation.school_year?.end_year}`}</Text>
        ),
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'student_count',
        title: 'Tổng số sinh viên',
        render: (generalGraduation: Graduation) => <Text>{generalGraduation?.student_count}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (generalGraduation: Graduation) => (
          <Text fz="sm">{formatDateString(generalGraduation?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (generalGraduation: Graduation) => (
          <GraduationActionMenu
            generalGraduation={generalGraduation}
            onOpen={onOpen}
            setSelected={setSelected}
          />
        ),
      },
    ],
    [authUser?.id, onOpen, setGraduationParams, graduationParams.q]
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await graduationService.deleteGraduation(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, graduationService]);

  return (
    <GraduationPageStyled>
      <DeleteModal
        entityName="đợt tốt nghiệp"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Đợt tốt nghiệp - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Đợt tốt nghiệp', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={graduationRoute.create}
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
                setGraduationParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setGraduationParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </GraduationPageStyled>
  );
};

const GraduationPageStyled = styled.div``;

export default GraduationPage;
