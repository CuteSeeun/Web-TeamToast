// 2024-11-27 한채경
// issueAtoms.tsx
import { atom } from "recoil";

// 이슈 상태를 객체로 관리
export const issueListState = atom<{ [key: number]: Issue[] }>({
  key: 'issueListState',
  default: {},
});

export const backlogState = atom<Issue[]>({
  key: 'backlogState',
  default: [],
});

export interface Issue {
  isid: number; // BBoard에 isid가 Issue에 없다고 오류 떠서 임시로 추가
  title: string;
  detail?: string | null;
  type: Type;
  status: Status;
  sprint_id: number | null;
  project_id: number;
  manager?: string | null;
  created_by?: string | null;
  file?: string[] | null; // file 여러개 들어갈 수 있어서 string[]으로 수정
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

