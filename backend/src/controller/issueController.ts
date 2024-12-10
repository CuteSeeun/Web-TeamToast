// import { Request, Response, NextFunction } from 'express';
// import pool from '../config/dbpool';
// // import { newIssueQuery } from '../models/issueModel';
// // import { validateAndMap } from '../utils/helpers';
// import { Issue, Priority, Status, Type } from '../types/issueTypes';


// // 이슈 생성하기 
// export const newIssue = async (req: Request & { userRole: { user: string; role: string; space_id: number } }, res: Response, next: NextFunction) => {

//   const pid = parseInt(req.params.pid, 10);

//   try {

//     // Sprint ID 처리
//     const sprintId = req.body.sprint_id ?? null;

//     const issue: Issue = {
//       title: req.body.title,
//       detail: req.body.detail || null,
//       type: type || Type.process,
//       status: status || Status.Backlog, // 변환된 status 사용
//       sprint_id: sprintId,
//       project_id: pid,
//       manager: managerEmail || null,
//       created_by: createdByEmail || null,
//       file: req.body.file ? JSON.stringify(req.body.file) : null,
//       priority: priority || Priority.normal,
//     };

//     const query = `
//        INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//      `;
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



//     res.status(201).json({
//       isid: insertId,
//       ...issue,
//     });
//   } catch (err) {
//     console.error(`데이터 조회 오류: ${err}`);
//     res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//   };
// };