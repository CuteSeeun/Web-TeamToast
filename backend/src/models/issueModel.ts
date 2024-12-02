// 2024-11-25 한채경, 11-26일 마지막 수정
// issueModel.ts

import { executeQuery } from '../utils/dbUtils';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Issue } from '../types/issueTypes';

// 프로젝트에 포함된 모든 이슈 가져오기
export const getIssuesQuery = async (pid: number) => {
  return executeQuery(async (connection) => {
    // project_id가 pid인 모든 이슈 가져오는 쿼리문
    const query = `
      SELECT *
      FROM Issue
      WHERE project_id = ?;
    `;
    const [rows] = await connection.query<RowDataPacket[]>(query, [pid]);
    const issues: Issue[] = rows as Issue[];
    return issues;
  });
};

// 이슈 생성
export const newIssueQuery = async (issue: Issue) => {
  return executeQuery(async (connection) => {
    const query = `
      INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await connection.query<ResultSetHeader>(query, [
      issue.title,
      issue.detail,
      issue.type,
      issue.status,
      issue.sprint_id,
      issue.project_id,
      issue.manager,
      issue.created_by,
      issue.file,
      issue.priority
    ]);
    return result;
  });
};