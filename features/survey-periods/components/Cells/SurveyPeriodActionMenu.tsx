import { Button, Menu } from '@mantine/core';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { surveyPeriodRoute } from '@/routes';
import { SurveyPeriod } from '@/types';

interface SurveyPeriodActionMenuProps {
  surveyPeriod: SurveyPeriod;
  onOpen: () => void;
  setSelected: (surveyPeriod: SurveyPeriod) => void;
}

const SurveyPeriodActionMenu: React.FC<SurveyPeriodActionMenuProps> = ({
  surveyPeriod,
  onOpen,
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
        leftSection={<IconEdit size={16} />}
        href={surveyPeriodRoute.update(surveyPeriod?.id)}
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
          setSelected(surveyPeriod);
          onOpen();
        }}
      >
        Xóa
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default SurveyPeriodActionMenu;
