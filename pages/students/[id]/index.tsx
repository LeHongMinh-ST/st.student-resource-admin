import StudentDetailPage from '@/features/students/detail';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <StudentDetailPage id={Number(id)}></StudentDetailPage>;
}

export const getServerSideProps = async (context: { params: any }) => {
  const { params } = context;
  const { id } = params;

  return {
    props: {
      id,
    },
  };
};
