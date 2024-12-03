// 2024-11-28 한채경
// issueTypes.ts

export type Issue = {
  isid?: number;
  title: string;
  detail?: string;
  type: 'process' | 'bug';
  status: 'backlog' | 'working' | 'dev' | 'QA';
  sprint_id: number | null;
  project_id: number;
  manager?: string | null;
  created_by?: string | null;
  file?: string[] | null;
  priority: 'high' | 'normal' | 'low';
};