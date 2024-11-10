import { Button, Menu } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
import { graduationRoute } from '@/routes';
import { Graduation } from '@/types';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';

interface GraduationActionMenuProps {
  generalGraduation: Graduation;
  onOpen: () => void;
  setSelected: (generalGraduation: Graduation) => void;
}

const GraduationActionMenu: React.FC<GraduationActionMenuProps> = ({
  generalGraduation,
  onOpen,
  setSelected,
}) => {
  const { authUser } = useAuthStore();
  return (
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
          leftSection={<IconEye size={16} />}
          href={graduationRoute.show(generalGraduation?.id)}
        >
          Xem chi tiết
        </Menu.Item>
        {authUser?.role === Role.Admin && (
          <>
            <Menu.Item
              fw={600}
              fz="sm"
              color="blue"
              variant="filled"
              component={Link}
              leftSection={<IconEdit size={16} />}
              href={graduationRoute.update(generalGraduation?.id)}
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
                setSelected(generalGraduation);
                onOpen();
              }}
            >
              Xóa
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default GraduationActionMenu;
