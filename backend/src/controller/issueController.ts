// 2024-11-25 한채경, 11-26 마지막 수정
// issueController.ts
// import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
// 모델
import { getIssuesQuery, newIssueQuery } from '../models/issueModel';

// 유틸 / 헬퍼 함수
import { validateAndMap, ValidMapping } from '../utils/helpers';

// DB에 데이터를 보내기 위한 타입 선언
import { Issue } from '../types/issueTypes';
import { Priority } from '../types/issueTypes';
import { Status } from '../types/issueTypes';
import { Type } from '../types/issueTypes';


// pid에 해당하는 이슈 전체 받아오기
export const getIssues = async (req: Request , res: Response, next: NextFunction) => {
  try {
    const pid: number = parseInt(req.params.pid);
    const issues: Issue[] = await getIssuesQuery(pid);
    
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
export const newIssue = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(400).json({ error: '로그인하지 않은 사용자입니다.' });
    return;
  };
  
  const pid = parseInt(req.params.pid, 10); // 현재 속한 프로젝트의 pid
  if (!req.body.title || !pid) {
    res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    return;
  };

  try {
    const sendValidationError = (res: Response, fieldName: string) => {
      res.status(400).json({ error: `유효하지 않은 ${fieldName} 값입니다.` });
    };

    // Status 값 검증 및 변환
    const validStatuses: ValidMapping<Status> = {
      백로그: Status.Backlog,
      작업중: Status.Working,
      개발완료: Status.Dev,
      QA완료: Status.QA,
    };
    const status = validateAndMap(req.body.status, validStatuses, 'Status');
    if (!status) {
      sendValidationError(res, 'Status');
      return;
    };

    // Type 값 검증 및 변환
    const validTypes: ValidMapping<Type> = {
      작업: Type.process,
      버그: Type.bug,
    };
    const type = validateAndMap(req.body.type, validTypes, 'Type');
    if (!type) {
      sendValidationError(res, 'Type');
      return;
    };

    // Priority 값 검증 및 변환
    const validPriority: ValidMapping<Priority> = {
      높음: Priority.high,
      보통: Priority.normal,
      낮음: Priority.low,
    };
    const priority = validateAndMap(req.body.priority, validPriority, 'Priority');
    if (!priority) {
      sendValidationError(res, 'Priority');
      return;
    };


    // Sprint ID 처리
    const sprintId = req.body.sprint_id ?? null;
    const managerEmail = req.body.manager;

    const issue: Issue = {
      title: req.body.title,
      detail: req.body.detail || null,
      type: type || Type.process,
      status: status || Status.Backlog, // 변환된 status 사용
      sprint_id: sprintId,
      project_id: pid,
      manager: managerEmail || null,
      // created_by: createdByEmail || null,
      file: req.body.file ? JSON.stringify(req.body.file) : null,
      priority: priority || Priority.normal,
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