import styled from '@emotion/styled';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import Role from '@/enums/role.enum';
import TabClassAdmin from './components/TabClassAdmin';
import TabClassTeacher from './components/TabClassTeacher';

const ClassList = () => {
  const { authUser } = useAuthStore();
  return (
    <ClassListStyled>
      {authUser?.role === Role.Admin && <TabClassAdmin />}
      {authUser?.role === Role.Teacher && <TabClassTeacher />}
    </ClassListStyled>
  );
};

const ClassListStyled = styled.div`
  .classList-header {
    display: flex;
    align-items: center;
    justify-content: end;
  }
`;

export default ClassList;
