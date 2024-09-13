'use client';

import styled from '@emotion/styled';
import { Button, Container, Text, Stack, Paper, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { IconEdit, IconDotsVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import { dashboardRoute, userRoute } from '@/routes';
import { UserListParams, useUserService } from '@/services/userService';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { MetaResponse, User } from '@/types';
import { PageHeader, CommonDataTable, DeleteModal } from '@/components';
import { defaultPage, defaultPramsList } from '@/constants/commons';
import { RoleBadge } from '@/components/RoleBadge';
import { formatDateString } from '@/utils/func/formatDateString';
import UserNameCellTable from './components/cell/UserNameCellTable';
import SearchFilter from './components/filters/SearchFilter';
import { RoleEnum } from '@/enums';
import RoleFilter from './components/filters/RoleFilter';

const UserPage = () => {
  const userService = useUserService();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<MetaResponse>(defaultPage);
  const [userParams, setUserParams] = useState<UserListParams>({ ...defaultPramsList });
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<User>();
  const { authUser } = useAuthStore();

  useEffect(() => {
    handleGetListUser().then();
  }, []);

  const handleDelete = async () => {
    if (selected) {
      await userService.deleteUser(selected?.id ?? '');
      handleGetListUser();
    }
  };

  const handleGetListUser = async () => {
    const res = await userService.getList(userParams);
    setUsers(res.data.data);
    setMeta(res.data?.meta ?? defaultPage);
  };

  useEffect(() => {
    handleGetListUser();
  }, [userParams]);

  const columns: DataTableProps<User>['columns'] = [
    {
      accessor: 'firstname',
      title: 'Tài khoản',
      render: (user: User) => <UserNameCellTable user={user} />,
      filter: (
        <SearchFilter<UserListParams> setParams={setUserParams} searchTermValue={userParams.q} />
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
        <Menu withArrow width={150} shadow="md">
          <Menu.Target>
            <div style={{ cursor: 'pointer', display: 'flex' }}>
              <Button variant="filled" size="xs">
                <IconDotsVertical color="white" size={16} />
              </Button>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              fw={600}
              fz="sm"
              color="blue"
              variant="filled"
              component={Link}
              leftSection={<IconEdit size={16} />}
              href={userRoute.update(user?.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            {user?.id !== authUser?.id && (
              <Menu.Item
                fw={600}
                fz="sm"
                color="red"
                variant="filled"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  setSelected(() => user);
                  onOpen();
                }}
              >
                Xóa
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

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
              meta={meta}
              columns={columns}
              records={users}
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
