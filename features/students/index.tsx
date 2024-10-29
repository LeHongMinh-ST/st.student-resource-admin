import { useCallback, useEffect, useState } from 'react';
import { Container, Stack, Paper, Group } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { dashboardRoute } from '@/routes';
import { PageHeader } from '@/components';
import { useStudentService } from '@/services/studentService';
import { AdmissionYear } from '@/types';
import AdmissionYearItem from './components/AdmissionYearItem';
import AdmissionYearList from './components/AdmissionYearList';
import StudentAdmission from './components/StudentAdmission';
import {
  useAdmissionYearProps,
  useSetAdmissionYearProps,
} from '@/utils/recoil/student/AdmissionYearState';

const StudentPage = () => {
  const { getListAdmission } = useStudentService();
  const admissionYearSelected = useAdmissionYearProps();
  const setAdmissionYearSelected = useSetAdmissionYearProps();
  const [admissionYears, setAdmissionYears] = useState<AdmissionYear[]>([]);
  const [admissionYearFetching, setAdmissionYearFetching] = useState<boolean>(false);

  const handleGetAdmissionYear = useCallback(async () => {
    try {
      setAdmissionYearFetching(true);
      const res = await getListAdmission();
      setAdmissionYears(res.data.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Failed to get admission year: ', error);
    }
    setAdmissionYearFetching(false);
  }, []);

  useEffect(() => {
    handleGetAdmissionYear();
  }, []);

  const handleSelectAdmissionYear = useCallback((admissionYear: AdmissionYear) => {
    setAdmissionYearSelected(admissionYear);
  }, []);

  return (
    <StudentPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Sinh viên - Danh sách"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Danh sách sinh viên', href: null },
            ]}
            withActions={
              admissionYearSelected && (
                <Group>
                  <AdmissionYearItem admissionYear={admissionYearSelected} />
                  <IconLogout
                    style={{ cursor: 'pointer' }}
                    size={24}
                    onClick={() => setAdmissionYearSelected(null)}
                  />
                </Group>
              )
            }
          />

          <Paper p="md" shadow="md" radius="md">
            {admissionYearSelected ? (
              <StudentAdmission />
            ) : (
              <AdmissionYearList
                admissionYears={admissionYears}
                onSelect={handleSelectAdmissionYear}
                fetching={admissionYearFetching}
              />
            )}
          </Paper>
        </Stack>
      </Container>
    </StudentPageStyled>
  );
};

const StudentPageStyled = styled.div`
  .admission-year-item {
    cursor: pointer;
    &:hover {
      background: #f7f7f7;
    }
  }
`;

export default StudentPage;
