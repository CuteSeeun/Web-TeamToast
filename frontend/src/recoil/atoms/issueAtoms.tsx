
import { atom, selector } from 'recoil';

// 이슈 상태를 객체로 관리
export const issueListState = atom<{ [key: number]: Issue[] }>({
  key: 'issueListState',
  default: {},
});

export const backlogState = atom<Issue[]>({
  key: 'backlogState',
  default: [],
});

// 새로운 atom 추가
export const allIssuesState = atom<Issue[]>({
  key: 'allIssuesState',
  default: [],
});


export interface Issue {
  isid: number;
  title: string;
  detail: string;
  type: string;
  status: string;
  priority: string;
  manager: string;
  sprint_id: number | null;
  project_id: number;
  created_by: string;
  file: string | null;
}

// Status ENUM 속성 지정
export enum Status {
  Backlog = '백로그',
  Working = ' 작업중',
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

// 모든 이슈를 가져오는 selector
export const allIssuesSelector = selector({
  key: 'allIssuesSelector',
  get: ({ get }) => {
    const issueList = get(allIssuesState);
    console.log('All Issues in Selector:', issueList); // 추가한 로그
    return issueList;
  }
});

