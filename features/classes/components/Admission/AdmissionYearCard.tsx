import { Box, Card, Group, Text } from '@mantine/core';
import { AdmissionYear } from '@/types';
import AdmissionYearItem from './AdmissionYearItem';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';

interface AdmissionYearCardProps {
  admissionYear: AdmissionYear;
  onSelect: (admissionYear: AdmissionYear) => void;
}

const AdmissionYearCard = ({ admissionYear, onSelect }: AdmissionYearCardProps) => {
  const handleClick = () => {
    onSelect(admissionYear);
  };

  const { authUser } = useAuthStore();

  return (
    <Card mt={10} className="admission-year-item" onClick={handleClick}>
      <Group align="center" justify="space-between">
        <AdmissionYearItem admissionYear={admissionYear} />
        <Group align="center" mt="md" mb="xs">
          <Box>
            {authUser?.role !== Role.Teacher && (
              <>
                <Text fw={500} size="lg">
                  Tổng số : {admissionYear.classes_count ?? 0} lớp
                </Text>
                <Box>
                  <Text fw={500} size="lg">
                    Nhập học: {admissionYear.student_count ? admissionYear.student_count : 0} sv
                  </Text>
                  <Text fw={500} size="lg">
                    Hiện tại:{' '}
                    {admissionYear.currently_studying_count
                      ? admissionYear.currently_studying_count
                      : 0}{' '}
                    sv
                  </Text>
                </Box>
              </>
            )}
          </Box>
        </Group>
      </Group>
    </Card>
  );
};

export default AdmissionYearCard;
