import { Button, Menu } from '@mantine/core';
import {
  IconEdit,
  IconDotsVertical,
  IconTrash,
  IconMail,
  IconCopy,
  IconCheck,
  IconAlertTriangle,
  IconEye,
} from '@tabler/icons-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import { surveyPeriodRoute } from '@/routes';
import { SurveyPeriod } from '@/types';
import Status from '@/enums/status.enum';

interface SurveyPeriodActionMenuProps {
  surveyPeriod: SurveyPeriod;
  onOpen: () => void;
  setSelected: (surveyPeriod: SurveyPeriod) => void;
  onOpenPopupComfirm: () => void;
  onCopySurveyLink: (surveyPeriod: SurveyPeriod) => void;
}

const SurveyPeriodActionMenu: React.FC<SurveyPeriodActionMenuProps> = ({
  surveyPeriod,
  onOpen,
  setSelected,
  onOpenPopupComfirm,
  onCopySurveyLink,
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
      {surveyPeriod?.status !== Status.Disable &&
        dayjs().isBefore(dayjs(surveyPeriod?.end_date)) && (
          <Menu.Item
            fw={600}
            fz="sm"
            color="blue"
            variant="filled"
            leftSection={<IconCopy size={16} />}
            onClick={() => {
              try {
                onCopySurveyLink(surveyPeriod);
                notifications.show({
                  title: 'Thành công!',
                  message: 'Cập nhật đợt khảo sát việc làm thành công',
                  icon: <IconCheck />,
                  color: 'green.8',
                  autoClose: 3000,
                });
              } catch (error) {
                notifications.show({
                  title: 'Thất bại!',
                  message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
                  icon: <IconAlertTriangle />,
                  color: 'red',
                  autoClose: 5000,
                });
              }
            }}
          >
            Sao chép đường dẫn phiếu khảo sát
          </Menu.Item>
        )}
      <Menu.Item
        fw={600}
        fz="sm"
        color="blue"
        variant="filled"
        component={Link}
        leftSection={<IconEye size={16} />}
        href={surveyPeriodRoute.show(surveyPeriod?.id)}
      >
        Xem thông tin sinh viên
      </Menu.Item>
      {surveyPeriod?.status !== Status.Disable &&
        dayjs().isBefore(dayjs(surveyPeriod?.end_date)) && (
          <Menu.Item
            fw={600}
            fz="sm"
            color="blue"
            variant="filled"
            leftSection={<IconMail size={16} />}
            onClick={() => {
              setSelected(surveyPeriod);
              onOpenPopupComfirm();
            }}
          >
            Gửi biểu mẫu khảo sát qua mail
          </Menu.Item>
        )}
      {surveyPeriod?.status !== Status.Disable && (
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
      )}
      {(dayjs().isBefore(dayjs(surveyPeriod?.start_date)) ||
        true ||
        surveyPeriod.status === Status.Disable) && (
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
      )}
    </Menu.Dropdown>
  </Menu>
);

export default SurveyPeriodActionMenu;
