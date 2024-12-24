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
import { dashboardRoute, quitRoute } from '@/routes';
import { useQuitStudentService, QuitListParams } from '@/services/QuitStudentService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { defaultPramsList } from '@/constants/commons';
import { Quit, ResultResponse } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import QuitActionMenu from '@/features/students/quits/components/Cells/QuitActionMenu';

const StudentQuitPage = () => {
  const quitStudentService = useQuitStudentService();
  const [quitParams, setQuitParams] = useState<QuitListParams>({
    ...defaultPramsList,
  });
  const { push } = useRouter();
  const { authUser } = useAuthStore();
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<Quit | null>(null);

  const { data, isLoading, mutate } = useSWR<ResultResponse<Quit[]>>([quitParams], () =>
    quitStudentService.getListQuitStudent(quitParams).then((res) => res.data)
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await quitStudentService.deleteQuitStudent(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, quitStudentService]);

  const columns: DataTableProps<Quit>['columns'] = useMemo(
    () => [
      {
        accessor: 'name',
        title: 'Tiêu đề',
        render: (quit: Quit) => (
          <Tooltip
            multiline
            w={500}
            withArrow
            position="bottom"
            transitionProps={{ duration: 200 }}
            label={quit.name}
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
              onClick={() => push(quitRoute.show(quit.id))}
            >
              {quit.name}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessor: 'year',
        title: 'Năm tốt nghiệp',
        render: (quit: Quit) => <Text>{`${quit.year}`}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'student_count',
        title: 'Tổng số sinh viên',
        render: (quit: Quit) => <Text>{quit?.student_count}</Text>,
        sorting: true,
        filtering: true,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (quit: Quit) => (
          <Text fz="sm">{formatDateString(quit?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (quit: Quit) => (
          <QuitActionMenu quit={quit} onOpen={onOpen} setSelected={setSelected} />
        ),
      },
    ],
    [authUser?.id, onOpen, setQuitParams, quitParams.q]
  );

  return (
    <StudentQuitPageStyled>
      <DeleteModal
        entityName="đợt thôi học sinh viên"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Thôi học sinh viên - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Thôi học sinh viên', href: null },
            ]}
            withActions={
              <Button component={Link} href={quitRoute.create} leftSection={<IconPlus size={18} />}>
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
                setQuitParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setQuitParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </StudentQuitPageStyled>
  );
};

const StudentQuitPageStyled = styled.div``;

export default StudentQuitPage;
