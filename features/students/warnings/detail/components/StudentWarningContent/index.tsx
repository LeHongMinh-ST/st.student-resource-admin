import { FC, lazy, Suspense, useState } from 'react';
import { rem, Text, Tabs, LoadingOverlay } from '@mantine/core';
import { IconDatabaseImport, IconUserSearch } from '@tabler/icons-react';
import { Warning } from '@/types';

const StudentListTabContent = lazy(
  () =>
    import(
      '@/features/students/warnings/detail/components/StudentWarningContent/StudentListTabContent'
    )
);
const StudentImportTabContent = lazy(
  () =>
    import(
      '@/features/students/warnings/detail/components/StudentWarningContent/StudentImportTabContent'
    )
);

type StudentWarningProps = {
  warning?: Warning;
};

type StudentAdminTab = 'list' | 'import';

const StudentWarning: FC<StudentWarningProps> = ({ warning }) => {
  const [activeTab, setActiveTab] = useState<StudentAdminTab | null>('list');
  const iconStyle = { width: rem(24), height: rem(24) };

  return (
    <Tabs value={activeTab} onChange={(value) => setActiveTab(value as StudentAdminTab)}>
      <Tabs.List>
        <Tabs.Tab value="list" leftSection={<IconUserSearch style={iconStyle} />}>
          <Text fw={500} size="xl">
            Danh sách sinh viên
          </Text>
        </Tabs.Tab>
        <Tabs.Tab value="import" leftSection={<IconDatabaseImport style={iconStyle} />}>
          <Text fw={500} size="lg">
            Import sinh viên
          </Text>
        </Tabs.Tab>
      </Tabs.List>

      <Suspense fallback={<LoadingOverlay visible />}>
        <Tabs.Panel value="list">
          {activeTab === 'list' && <StudentListTabContent warning={warning} />}
        </Tabs.Panel>
        <Tabs.Panel value="import">
          {activeTab === 'import' && <StudentImportTabContent warning={warning} />}
        </Tabs.Panel>
      </Suspense>
    </Tabs>
  );
};

export default StudentWarning;
