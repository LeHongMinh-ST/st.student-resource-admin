import WarningEditPage from '@/features/students/warnings/edit';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <WarningEditPage id={Number(id)} />;
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
