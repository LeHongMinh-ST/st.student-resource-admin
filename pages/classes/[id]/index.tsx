import ClassDetailPage from '@/features/classes/detail';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <ClassDetailPage id={Number(id)}></ClassDetailPage>;
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
