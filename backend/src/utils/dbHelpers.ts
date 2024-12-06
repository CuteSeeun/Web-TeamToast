// dbHelpers.ts

// DB 연결이 필요한 헬퍼 함수들
import { executeQuery } from './dbUtils';
import { RowDataPacket } from 'mysql2';

// UserRole 테이블에서 email과 space_id 검증

//채경
// export const checkUserInSpace = async (user: string | undefined, sid: number): Promise<boolean> => {
//   if (!user) return false;

//   return executeQuery(async (connection) => {
//     const query = `
//       SELECT COUNT(*) as count 
//       FROM UserRole 
//       WHERE user = ? AND space_id = ?;
//     `;
//     const [rows] = await connection.query<RowDataPacket[]>(query, [user, sid]);
//     return rows[0].count > 0;
//   });
// };
//--------------------------------------------------------

//현진
export const checkUserInSpace = async (userId: string | number, sid: number): Promise<boolean> => {
  if (!userId) return false;

  return executeQuery(async (connection) => {
    // 먼저 User 테이블에서 uid로 email 찾기
    const userQuery = `SELECT email FROM User WHERE uid = ?`;
    const [userRows] = await connection.query<RowDataPacket[]>(userQuery, [userId]);
    
    if (!userRows || userRows.length === 0) return false;
    
    const userEmail = userRows[0].email;
    
    // UserRole 테이블에서 email과 space_id로 권한 확인
    const roleQuery = `
      SELECT COUNT(*) as count 
      FROM UserRole 
      WHERE user = ? AND space_id = ?;
    `;
    
    const [rows] = await connection.query<RowDataPacket[]>(roleQuery, [userEmail, sid]);
    return rows[0].count > 0;
  });
};

//------------------------------------------------------------------------------------------------


// 이슈를 생성하는 user가 space와 project에 소속되어 있는지 검증
export const checkUserInProjectAndSpace = async (
  user: string | undefined,
  pid: number
): Promise<boolean> => {
  if (!user) return false;

  return executeQuery(async (connection) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM UserRole ur
      WHERE ur.user = ? AND ur.space_id = (
        SELECT p.space_id 
        FROM Project p 
        WHERE p.pid = ?
      );
    `;
    const [rows] = await connection.query<RowDataPacket[]>(query, [user, pid]);
    return rows[0].count > 0;
  });
};

// Project 테이블에서 project_id 검증
export const checkProjectExists = async (projectId: number): Promise<boolean> => {
  return executeQuery(async (connection) => {
    const query = 'SELECT COUNT(*) as count FROM Project WHERE pid = ?';
    const [rows] = await connection.query<RowDataPacket[]>(query, [projectId]);
    return rows[0].count > 0;
  });
};

// Sprint 테이블에서 sprint_id 검증
export const checkSprintExists = async (sprintId: number | null): Promise<boolean> => {
  if (sprintId === null) return true;

  return executeQuery(async (connection) => {
    const query = 'SELECT COUNT(*) as count FROM Sprint WHERE spid = ?';
    const [rows] = await connection.query<RowDataPacket[]>(query, [sprintId]);
    return rows[0].count > 0;
  });
};