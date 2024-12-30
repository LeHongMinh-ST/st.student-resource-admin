import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Role from '@/enums/role.enum';
import { useAuthStore } from '@/utils/recoil/auth/authState';

const getUserRole = (): Role | null => {
  const { authUser } = useAuthStore();
  return authUser?.role as Role;
};

export function withAuth(WrappedComponent: React.FC, allowedRoles: Role[]) {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const userRole = getUserRole();

    useEffect(() => {
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push('/403');
      }
    }, [userRole]);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
}
