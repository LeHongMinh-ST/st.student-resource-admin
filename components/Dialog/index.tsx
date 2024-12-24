import { Dialog, Text } from '@mantine/core';
import { StatusFileImportBadge } from '@/components';
import { useSetZipExportFileProps } from '@/utils/recoil/fileExport/FileExportState';
import { ZipExportFile } from '@/types';

type DialogProps = {
  zipFileDownload?: ZipExportFile;
  handlerAction: (id: string | number) => void;
};

export default function DialogDownload({ zipFileDownload, handlerAction }: DialogProps) {
  const setZipExportFile = useSetZipExportFileProps();

  if (zipFileDownload && zipFileDownload?.status === 'completed' && zipFileDownload?.id) {
    handlerAction(zipFileDownload?.id);
  }

  return (
    <>
      <Dialog
        opened={!!zipFileDownload}
        withCloseButton
        onClose={() => {
          setZipExportFile(null);
        }}
        size="lg"
        radius="md"
      >
        <Text
          size="sm"
          mb="xs"
          fw={700}
          style={{
            borderBottom: '1px solid #e1e1e1',
          }}
        >
          Đang thực hiện
        </Text>

        <div
          style={{
            paddingTop: '20px',
          }}
        >
          {zipFileDownload && (
            <>
              <Text size="sm" mb="xs" fw={500} style={{}}>
                {'Tải kết quả: '.concat(zipFileDownload?.survey_period?.title ?? '')}
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
    </>
  );
}
