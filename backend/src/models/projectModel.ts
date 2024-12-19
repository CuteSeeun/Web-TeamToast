// 2024-11-25 한채경
// projectModel.ts

import { executeQuery } from '../utils/dbUtils';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Project } from '../types/projectTypes'; // 프로젝트 타입 인터페이스
import pool from '../config/dbpool'; // 데이터베이스 연결

// 모든 프로젝트 가져오기
export const getAllProjectsQuery = async () => {
  return executeQuery(async (connection) => {
    const query = 'SELECT * FROM Project;';
    const [rows] = await connection.query<RowDataPacket[]>(query);
    const projects: Project[] = rows as Project[];
    return projects;
  });
};

// sid가 일치하는 프로젝트 모두 가져오기
export const getProjectsQuery = async (sid: number) => {
  return executeQuery(async (connection) => {
    const query = `
      SELECT * 
      FROM Project
      WHERE space_id = ?;
    `;
    const [rows] = await connection.query<RowDataPacket[]>(query, [sid]);
    const projects: Project[] = rows as Project[];
    return projects;
  });
};

// pid가 일치하는 프로젝트 하나 가져오기
export const getProjectQuery = async (pid: number) => {
  return executeQuery(async (connection) => {
    const query = 'SELECT * FROM Project WHERE pid = ?;';
    const [rows] = await connection.query<RowDataPacket[]>(query, [pid]);
    const projects: Project[] = rows as Project[];
    return projects;
  });
};

// 프로젝트 생성
export const newProjectQuery = async (pname: string, desc: string, sid: number) => {
  return executeQuery(async (connection) => {
    const query = `
      INSERT INTO Project (pname, description, space_id)
      SELECT ?, ?, ?
      FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM Project WHERE pname = ? AND space_id = ?
      );
    `;
    const [result] = await connection.query<ResultSetHeader>(query, [pname, desc, sid, pname, sid]);
    return result;
  });
};

// 프로젝트 정보 수정
export const modifyProjectQuery = async (pname: string, desc: string, pid: number, sid: number) => {
  return executeQuery(async (connection) => {
    const query = `
      UPDATE Project 
      SET pname = ?, description = ? 
      WHERE pid = ? 
      AND NOT EXISTS (
        SELECT 1 FROM Project WHERE pname = ? AND space_id = ? AND pid != ?
      );
    `;
    const [result] = await connection.query<ResultSetHeader>(query, [pname, desc, pid, pname, sid, pid]);
    return result;
  });
};

// 프로젝트 삭제
export const deleteProjectQuery = async (pid: number) => {
  return executeQuery(async (connection) => {
    const query = 'DELETE FROM Project WHERE pid = ?;';
    const [result] = await connection.query<ResultSetHeader>(query, [pid]);
    return result;
  });
};


export const getProjectsByUUIDQuery = async (uuid: string) => {
  const connection = await pool.getConnection();

  try {
      const [rows]: any = await connection.query(
        `
        SELECT p.* 
        FROM Project p
        JOIN Space s ON p.space_id = s.sid
        WHERE s.uuid = ?
        `, // space_id와 uuid를 조인하여 프로젝트 검색
        [uuid]
      );
      return rows;
  } finally {
      connection.release();
  }
};
