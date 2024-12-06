// 2024-11-27 한채경
// projectAtoms.tsx

import { atom } from 'recoil';
import { Project } from '../../types/projectTypes';

export const projectListState = atom<Project[]>({
  key: 'projectListState',
  default: [],
});

// 현재 선택된 프로젝트 정보를 저장하는 Atom
export const currentProjectState = atom<Project>({
  key: 'currentProjectState',
  default:{
    pid: 0,
    pname: '',
    description: '',
    space_id: 0
  },
});