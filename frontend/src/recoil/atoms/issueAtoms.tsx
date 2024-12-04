import { atom, selectorFamily } from 'recoil';

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
  isid: number;
  title: string;
  detail?: string | null;
  type: Type;
  status: Status;
  sprint_id: number | null;
  project_id: number;
  manager?: string | null;
  created_by?: string | null;
  file?: string | null;
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

// 특정 이슈를 가져오는 selector
export const issueState = selectorFamily<Issue | undefined, number>({
  key: 'issueState',
  get: (isid) => ({ get }) => {
    const issueList = get(issueListState);
    for (const sprintId in issueList) {
      const issues = issueList[sprintId];
      if (Array.isArray(issues)) {
        const issue = issues.find(issue => issue.isid === isid);
        if (issue) return issue;
      }
    }
    return undefined;
  }
});

