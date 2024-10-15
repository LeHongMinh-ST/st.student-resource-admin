'use client';

import styled from '@emotion/styled';
import { Button, Container, Text, Stack, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { IconPlus } from '@tabler/icons-react';
import useSWR from 'swr';
import { dashboardRoute, userRoute } from '@/routes';
import { UserListParams, useUserService } from '@/services/userService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { ResultResonse, User } from '@/types';
import { PageHeader, CommonDataTable, DeleteModal } from '@/components';
import { defaultPramsList } from '@/constants/commons';
import { RoleBadge } from '../../components/Badge/RoleBadge';
import { formatDateString } from '@/utils/func/formatDateString';
import UserNameCellTable from './components/Cells/UserNameCellTable';
import SearchFilter from './components/Filters/SearchFilter';
import { RoleEnum } from '@/enums';
import RoleFilter from './components/Filters/RoleFilter';
import UserActionMenu from './components/Cells/UserActionMenu';

const UserPage = () => {
  const userService = useUserService();
  const [userParams, setUserParams] = useState<UserListParams>({ ...defaultPramsList });
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<User | null>(null);
  const { authUser } = useAuthStore();
  const handleGetListUser = () =>
    userService
      .getList(userParams)
      .then((res) => res.data)
      .catch((error) => error);

  const { data, isLoading, mutate } = useSWR<ResultResonse<User[]>>(
    ['getList', userParams],
    handleGetListUser
  );

  const handleDelete = useCallback(async () => {
    if (selected) {
      await userService.deleteUser(selected?.id ?? '');
      await mutate();
      onClose();
    }
  }, [selected, userService]);

  const columns: DataTableProps<User>['columns'] = useMemo(
    () => [
      {
        accessor: 'firstname',
        title: 'Tài khoản',
        render: (user: User) => <UserNameCellTable user={user} />,
        filter: (
          <SearchFilter<UserListParams>
            setParams={(value) => {
              setUserParams({
                ...userParams,
                q: value,
              });
            }}
            searchTermValue={userParams.q}
          />
        ),
        filtering: !!userParams.q,
      },
      {
        accessor: 'role',
        title: 'Vai trò',
        render: (user: User) => <RoleBadge role={user?.role} />,
        filter: (
          <RoleFilter
            value={userParams.role}
            onChange={(value) => setUserParams({ ...userParams, role: value as RoleEnum })}
          />
        ),
        filtering: !!userParams.role,
      },
      {
        accessor: 'created_at',
        title: 'Ngày tạo',
        sortable: true,
        render: (user: User) => (
          <Text fz="sm">{formatDateString(user?.created_at, 'HH:MM dd/mm/yyyy')}</Text>
        ),
      },
      {
        accessor: 'id',
        title: 'Hành động',
        width: 100,
        render: (user: User) => (
          <UserActionMenu user={user} onOpen={onOpen} setSelected={setSelected} />
        ),
      },
    ],
    [authUser?.id, onOpen, setUserParams, userParams.q, userParams.role]
  );

  return (
    <UserPageStyled>
      <DeleteModal
        entityName="tài khoản"
        onDelete={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Tài khoản - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Tài khoản', href: null },
            ]}
            withActions={
              <Button component={Link} href={userRoute.create} leftSection={<IconPlus size={18} />}>
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
                setUserParams((params) => ({ ...params, current_page: page }))
              }
              onRecordsPerPageChange={(perPage: number) =>
                setUserParams((params) => ({ ...params, limit: perPage }))
              }
            />
          </Paper>
        </Stack>
      </Container>
    </UserPageStyled>
  );
};

const UserPageStyled = styled.div``;

export default UserPage;
