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

export const trainingIndustryRoute = {
  list: `${ADMIN_PREFIX}/training-industries`,
  create: `${ADMIN_PREFIX}/training-industries/create`,
  update: (id: string | number | undefined) =>
    id ? `${ADMIN_PREFIX}/training-industries/${id}/edit` : '',
};

export const surveyPeriodRoute = {
  list: `${ADMIN_PREFIX}/survey-periods`,
  create: `${ADMIN_PREFIX}/survey-periods/create`,
  show: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/survey-periods/${id}` : ''),
  update: (id: string | number | undefined) =>
    id ? `${ADMIN_PREFIX}/survey-periods/${id}/edit` : '',
};

export const majorRoute = {
  list: `${ADMIN_PREFIX}/training-industries`,
  create: `${ADMIN_PREFIX}/training-industries/create`,
  update: (id: string | number | undefined) =>
    id ? `${ADMIN_PREFIX}/training-industries/${id}/edit` : '',
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
  update: (id: string | number | undefined) =>
    id ? `${ADMIN_PREFIX}/students-graduation/${id}/edit` : '',
};

export const studentRoute = {
  listCourse: `${ADMIN_PREFIX}/students`,
  show: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/students/${id}` : ''),
  update: (id: string | number | undefined) => (id ? `${ADMIN_PREFIX}/students/${id}/edit` : ''),
};
