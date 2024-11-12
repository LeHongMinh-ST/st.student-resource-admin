import { Modal, Stack, SimpleGrid, Button, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import HttpStatus from '@/enums/http-status.enum';

type ComfirmModalProps = {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onComfirm: () => Promise<any>;
};

export default function ComfirmModal({
  entityName,
  isOpen,
  onClose,
  onComfirm,
}: ComfirmModalProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      if (!fetching) {
        setFetching(true);
        await onComfirm();
        notifications.show({
          title: 'Thành công!',
          message: 'Gửi bản ghi thành công!',
          icon: <IconCheck />,
          color: 'green.8',
          autoClose: 5000,
        });
      }
    } catch (e: any) {
      if (e?.status === HttpStatus.HTTP_FORBIDDEN) {
        notifications.show({
          title: 'Thất bại!',
          message: 'Bạn không có quyền thực hiện chức năng này!',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      } else {
        notifications.show({
          title: 'Thất bại!',
          message: e?.response?.data?.message || 'Có lỗi xảy ra! vui lòng thử lại sau.',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
    setFetching(false);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={`Gửi ${entityName}`} centered>
      <Stack>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconInfoCircle color="blue" size={32} />
          <div>
            <Text fw={600}>
              Bạn có chăc chắn muốn gửi phiếu khảo sát đến những sinh viên đã tốt nghiệp có trong
              đợt khảo sát này?
            </Text>
            <Text fw={300} size="sm">
              Phiếu khảo sát sẽ được gửi qua phương tiện email!
            </Text>
          </div>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Button loading={fetching} onClick={onSubmit} variant="filled" color="blue">
            Gửi phiếu khảo sát
          </Button>
          <Button disabled={fetching} onClick={onClose} variant="outline">
            Đóng
          </Button>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
