import { atom } from 'recoil';

export const issuesAtom = atom({
  key: 'issuesAtom', // Atom의 고유 키
  default: [], // 초기값: 빈 배열
});
