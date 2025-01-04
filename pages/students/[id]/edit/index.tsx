import Role from '@/enums/role.enum';
import StudentEditPage from '@/features/students/edit';
import { withAuth } from '@/hoc/withAuth';

type Props = {
  id: any;
};

function Page({ id }: Props) {
  return <StudentEditPage id={Number(id)}></StudentEditPage>;
}

export default withAuth(Page, [Role.Admin, Role.Office]);

export const getServerSideProps = async (context: { params: any }) => {
  const { params } = context;
  const { id } = params;

  return {
    props: {
      id,
    },
  };
};
