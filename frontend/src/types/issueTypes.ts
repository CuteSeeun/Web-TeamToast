// 2024-11-28 한채경
// issueTypes.ts

export type Issue = {
  isid?: number;
  title: string;
  detail?: string;
  type: Type;
  status: Status;
  sprint_id: number | null;
  project_id: number;
  manager?: string | null;
  created_by?: string | null;
  file?: string[] | null;
  priority: Priority;
};

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