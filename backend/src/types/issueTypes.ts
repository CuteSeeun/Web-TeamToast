// 2024-11-26 한채경
// issueTypes.ts

export type Issue = {
  isid?: number; // 새로 생성할 때는 optional
  title: string;
  detail?: string;
  type: Type; // 한글 작업 유형
  status: Status; // 한글 상태
  sprint_id: number | null; // 스프린트 ID
  project_id: number; // 프로젝트 ID
  manager?: string | null; // 담당자
  created_by?: string | null; // 보고자
  file?: string | null; // 첨부파일
  priority: Priority; // 한글 우선순위
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
