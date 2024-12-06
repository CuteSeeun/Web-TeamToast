// 2024-11-27 한채경
// projectAtoms.tsx

import { atom } from 'recoil';

// 현재 선택된 프로젝트 ID를 저장하는 Atom
export const projectIdState = atom<number>({
  key: 'projectIdState',
  default: 0, // 기본값을 null로 설정 (선택되지 않은 상태)
  effects_UNSTABLE: [
    // localStorage에 projectId 정보를 저장
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('projectId');
      if (savedValue != null) {
        setSelf(Number(savedValue)); // 저장된 ID 복원
      }

      onSet((newValue) => {
        if (newValue == null) {
          localStorage.removeItem('projectId'); // 값이 없으면 삭제
        } else {
          localStorage.setItem('projectId', String(newValue)); // 새로운 값 저장
        }
      });
    },
  ],
});