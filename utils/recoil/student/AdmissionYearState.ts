/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { AdmissionYear } from '@/types';

const admissionYearState = atom<AdmissionYear | null>({
  key: 'admissionYearState',
  default: null,
});

export const useAdmissionYearProps = () => useRecoilValue(admissionYearState);
export const useSetAdmissionYearProps = () => {
  const setState = useSetRecoilState(admissionYearState);
  return useCallback(setState, [setState]);
};
