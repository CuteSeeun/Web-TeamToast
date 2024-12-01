// 2024-11-27 한채경
// projectAtoms.tsx

import { atom } from 'recoil';
import { Project } from '../../types/projectTypes';

// 현재 선택된 프로젝트 정보 저장하는 Atom
export const currentProjectState = atom<Project>({
  key: 'currentProjectState',
  default: {
    pid: 0,
    pname: '',
    description: '',
    space_id: 0,
  },
  effects_UNSTABLE: [
    // localStorage에 currentProject 정보를 저장
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('currentProject');
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue)); // 저장된 값 복원
      }

      onSet((newValue) => {
        if (newValue == null) {
          localStorage.removeItem('currentProject'); // 값이 없으면 삭제
        } else {
          localStorage.setItem('currentProject', JSON.stringify(newValue)); // 새로운 값 저장
        }
      });
    },
  ],
});