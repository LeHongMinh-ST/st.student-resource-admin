import { useWarningStudentService } from '@/services/WarningStudentService';
import { Warning } from '@/types';

type Props = {
  id: any;
  warning: Warning;
};

export default function Page({ id, warning }: Props) {
  console.log(warning, id);
  return <div>hello</div>;
}

export const getServerSideProps = async (context: { params: any }) => {
  const { params } = context;
  const { id } = params;

  const { getWarningStudentById } = useWarningStudentService();
  try {
    const response = await getWarningStudentById(id);
    const warning = response?.data ?? {};
    return {
      props: {
        id,
        warning,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
