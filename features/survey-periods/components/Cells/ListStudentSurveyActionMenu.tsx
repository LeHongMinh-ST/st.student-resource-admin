import { Button, Menu } from '@mantine/core';
import { IconDotsVertical, IconMail, IconEye } from '@tabler/icons-react';
import Link from 'next/link';
import { studentRoute } from '@/routes';
import { Student } from '@/types';

interface ListStudentServeyActionMenuProps {
  student: Student;
  onOpenResponse: () => void;
  setSelected: (student: Student) => void;
}

const ListStudentServeyActionMenu: React.FC<ListStudentServeyActionMenuProps> = ({
  student,
  onOpenResponse,
  setSelected,
}) => (
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
        href={studentRoute.show(student?.id)}
      >
        Xem chi tiết
      </Menu.Item>
      {student?.current_employment_response?.id ? (
        <Menu.Item
          fw={600}
          fz="sm"
          color="blue"
          variant="filled"
          leftSection={<IconMail size={16} />}
          onClick={() => {
            setSelected(student);
            onOpenResponse();
          }}
        >
          Xem phản hồi
        </Menu.Item>
      ) : null}
    </Menu.Dropdown>
  </Menu>
);

export default ListStudentServeyActionMenu;
