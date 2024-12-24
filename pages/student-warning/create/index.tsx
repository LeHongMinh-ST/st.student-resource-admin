import WarningCreatePage from '@/features/students/warnings/create';
import { useWarningStudentService } from '@/services/WarningStudentService';
import { Semester } from '@/types';

type Props = {
  semesters: Semester[];
};
export const getServerSideProps = async () => {
  const { getSemesters } = useWarningStudentService();
  const response = await getSemesters();
  const semesters = response?.data ?? [];
  return {
    props: {
      semesters,
    },
  };
};

export default function Page({ semesters }: Props) {
  return <WarningCreatePage semesters={semesters} />;
}
