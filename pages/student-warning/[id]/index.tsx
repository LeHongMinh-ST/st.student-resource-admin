import WarningDetailPage from '@/features/students/warnings/detail';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <WarningDetailPage id={id} />;
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
