import { atom, selector } from 'recoil';
import  {filterState, enabledSprintsState} from './sprintAtoms';

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

//활성스프린트 검색 필터링 셀렉터
export const filteredIssuesState = selector({
  key: 'filteredIssuesState',
  get: ({ get }) => {
    const filter = get(filterState);// 필터 조건 가져오기
    const enabledSprints = get(enabledSprintsState);// 활성 스프린트 가져오기
    const allIssues = get(allIssuesState);// 모든 이슈 가져오기
    const enabledSprintIds = enabledSprints.map((sprint) => sprint.spid);// 활성 스프린트 ID 추출

    // 활성 스프린트에 속한 이슈만 필터링
    let filteredIssues = allIssues.filter((issue) =>
      enabledSprintIds.includes(issue.sprint_id || 0)
    );
    // 필터 조건 적용
    if (filter.manager) {
      filteredIssues = filteredIssues.filter((issue) => issue.manager === filter.manager);
    }
    if (filter.status) {
      filteredIssues = filteredIssues.filter((issue) => issue.status === filter.status);
    }
    if (filter.priority) {
      filteredIssues = filteredIssues.filter((issue) => issue.priority === filter.priority);
    }
    // 유형(타입) 필터: 'task'/'bug'를 Issue.type('작업'/'버그')와 매핑할 필요가 있다면 여기서 처리
    if (filter.type) {
      // 예를 들어, filter.type이 'task'면 issue.type이 '작업'인 이슈만 필터링
      const mappedType = filter.type === 'task' ? '작업' : '버그';
      filteredIssues = filteredIssues.filter((issue) => issue.type === mappedType);
    }
    return filteredIssues;
  },
});

//활성스프린트 컬럼 필터링 셀렉터
export const issuesByStatusState = selector({
  key: 'issuesByStatusState',
  get: ({ get }) => {
    const filteredIssues = get(filteredIssuesState); // 활성 스프린트 및 필터 조건에 맞는 이슈들 가져오기

    // 상태별로 이슈 분류
    const issuesByStatus = {
      backlog: filteredIssues.filter((issue) => issue.status === Status.Backlog),
      working: filteredIssues.filter((issue) => issue.status === Status.Working),
      dev: filteredIssues.filter((issue) => issue.status === Status.Dev),
      qa: filteredIssues.filter((issue) => issue.status === Status.QA),
    };

    return issuesByStatus;
  },
});


interface ManagerStatusCount {
  [Status.Backlog]: number;
  [Status.Working]: number;
  [Status.Dev]: number;
  [Status.QA]: number;
}
//활성스프린트 담당자분류 후 상태 분류 셀렉터
// export const issuesByManagerAndStatusState = selector({
//   key: 'issuesByManagerAndStatusState',
//   get: ({ get }) => {
//     const filteredIssues = get(filteredIssuesState); // 활성 스프린트 이슈 가져오기
//     const acc: Record<string, ManagerStatusCount> = {}; //타입 명시

//     return filteredIssues.reduce((acc, issue) => {
//       const manager = issue.manager || 'Unassigned';

//       if (!acc[manager]) {
//         acc[manager] = {
//           backlog: 0,
//           working: 0,
//           dev: 0,
//           qa: 0,
//         };
//       }
//       acc[manager][issue.status] += 1; // 상태별로 카운트 증가
//       return acc;
//     }, acc);
//   },
// });
export const issuesByManagerAndStatusState = selector({
  key: 'issuesByManagerAndStatusState',
  get: ({ get }) => {
    const filteredIssues = get(filteredIssuesState); // 활성 스프린트 이슈 가져오기
    return filteredIssues.reduce((acc: Record<string, ManagerStatusCount>, issue) => {
      const manager = issue.manager || 'Unassigned';

      if (!acc[manager]) {
        acc[manager] = {
          [Status.Backlog]: 0,
          [Status.Working]: 0,
          [Status.Dev]: 0,
          [Status.QA]: 0,
        };
      }

      acc[manager][issue.status] += 1; // 상태별로 카운트 증가
      return acc;
    }, {});
  },
});