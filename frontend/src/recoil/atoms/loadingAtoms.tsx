import { atom } from 'recoil';

export const loadingAtoms = atom({
  key: 'loadingAtoms',
  default: true, // 로딩 중 기본값
});
