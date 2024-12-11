// recoil/atoms/managerAtoms.ts
import { atom } from 'recoil';


export const managerAtoms = atom<string | null>({
  key: 'managerAtoms',
  default: null, // 초기값
});