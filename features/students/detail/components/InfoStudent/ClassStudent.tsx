import { FC } from 'react';
import useSWR from 'swr';
import { useStudentService } from '@/services/studentService';
import { GeneralClass } from '@/types';

type ClassStudentProps = {
  studentId?: number;
};
const ClassStudent: FC<ClassStudentProps> = ({ studentId }) => {
  const { getStudentClassesById } = useStudentService();
  const getClassesByStudentId = () => getStudentClassesById(studentId).then((res) => res.data);

  const { data, isLoading } = useSWR<GeneralClass[]>([studentId], getClassesByStudentId);
  console.log(data, isLoading, studentId);

  return <>Đang cập nhật...</>;
};

export default ClassStudent;
