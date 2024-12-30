import { ActionIcon, Dialog, Text } from '@mantine/core';
import styled from '@emotion/styled';
import { IconMaximize, IconMinus, IconX } from '@tabler/icons-react';
import { useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { StatusFileImportBadge } from '@/components';
import {
  useIsShowProgres,
  useSetIsShowProgres,
  useSetZipExportFileProps,
} from '@/utils/recoil/fileExport/FileExportState';
import { ZipExportFile } from '@/types';
import DeleteModalDownload from '../Modals/DeleteModal/DeleteModalDownloadFile';

type DialogProps = {
  zipFileDownload?: ZipExportFile;
  handlerAction: (id: string | number) => void;
};

const DialogDownload = ({ zipFileDownload, handlerAction }: DialogProps) => {
  const setZipExportFile = useSetZipExportFileProps();
  const isShowProgress = useIsShowProgres();
  const setIsShowProgress = useSetIsShowProgres();

  if (zipFileDownload && zipFileDownload?.status === 'completed' && zipFileDownload?.id) {
    handlerAction(zipFileDownload?.id);
  }

  const handleDelete = useCallback(async () => {
    setZipExportFile(null);
    setIsShowProgress(false);
  }, []);

  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(isShowProgress ?? false);

  return (
    <>
      <DialogCustom>
        <DeleteModalDownload
          title="Huỷ quá trình lưu khảo sát"
          messageSuccess="Huỷ quá trình lưu khảo sát thành công!"
          content="Bạn có chắc chắn muốn huỷ quá trình lưu khảo sát này không?"
          btnTextSubmit="Huỷ"
          onDelete={handleDelete}
          isOpen={isOpen}
          onClose={onClose}
        />
        <Dialog
          withBorder
          opened={!!zipFileDownload}
          withCloseButton={false}
          onClose={() => {
            setZipExportFile(null);
          }}
          size="lg"
          radius="md"
          zIndex={150}
        >
          <div
            className="headerDialog"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e1e1e1',
            }}
          >
            <Text size="sm" fw={700}>
              Đang thực hiện
            </Text>
            <div>
              {isShowProgress ? (
                <ActionIcon
                  variant="default"
                  aria-label=" action icon"
                  mr={5}
                  onClick={() => {
                    setIsShowProgress(false);
                  }}
                >
                  <IconMinus
                    style={{
                      cursor: 'pointer',
                      margin: '0 2px',
                    }}
                  />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="default"
                  aria-label=" action icon"
                  mr={5}
                  onClick={() => {
                    setIsShowProgress(true);
                  }}
                >
                  <IconMaximize
                    style={{
                      cursor: 'pointer',
                      margin: '0 2px',
                    }}
                  />
                </ActionIcon>
              )}
              {isShowProgress && (
                <ActionIcon
                  variant="filled"
                  color="red"
                  aria-label=" action icon"
                  onClick={() => {
                    onOpen();
                  }}
                >
                  <IconX />
                </ActionIcon>
              )}
            </div>
          </div>

          <div
            hidden={!isShowProgress}
            style={{
              paddingTop: '20px',
            }}
          >
            {zipFileDownload && (
              <>
                <Text size="sm" mb="xs" fw={500} style={{}}>
                  {'Lưu kết quả: '.concat(zipFileDownload?.survey_period?.title ?? '')}
                </Text>
                <StatusFileImportBadge
                  status={zipFileDownload.status}
                  total_record={zipFileDownload?.file_total}
                  error_record={0}
                  handle_record={zipFileDownload?.process_total}
                />
              </>
            )}
          </div>
        </Dialog>
      </DialogCustom>
    </>
  );
};

const DialogCustom = styled.div`
  .headerDialog {
    display: flex;
    background-color: red;
    justify-content: space-between;
  }
`;

export default DialogDownload;
