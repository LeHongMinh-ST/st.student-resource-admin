import { Modal, Stack, SimpleGrid, Button, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

type DeleteModalProps = {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<any>;
};

export default function DeleteModal({ entityName, isOpen, onClose, onDelete }: DeleteModalProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      if (!fetching) {
        setFetching(true);
        await onDelete();
        notifications.show({
          title: 'Thành công!',
          message: 'Xóa bản ghi thành công!',
          icon: <IconCheck />,
          color: 'green.8',
          autoClose: 5000,
        });
      }
    } catch (e) {
      notifications.show({
        title: 'Thất bại!',
        message: 'Có lỗi xảy ra! vui lòng thử lại sau.',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
    setFetching(false);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={`Xóa ${entityName}`} centered>
      <Stack>
        <Text fw={600}>Bạn có chăc chắn muốn xóa {entityName}?</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Button loading={fetching} onClick={onSubmit} variant="filled">
            Xóa
          </Button>
          <Button disabled={fetching} onClick={onClose} variant="outline">
            Đóng
          </Button>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
