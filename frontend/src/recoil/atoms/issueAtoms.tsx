// 2024-11-27 한채경
// issueAtoms.tsx
import { atom } from "recoil";

export interface Issue {
  title: string;
  detail?: string;
  type: Type;
  status: Status;
  sprint_id: number | null;
  project_id: number;
  manager?: string;
  created_by?: string;
  file?: string;
  priority: Priority;
}

// Status ENUM 속성 지정
export enum Status {
  Backlog = '백로그',
  Working = '작업중',
  Dev = '개발완료',
  QA = 'QA완료',
}

// Type ENUM 속성 지정
export enum Type {
  process = '작업',
  bug = '버그',
}

// Priority ENUM 속성 지정
export enum Priority {
  high = '높음',
  normal = '보통',
  low = '낮음',
}

export const issueListState = atom<Issue[]> ({
  key: 'issueListState',
  default: []
});