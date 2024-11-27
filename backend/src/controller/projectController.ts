// 2024-11-25 한채경
// projectController.ts

import { RequestHandler } from 'express';
import { getAllProjectsQuery, getProjectsQuery, getProjectQuery, newProjectQuery, modifyProjectQuery, deleteProjectQuery } from '../models/projectModel.js';
import { ResultSetHeader } from 'mysql2';

import { Project } from '../types/projectTypes'; // 프로젝트 타입 인터페이스
import { checkUserInSpace } from '../utils/dbHelpers.js'; // UserRole 테이블에서 리퀘스트를 요청한 user가 sid에 권한이 있는지 확인하기 위한 헬퍼함수


// 모든 프로젝트 가져오기 (admin)
export const getAllProjects: RequestHandler = async (req, res) => {
  try {
    // 사이트 관리자만 쓸 수 있음 (로직, 권한 설정 필요)

    const projects: Project[] = await getAllProjectsQuery();
    if (projects.length === 0) {
      res.status(404).json({ error: '프로젝트가 없습니다.' });
      return;
    }
    res.status(200).json(projects);
  } catch (err) {
    console.error(`오류:${err}`);
    res.status(500).json({ error: '서버 오류' });
  };
};

// 프로젝트 여러개 가져오기
// sid와 space_id가 일치하는 모든 프로젝트 반환
export const getProjects: RequestHandler = async (req, res) => {
  try {
    const sid: number = parseInt(req.params.sid, 10);
    const user: string = req.userRole.user;
    // UserRole 테이블에서 권한 검증
    if (!(await checkUserInSpace(user, sid))) {
      res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
      return;
    };

    const projects: Project[] = await getProjectsQuery(sid);
    if (projects.length === 0) {
      res.status(404).json({ error: '해당 space_id의 프로젝트가 없습니다.' });
      return;
    }
    res.status(200).json(projects);
  } catch (err) {
    console.error(`오류:${err}`);
    res.status(500).json({ error: '서버 오류' });
  };
};

// 프로젝트 하나 가져오기
// pid와 일치하는 프로젝트를 가져옴
export const getProject: RequestHandler = async (req, res) => {
  try {
    const sid: number = parseInt(req.params.sid, 10);
    const user: string = req.userRole.user;
    // UserRole 테이블에서 권한 검증
    if (!(await checkUserInSpace(user, sid))) {
      res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
      return;
    };

    const pid: number = parseInt(req.params.pid, 10);
    const projects: Project[] = (await getProjectQuery(pid)) as Project[];
    if (projects.length === 0) {
      res.status(404).json({ error: '해당하는 데이터가 없습니다.' });
      return;
    };
    res.status(200).json(projects);
  } catch (err) {
    console.error(`오류:${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};

// 프로젝트 생성
// space_id(params), pname, description을 받아서 DB에 새 프로젝트 데이터 생성, space_id와 pname이 모두 일치하는 데이터(&&)는 생성 불가.
export const newProject: RequestHandler = async (req, res) => {
  try {
  const sid: number = parseInt(req.params.sid, 10);
  const user: string = req.userRole.user;
  // UserRole 테이블에서 권한 검증
  if (!(await checkUserInSpace(user, sid))) {
    res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
    return;
  };

  const pname: string = req.body.pname;
  const desc: string = req.body.description;
      
  // 데이터 조회
  const result = (await newProjectQuery(pname, desc, sid));
    if(result.affectedRows === 0){
      res.status(400).json({ error: '이미 존재하는 pname과 space_id 조합입니다.' });
      return;
    };
    const insertId = result.insertId;

    res.status(201).json({
      pid: insertId,
      pname,
      description: desc
    });
  } catch (err) {
    console.error(`데이터 조회 오류: ${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};

// PUT
// 프로젝트 정보 수정
//  pid와 일치하는 데이터의 pname과 desc값을 수정, space 안에 중복되는 pname이 있다면 수정 불가
export const modifyProject: RequestHandler = async (req, res) => {
  try {
    const sid: number = parseInt(req.params.sid, 10);
    const pid: number = parseInt(req.params.pid, 10);
    const pname: string = req.body.pname;
    const desc: string = req.body.description;
    const user: string = req.userRole.user;
    // UserRole 테이블에서 권한 검증
    if (!(await checkUserInSpace(user, sid))) {
      res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
      return;
    };

    const result: ResultSetHeader = (await modifyProjectQuery(pname, desc, pid, sid)) as ResultSetHeader;

    if(result.affectedRows === 0){
      res.status(400).json({ error: '이미 존재하는 pname과 space_id 조합입니다.' });
      return;
    };
    
    res.status(200).json({
      pid,
      pname,
      description: desc
    });

  } catch (err) {
    console.error(`데이터 조회 오류: ${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};

// DELETE
// 프로젝트 삭제
// pid와 일치하는 프로젝트 데이터 삭제
export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const sid: number = parseInt(req.params.sid, 10);
    const user: string = req.userRole.user;
    // UserRole 테이블에서 권한 검증
    if (!(await checkUserInSpace(user, sid))) {
      res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
      return;
    };
    
    const pid: number = parseInt(req.params.pid, 10);
    const result: ResultSetHeader = (await deleteProjectQuery(pid)) as ResultSetHeader;

    // 삭제된 데이터가 없다면 에러 처리
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '해당 ID의 프로젝트를 찾을 수 없습니다.' });
      return;
    };

    res.status(200).json({ message: '데이터가 삭제되었습니다.' });

  } catch (err) {
    console.error(`데이터 조회 오류: ${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};