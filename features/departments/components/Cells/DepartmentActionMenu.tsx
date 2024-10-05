import { Button, Menu } from '@mantine/core';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { departmentRoute } from '@/routes';
import { Department } from '@/types';
import { useAuthStore } from '@/utils/recoil/auth/authState';

interface DepartmentActionMenuProps {
  department: Department;
  onOpen: () => void;
  setSelected: (department: Department) => void;
}

const DepartmentActionMenu: React.FC<DepartmentActionMenuProps> = ({
  department,
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
          leftSection={<IconEdit size={16} />}
          href={departmentRoute.update(department?.id)}
        >
          Chỉnh sửa
        </Menu.Item>
        {department?.id !== authUser?.id && (
          <Menu.Item
            fw={600}
            fz="sm"
            color="red"
            variant="filled"
            leftSection={<IconTrash size={16} />}
            onClick={() => {
              setSelected(department);
              onOpen();
            }}
          >
            Xóa
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DepartmentActionMenu;
