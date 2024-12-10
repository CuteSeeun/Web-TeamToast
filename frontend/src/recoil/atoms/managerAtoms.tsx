// recoil/atoms/managerAtoms.ts
import { atom } from 'recoil';

export const managerAtoms = atom<string | null>({
  key: 'managerAtoms', // 고유한 키
  default: null, // 초기 값
});