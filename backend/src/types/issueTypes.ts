// 2024-11-26 한채경
// issueTypes.ts

export type Issue = {
  isid?: number; // 새로 생성할 때는 optional
  title: string;
  detail?: string | null;
  type: '작업' | '버그'; // 한글 작업 유형
  status: '백로그' | '작업중' | '개발완료' | 'QA완료'; // 한글 상태
  sprint_id: number | null; // 스프린트 ID
  project_id: number; // 프로젝트 ID
  manager?: string | null; // 담당자
  created_by?: string | null; // 보고자
  file?: string | null; // 첨부파일
  priority: '높음' | '보통' | '낮음'; // 한글 우선순위
};