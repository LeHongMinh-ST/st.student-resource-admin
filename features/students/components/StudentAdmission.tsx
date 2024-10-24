import { FC, lazy, Suspense, useState } from 'react';
import { rem, Text, Tabs, LoadingOverlay } from '@mantine/core';
import { IconDatabaseImport, IconUserSearch } from '@tabler/icons-react';
import { useAdmissionYearProps } from '@/utils/recoil/student/AdmissionYearState';

const StudentListTabContent = lazy(() => import('./StudentAdmissionContent/StudentListTabContent'));
const StudentImportTabContent = lazy(
  () => import('./StudentAdmissionContent/StudentImportTabContent')
);

type StudentAdmissionProps = {};

type StudentAdminTab = 'list' | 'import';

const StudentAdmission: FC<StudentAdmissionProps> = () => {
  const admissionYear = useAdmissionYearProps();
  const [activeTab, setActiveTab] = useState<StudentAdminTab | null>('list');
  const iconStyle = { width: rem(24), height: rem(24) };

  return (
    <Tabs value={activeTab} onChange={(value: StudentAdminTab) => setActiveTab(value)}>
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
          {activeTab === 'list' && <StudentListTabContent admissionYear={admissionYear} />}
        </Tabs.Panel>
        <Tabs.Panel value="import">
          {activeTab === 'import' && <StudentImportTabContent admissionYear={admissionYear} />}
        </Tabs.Panel>
      </Suspense>
    </Tabs>
  );
};

export default StudentAdmission;
