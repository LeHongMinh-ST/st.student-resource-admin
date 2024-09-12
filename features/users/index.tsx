'use client';

import styled from '@emotion/styled';
import {
  Avatar,
  Button,
  Container,
  Text,
  Stack,
  TextInput,
  useMantineTheme,
  Paper,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTableProps } from 'mantine-datatable';
import { IconEdit, IconDotsVertical, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { dashboardRoute, userRoute } from '@/routes';
import { UserListParams, useUserService } from '@/services/userService';
import { MetaResponse, User } from '@/types';
import { PageHeader, CommonDataTable } from '@/components';
import { defaultPage, defaultPramsList } from '@/constants/commons';
import { RoleBadge } from '@/components/RoleBadge';
import { formatDateString } from '@/utils/func/formatDateString';
import DeleteModal from '@/components/Modals/DeleteModal/DeleteModal';

const UserPage = () => {
  const userService = useUserService();
  const theme = useMantineTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<MetaResponse>(defaultPage);
  const [userParams, setUserParams] = useState<UserListParams>({ ...defaultPramsList });
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [selected, setSelected] = useState<User>();

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
      render: (user: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar
            variant="filled"
            radius="xl"
            size="md"
            src={user.thumbnail}
            alt={`${user.last_name} ${user.first_name}`}
            color={theme.primaryColor}
          ></Avatar>
          <Stack gap={0}>
            <Text fz="sm" fw={600}>
              {user.first_name} {user.last_name}
            </Text>
            <Text fz="xs">{user.email}</Text>
          </Stack>
        </div>
      ),
      sortable: true,
      filter: (
        <TextInput
          label="Tìm kiếm"
          description="Hiển thị tài khoản với tên hoặc email"
          placeholder="tìm kiếm tài khoản..."
          leftSection={<IconSearch size={16} />}
          value={userParams.q}
          onChange={(e) => {
            setUserParams({ ...userParams, q: e.target.value });
          }}
        />
      ),
    },
    {
      accessor: 'Role',
      title: 'Vai trò',
      render: (user: User) => <RoleBadge role={user?.role} />,
    },
    {
      accessor: 'created_at',
      title: 'Ngày tạo',
      sortable: true,
      render: (user: User) => (
        <Text fz="sm">{formatDateString(user?.created_at, 'HH:MM dd/MM/yyyy')}</Text>
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
            title="Danh sách - Tài khoản"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Tài khoản', href: userRoute.list },
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
