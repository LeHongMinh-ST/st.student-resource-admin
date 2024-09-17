import { Button, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { FC, useState, useRef } from 'react';
import { IconFileSpreadsheet, IconUpload } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { AdmissionYear } from '@/types';

type StudentImportTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentImportTabContent: FC<StudentImportTabContentProps> = ({ admissionYear }) => {
  console.log(admissionYear);
  const openRef = useRef<() => void>(() => {});
  const [fileValue, setFileValue] = useState<File | null>(null);
  return (
    <StudentImportTabContentStyled>
      <div className="header-import">
        <Dropzone
          openRef={openRef}
          multiple={false}
          onDrop={(files) => setFileValue(files[0])}
          className="drop-zone"
          activateOnClick={false}
          h={117}
          bg="#F7F8F9"
          radius={8}
          styles={{ inner: { pointerEvents: 'all' } }}
        >
          <div className="drop-zone-inner">
            <div className="drop-zone-title">
              <IconFileSpreadsheet size={24} />
              Kéo tệp vào đây hoặc nhấp để chọn tệp
            </div>
            <Button
              mih={32}
              h={32}
              onClick={() => openRef.current()}
              className="upload-file-button"
              leftSection={<IconUpload size={18} />}
            >
              <Text truncate="end">{fileValue ? fileValue.name : 'Chọn tệp tin'}</Text>
            </Button>
          </div>
        </Dropzone>
      </div>
      <div className="list-import"></div>
    </StudentImportTabContentStyled>
  );
};

const StudentImportTabContentStyled = styled.div`
  .header-import {
    margin-top: 20px;

    .drop-zone {
      display: flex;
      height: 200px;
      border-radius: 8px;
      border: 0.12px dashed #e8eaed;
      background-color: #f7f8f9;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 16px 8px 55px;
      &-title {
        font-size: 18px;
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
