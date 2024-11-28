// 2024-11-27 한채경
// projectAtoms.tsx

import { atom } from 'recoil';
import { Project } from '../../types/projectTypes';

// 현재 선택된 프로젝트 정보 저장하는 Atom
export const currentProjectState = atom<Project> ({
  key: 'currentProjectState',
  default: {
    pid: 0,
    pname: '',
    description: '',
    space_id: 0
  }
});

// 프로젝트의 ID를 저장하는 Atom
export const projectIdState = atom ({
  key: 'projectIdState',
  default: 0
});