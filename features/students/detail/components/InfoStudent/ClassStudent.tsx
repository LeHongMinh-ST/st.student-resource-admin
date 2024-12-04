import { FC } from 'react';
import useSWR from 'swr';

type ClassStudentProps = {
  studentId?: number;
};
const ClassStudent: FC<ClassStudentProps> = ({ studentId }) => {
  const getClassesByStudentId = () => {};

  const { data, isLoading } = useSWR([], getClassesByStudentId);
  console.log(data, isLoading, studentId);

  return <>Đang cập nhật...</>;
};

export default ClassStudent;
