import { FC, useState, useCallback } from 'react';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Graduation } from '@/types';
import ListExcelFileImport from './StudentImportTabComponent/ListExcelFileImport';
import StudentDropzoneImport from './StudentImportTabComponent/StudentDropzoneImport';
import { useStudentService } from '@/services/studentService';
import { useExcelImportFileService } from '@/services/ExcelImportFileService';
import { ExcelFileImportType } from '@/enums';

type StudentImportTabContentProps = {
  graduation?: Graduation;
};

const StudentImportTabContent: FC<StudentImportTabContentProps> = ({ graduation }) => {
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const studentService = useStudentService();
  const { importFile } = useExcelImportFileService();

  const clearFileValue = useCallback(() => {
    setFileValue(null);
  }, []);

  const handleUploadFile = useCallback(async () => {
    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', fileValue!);
      formData.append('type', ExcelFileImportType.Graduate);
      formData.append('entity_id', (graduation?.id ?? '').toString());

      await importFile(formData);

      notifications.show({
        title: 'Thành công!',
        message: 'Tải tệp thành công! Tệp của bạn đang được xử lý',
        icon: <IconCheck />,
        color: 'green.8',
        autoClose: 5000,
      });
      setIsReloadList((prev) => !prev);
      clearFileValue();
    } catch (e) {
      notifications.show({
        title: 'Thất bại!',
        message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
    setIsImporting(false);
  }, [fileValue, graduation, studentService, clearFileValue]);

  return (
    <div>
      <StudentDropzoneImport
        fileValue={fileValue}
        isImporting={isImporting}
        onFileUpload={setFileValue}
        onUpload={handleUploadFile}
      />
      <div className="list-import">
        <ListExcelFileImport graduation={graduation} isReloadList={isReloadList} />
      </div>
    </div>
  );
};

export default StudentImportTabContent;
