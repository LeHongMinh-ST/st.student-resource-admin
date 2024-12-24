import QuitDetailPage from '@/features/students/quits/detail';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <QuitDetailPage id={id} />;
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
