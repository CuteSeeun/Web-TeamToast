// 2024-11-25 한채경, 11-26 마지막 수정
// issueController.ts
import { RequestHandler } from 'express';

// 모델
import { getIssuesQuery, newIssueQuery } from '../models/issueModel';

// 유틸 / 헬퍼 함수
import { validateAndMap } from '../utils/helpers';
import {
  checkProjectExists,
  checkSprintExists,
  checkUserInSpace,
  checkUserInProjectAndSpace,
} from '../utils/dbHelpers';

// DB에 데이터를 보내기 위한 타입 선언
import { Issue } from '../types/issueTypes';

// pid에 해당하는 이슈 전체 받아오기
export const getIssues: RequestHandler = async (req, res) => {
  try {
    const pid: number = parseInt(req.params.pid);
    const issues = await getIssuesQuery(pid);
    
    if (issues.length === 0) {
      res.status(200).json([]); // 빈 배열 반환
      return;
    };
    res.status(200).json(issues);
  } catch (err) {
    console.error(`데이터 조회 오류:${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};

// 새 이슈 생성하기
export const newIssue: RequestHandler = async (req, res) => {
  if (!req.userRole) {
    res.status(400).json({ error: '로그인하지 않은 사용자입니다.' });
    return;
  };
  if (!req.userRole.user) {
    console.error('사용자 정보가 누락되었습니다.');
    res.status(403).json({ error: '사용자 정보가 누락되었습니다.' });
    return;
  }

  const pid = parseInt(req.params.pid, 10); // 현재 속한 프로젝트의 pid
  const URSid = req.userRole.space_id; // UserRole에 저장된 space_id (임시 / 로직 보고 변경 필요)
  if (!req.body.title || !pid) {
    res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    return;
  };

  try {
    // 프로젝트 존재 여부 확인
    const projectExists = await checkProjectExists(pid);
    if (!projectExists) {
      res.status(400).json({ error: `Project ID ${pid}는 존재하지 않습니다.` });
      return;
    };

    // UserRole에서 user가 해당 스페이스에 권한이 있는지, 해당 프로젝트가 존재하는지 검증
    const user = req.userRole.user; // UserRole에 저장된 user(email 형식)
    if (!(await checkUserInProjectAndSpace(user, pid))) {
      res.status(403).json({ error: `사용자 ${user}가 해당 프로젝트에 권한이 없습니다.` });
      return;
    };

    // Sprint ID 처리
    const sprintId = req.body.sprint_id ?? null;
    const sprintExists = await checkSprintExists(sprintId);
    if (!sprintExists) {
      res.status(400).json({ error: `Sprint ID ${sprintId}는 유효하지 않습니다.` });
      return;
    };

    // Manager가 해당 space에 소속해 있는지 UserRole에서 검증
    const managerEmail = req.body.manager;
    if (managerEmail && !(await checkUserInSpace(managerEmail, URSid))) {
      res.status(403).json({ message: `${managerEmail}는 스페이스 접근 권한이 없습니다.` });
      return;
    }

    // Created by가 해당 space에 소속해 있는지 UserRole에서 검증
    const createdByEmail = req.body.created_by;
    if (createdByEmail && !(await checkUserInSpace(createdByEmail, URSid))) {
      res.status(403).json({ message: `${createdByEmail}는 스페이스 접근 권한이 없습니다.` });
      return;
    }

    const issue: Issue = {
      title: req.body.title,
      detail: req.body.detail || null,
      type: req.body.type,
      status: req.body.status,
      sprint_id: req.body.sprint_id || null,
      project_id: parseInt(req.params.pid, 10),
      manager: req.body.manager || null,
      created_by: req.body.created_by || null,
      file: req.body.file || null,
      priority: req.body.priority,
    };

    const result = await newIssueQuery(issue);
    const insertId = result.insertId;

    res.status(201).json({
      isid: insertId,
      ...issue,
    });
  } catch (err) {
    console.error(`데이터 조회 오류: ${err}`);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  };
};