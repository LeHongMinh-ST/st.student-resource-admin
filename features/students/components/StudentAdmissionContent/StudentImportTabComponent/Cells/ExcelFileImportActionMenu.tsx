import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDownload, IconAlertTriangle } from '@tabler/icons-react';
import { ExcelFileImport } from '@/types';
import { useStudentService } from '@/services/studentService';

interface ExcelFileImportActionMenuProps {
  excelFileImport: ExcelFileImport;
}

const ExcelFileImportActionMenu: React.FC<ExcelFileImportActionMenuProps> = ({
  excelFileImport,
}) => {
  const { downloadImportErrorRecord } = useStudentService();

  const handleDownloadErrorRecord = async () => {
    try {
      const res = await downloadImportErrorRecord(excelFileImport.id);
      const url: string = window.URL.createObjectURL(new Blob([(res as any)?.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-import-error.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notifications.show({
        title: 'Lỗi!',
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <Group gap={4} justify="center" wrap="nowrap">
      <Tooltip label="Tải xuống danh sách lỗi">
        <ActionIcon size="sm" variant="subtle" onClick={handleDownloadErrorRecord}>
          <IconDownload size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default ExcelFileImportActionMenu;
