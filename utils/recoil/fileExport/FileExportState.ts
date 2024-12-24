/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ZipExportFile } from '@/types';

export const ZipExportFileState = atom<ZipExportFile | null>({
  key: 'ZipExportFileState',
  default: null,
});

export const useZipExportFileProps = () => useRecoilValue(ZipExportFileState);
export const useSetZipExportFileProps = () => {
  const setState = useSetRecoilState(ZipExportFileState);
  return useCallback(setState, [setState]);
};
