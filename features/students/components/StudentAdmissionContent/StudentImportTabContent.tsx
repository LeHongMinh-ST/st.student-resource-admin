import { Button, Text } from '@mantine/core';
import { Dropzone, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';
import { FC, useState, useRef, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconAlertTriangle,
  IconCheck,
  IconCloudUpload,
  IconFileSpreadsheet,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import styled from '@emotion/styled';
import { AdmissionYear } from '@/types';
import { useStudentService } from '@/services/studentService';
import ListExcelFileImport from './StudentImportTabComponent/ListExcelFileImport';

type StudentImportTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentImportTabContent: FC<StudentImportTabContentProps> = ({ admissionYear }) => {
  const openRef = useRef<() => void>(() => {});
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const studentService = useStudentService();

  const clearFileValue = useCallback(() => {
    setFileValue(null);
    setIsReloadList((prev) => !prev);
  }, []);

  const handleUploadFile = useCallback(async () => {
    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', fileValue!);
      formData.append('admission_year_id', (admissionYear?.id ?? '').toString());

      await studentService.importStudent(formData);
      notifications.show({
        title: 'Thành công!',
        message: 'Tải tệp thành công! Tệp của bạn đang được xử lý',
        icon: <IconCheck />,
        color: 'green.8',
        autoClose: 5000,
      });
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
  }, [fileValue, admissionYear]);

  const openModalConfirmImport = useCallback(() => {
    modals.openConfirmModal({
      title: <Text size="lg">Nhập dữ liệu sinh viên ?</Text>,
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn nhập dữ liệu sinh viên từ tệp
          <span className="file-name">{fileValue?.name}</span>?{' '}
        </Text>
      ),
      labels: { confirm: 'Tải lên', cancel: 'Đóng' },
      onConfirm: () => handleUploadFile(),
    });
  }, [fileValue]);

  return (
    <StudentImportTabContentStyled>
      <div className="header-import">
        <Dropzone
          openRef={openRef}
          multiple={false}
          onDrop={(files) => setFileValue(files[0])}
          className="drop-zone"
          activateOnClick={false}
          h={200}
          bg="#F7F8F9"
          radius={8}
          styles={{ inner: { pointerEvents: 'all' } }}
          accept={MS_EXCEL_MIME_TYPE}
          loading={isImporting}
        >
          <div className="drop-zone-inner">
            <div className="drop-zone-title">
              <IconFileSpreadsheet size={46} />
              <div className="drop-zone-text">
                <div className="drop-zone-text-main">Kéo tệp vào đây hoặc nhấp để chọn tệp</div>
              </div>
            </div>
            <Button
              mih={32}
              h={32}
              variant="outline"
              onClick={() => openRef.current()}
              className="upload-file-button"
              leftSection={<IconCloudUpload size={18} />}
            >
              <Text truncate="end">Chọn tập tin</Text>
            </Button>
            {fileValue && (
              <div className="drop-zone-file">
                <Text>{fileValue.name}</Text>
                <IconX style={{ cursor: 'pointer' }} onClick={() => setFileValue(null)} />
              </div>
            )}
          </div>
        </Dropzone>
        {fileValue && (
          <Button
            onClick={openModalConfirmImport}
            leftSection={<IconUpload />}
            className="import-button"
          >
            Tải lên
          </Button>
        )}
      </div>
      <div className="list-import">
        <ListExcelFileImport admissionYear={admissionYear} isReloadList={isReloadList} />
      </div>
    </StudentImportTabContentStyled>
  );
};

const StudentImportTabContentStyled = styled.div`
  .header-import {
    margin-top: 20px;
    text-align: center;

    .drop-zone {
      display: flex;
      height: 200px;
      border-radius: 8px;
      border: 0.12px dashed #e8eaed;
      background-color: #f7f8f9;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 16px 8px;
      &-file {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      &-title {
        font-size: 18px;
        font-weight: 500;
        color: #666666;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      &-inner {
        display: flex;
        justify-content: center;
        gap: 16px;
        align-items: center;
        flex-direction: column;
      }
    }
  }
`;

export default StudentImportTabContent;
