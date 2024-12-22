import styled from '@emotion/styled';
import { Button, Container, Paper, Stack, Text, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { DataTableProps } from 'mantine-datatable';
import { CommonDataTable, DeleteModal, PageHeader } from '@/components';
import { dashboardRoute, warningRoute } from '@/routes';
import { useWarningStudentService } from '@/services/WarningStudentService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { defaultPramsList } from '@/constants/commons';
import { WarningListParams } from '@/services/StudentWarningService';
import { Warning, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import WarningActionMenu from '@/features/students/warnings/components/Cells/WarningActionMenu';

const StudentWarningPage = () => {
  const warningStudentService = useWarningStudentService();
  const [warningParams, setWarningParams] = useState<WarningListParams>({
    ...defaultPramsList,
  });
  const { push } = useRouter();
  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<Warning | null>(null);

  const { data, isLoading, mutate } = useSWR<ResultResponse<Warning[]>>([warningParams], () =>
    warningStudentService.getListWarningStudent(warningParams).then((res) => res.data)
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await warningStudentService.deleteWarningStudent(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, warningStudentService]);

  const columns: DataTableProps<Warning>['columns'] = useMemo(
    () => [
      {
        accessor: 'name',
        title: 'Đợt cảnh báo',
        render: (warning: Warning) => (
          <Tooltip
            multiline
            w={500}
            withArrow
            position="bottom"
            transitionProps={{ duration: 200 }}
            label={warning.name}
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
              onClick={() => push(warningRoute.show(warning.id))}
            >
              {warning.name}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessor: 'year',
        title: 'Kỳ',
        render: (warning: Warning) => <Text>{`${warning?.semester?.semester}`}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'year',
        title: 'Năm học',
        render: (warning: Warning) => <Text>{`${warning?.school_year}`}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'student_count',
        title: 'Tổng số sinh viên',
        render: (warning: Warning) => <Text>{warning?.student_count}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (warning: Warning) => (
          <Text fz="sm">{formatDateString(warning?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (warning: Warning) => (
          <WarningActionMenu warning={warning} onOpen={onOpen} setSelected={setSelected} />
        ),
      },
    ],
    [authUser?.id, onOpen, setWarningParams, warningParams.q]
  );

  return (
    <StudentWarningPageStyled>
      <DeleteModal
        entityName="đợt cảnh báo sinh viên"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Cảnh báo sinh viên - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Cảnh báo sinh viên', href: null },
            ]}
            withActions={
              <Button
                component={Link}
                href={warningRoute.create}
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
                setWarningParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setWarningParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </StudentWarningPageStyled>
  );
};

const StudentWarningPageStyled = styled.div``;

export default StudentWarningPage;
