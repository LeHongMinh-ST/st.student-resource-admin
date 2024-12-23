import { useWarningStudentService } from '@/services/WarningStudentService';
import { Semester } from '@/types';
import WarningEditPage from '@/features/students/warnings/edit';

type Props = {
  id: any;
  semesters: Semester[];
};

export default function Page({ id, semesters }: Props) {
  return <WarningEditPage id={Number(id)} semesters={semesters} />;
}

export const getServerSideProps = async (context: { params: any }) => {
  const { params } = context;
  const { id } = params;
  const { getSemesters } = useWarningStudentService();
  const response = await getSemesters();
  const semesters = response?.data ?? [];
  return {
    props: {
      id,
      semesters,
    },
  };
};
