/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ZipExportFile } from '@/types';

export const IsShowProgressState = atom<boolean>({
  key: 'isShowProgressState',
  default: false,
});

export const useIsShowProgres = () => useRecoilValue(IsShowProgressState);
export const useSetIsShowProgres = () => {
  const setState = useSetRecoilState(IsShowProgressState);
  return useCallback(setState, [setState]);
};

export const ZipExportFileState = atom<ZipExportFile | null>({
  key: 'ZipExportFileState',
  default: null,
});

export const useZipExportFileProps = () => useRecoilValue(ZipExportFileState);
export const useSetZipExportFileProps = () => {
  const setState = useSetRecoilState(ZipExportFileState);
  return useCallback(setState, [setState]);
};
