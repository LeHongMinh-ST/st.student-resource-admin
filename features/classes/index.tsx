import { Container, Group, Paper, Stack } from '@mantine/core';
import styled from '@emotion/styled';
import { IconLogout } from '@tabler/icons-react';
import useSWR from 'swr';
import { PageHeader } from '@/components';
import { dashboardRoute } from '@/routes';
import { AdmissionYear } from '@/types';
import { useStudentService } from '@/services/studentService';
import ClassList from './list';
import {
  useAdmissionYearClassProps,
  useSetAdmissionYearClassProps,
} from '@/utils/recoil/classess/AdmissionYearClassState';
import AdmissionYearList from './components/Admission/AdmissionYearList';
import AdmissionYearItem from './components/Admission/AdmissionYearItem';

const ClassPage = () => {
  const admissionYearSelected = useAdmissionYearClassProps();
  const setAdmissionYearSelected = useSetAdmissionYearClassProps();
  const { getListAdmission } = useStudentService();

  const { data: admissions, isLoading } = useSWR<AdmissionYear[]>(['getListAdmission'], () =>
    getListAdmission().then((res) => res?.data?.data)
  );

  return (
    <ClassPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Lớp học - Danh sách ${admissionYearSelected ? `khoá ${admissionYearSelected.admission_year}` : ''}`}
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Lớp học', href: null },
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
              <ClassList />
            ) : (
              <AdmissionYearList
                admissionYears={admissions || []}
                onSelect={(admissionYear: AdmissionYear) => setAdmissionYearSelected(admissionYear)}
                fetching={isLoading}
              />
            )}
          </Paper>
        </Stack>
      </Container>
    </ClassPageStyled>
  );
};

const ClassPageStyled = styled.div``;

export default ClassPage;
