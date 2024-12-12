"use strict";
// import { executeQuery } from '../utils/dbUtils';
// import { RowDataPacket, ResultSetHeader } from 'mysql2';
// import { Issue } from '../types/issueTypes';
// // 이슈 생성
// export const newIssueQuery = async (issue: Issue) => {
//   return executeQuery(async (connection) => {
//     const query = `
//       INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//     `;
//     const [result] = await connection.query<ResultSetHeader>(query, [
//       issue.title,
//       issue.detail,
//       issue.type,
//       issue.status,
//       issue.sprint_id,
//       issue.project_id,
//       issue.manager,
//       issue.created_by,
//       issue.file,
//       issue.priority
//     ]);
//     return result;
//   });
// };
