import { FC, lazy, Suspense, useState } from 'react';
import { rem, Text, Tabs, LoadingOverlay } from '@mantine/core';
import { IconDatabaseImport, IconUserSearch } from '@tabler/icons-react';
import { Graduation } from '@/types';

const StudentListTabContent = lazy(
  () => import('@/features/graduations/components/StudentGraduationContent/StudentListTabContent')
);
const StudentImportTabContent = lazy(
  () => import('@/features/graduations/components/StudentGraduationContent/StudentImportTabContent')
);

type StudentGraduationProps = {
  graduation?: Graduation;
};

type StudentAdminTab = 'list' | 'import';

const StudentGraduation: FC<StudentGraduationProps> = ({ graduation }) => {
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
          {activeTab === 'list' && <StudentListTabContent graduation={graduation} />}
        </Tabs.Panel>
        <Tabs.Panel value="import">
          {activeTab === 'import' && <StudentImportTabContent graduation={graduation} />}
        </Tabs.Panel>
      </Suspense>
    </Tabs>
  );
};

export default StudentGraduation;