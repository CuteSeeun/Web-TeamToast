import { atom, selector } from 'recoil';

//스프린트별 이슈 목록(객체 형태) : 특정 스프린트에 속한 이슈만 필터링
export const issueListState = atom<{ [key: number]: Issue[] }>({
  key: 'issueListState',
  default: {},
});

//스프린트에 포함되지 않은 이슈
export const backlogState = atom<Issue[]>({
  key: 'backlogState',
  default: [],
});

//모든 이슈
export const allIssuesState = atom<Issue[]>({
  key: 'allIssuesState',
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
  file: string[];
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

//셀렉터-----------------------------------------------------------

// allIssuesState의 데이터를 가져오는 셀렉터
export const allIssuesSelector = selector({
  key: 'allIssuesSelector',
  get: ({ get }) => {
    const issueList = get(allIssuesState);
    console.log('All Issues in Selector:', issueList); // 추가한 로그
    return issueList;
  }
});
