import { Box, Card, Group, Text } from '@mantine/core';
import { AdmissionYear } from '@/types';
import AdmissionYearItem from './AdmissionYearItem';

interface AdmissionYearCardProps {
  admissionYear: AdmissionYear;
  onSelect: (admissionYear: AdmissionYear) => void;
}

const AdmissionYearCard = ({ admissionYear, onSelect }: AdmissionYearCardProps) => {
  const handleClick = () => {
    onSelect(admissionYear);
  };

  return (
    <Card mt={10} className="admission-year-item" onClick={handleClick}>
      <Group align="center" justify="space-between">
        <AdmissionYearItem admissionYear={admissionYear} />
        <Group align="center" mt="md" mb="xs">
          <Box>
            <Text fw={500} size="lg">
              Tổng số lớp: {admissionYear.classes_count ?? 0}
            </Text>
          </Box>
        </Group>
      </Group>
    </Card>
  );
};

export default AdmissionYearCard;
