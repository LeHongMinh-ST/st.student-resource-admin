/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { AdmissionYear } from '@/types';

const admissionYearClassState = atom<AdmissionYear | null>({
  key: 'admissionYearState',
  default: null,
});

export const useAdmissionYearClassProps = () => useRecoilValue(admissionYearClassState);
export const useSetAdmissionYearClassProps = () => {
  const setState = useSetRecoilState(admissionYearClassState);
  return useCallback(setState, [setState]);
};
