const ADMIN_PREFIX = '';

export const dashboardRoute = {
  dashboard: `${ADMIN_PREFIX}/`,
};

export const userRoute = {
  list: `${ADMIN_PREFIX}/users`,
  create: `${ADMIN_PREFIX}/users/create`,
  update: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/users/${id}/edit` : ''),
};

export const departmentRoute = {
  list: `${ADMIN_PREFIX}/departments`,
  create: `${ADMIN_PREFIX}/departments/create`,
  update: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/departments/${id}/edit` : ''),
};

export const classRoute = {
  list: `${ADMIN_PREFIX}/classes`,
  create: `${ADMIN_PREFIX}/classes/create`,
  show: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/classes/${id}` : ''),
  update: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/classes/${id}/edit` : ''),
};

export const graduationRoute = {
  list: `${ADMIN_PREFIX}/students-graduation`,
  create: `${ADMIN_PREFIX}/students-graduation/create`,
  show: (id: string | number | undefined) =>
    id ? `${ADMIN_PREFIX}/students-graduation/${id}` : '',
};

export const studentRoute = {
  listCourse: `${ADMIN_PREFIX}/students`,
  show: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/students/${id}` : ''),
};
