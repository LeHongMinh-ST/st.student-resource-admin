import ClassUpdatePage from '@/features/classes/edit';

type Props = {
  id: any;
};

export default function Page({ id }: Props) {
  return <ClassUpdatePage id={Number(id)}></ClassUpdatePage>;
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
