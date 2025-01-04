import Role from '@/enums/role.enum';
import WarningEditPage from '@/features/students/warnings/edit';
import { withAuth } from '@/hoc/withAuth';

type Props = {
  id: any;
};

function Page({ id }: Props) {
  return <WarningEditPage id={Number(id)} />;
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
