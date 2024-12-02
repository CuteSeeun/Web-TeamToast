"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIssueSprint = exports.getBacklogIssue = exports.getIssue = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool")); // 디폴트 익스포트 가져오기
const getIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sprintId = parseInt(req.params.issueid, 10); // parseInt 사용
    const projectId = parseInt(req.params.projectid, 10); // parseInt 사용
    const issueId = parseInt(req.params.issueid, 10);
    // if (isNaN(sprintId) || isNaN(projectId)) { // 유효성 검사
    //     res.status(400).json({ error: 'Invalid project ID or sprint ID' });
    //     return;
    // }
    try {
        const query = `
            SELECT 
                Issue.isid, Issue.title, Issue.detail, Issue.type, 
                Issue.status, Issue.priority, Issue.sprint_id, Issue.project_id, 
                User.uname AS manager, Issue.created_by, Issue.file
            FROM Issue
            JOIN User ON Issue.manager = User.email
            WHERE Issue.project_id = ? AND Issue.sprint_id = ?;
        `;
        const [rows] = yield dbpool_1.default.query(query, [projectId, sprintId]); // 타입 지정
        res.json(rows);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: '이슈 호출 오류', details: error.message });
        }
        else {
            res.status(500).json({ error: '이슈 호출 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
});
exports.getIssue = getIssue;
const getBacklogIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectid, 10);
    if (isNaN(projectId)) {
        console.error('Invalid project ID:', req.params.projectid);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
    }
    try {
        const query = `
            SELECT
                Issue.isid, Issue.title, Issue.type, Issue.priority, Issue.status, User.uname AS manager
            FROM Issue
            JOIN User ON Issue.manager = User.email
            WHERE Issue.project_id = ? AND Issue.sprint_id IS NULL;
        `;
        const [rows] = yield dbpool_1.default.query(query, [projectId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: '백로그 이슈 호출 오류' });
    }
});
exports.getBacklogIssue = getBacklogIssue;
const updateIssueSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issueId = Number(req.params.issueid); // req.params.issueid로 수정
    const { sprint_id } = req.body;
    try {
        const [result] = yield dbpool_1.default.query('UPDATE Issue SET sprint_id = ? WHERE isid = ?', [sprint_id, issueId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Issue sprint_id updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Issue not found' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.updateIssueSprint = updateIssueSprint;
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIssue = exports.getIssues = void 0;
// 모델
const issueModel_1 = require("../models/issueModel");
// 유틸 / 헬퍼 함수
const helpers_1 = require("../utils/helpers");
const dbHelpers_1 = require("../utils/dbHelpers");
const issueTypes_1 = require("../types/issueTypes");
const issueTypes_2 = require("../types/issueTypes");
const issueTypes_3 = require("../types/issueTypes");
// import { CustomRequest } from '../types/index';
// pid에 해당하는 이슈 전체 받아오기
const getIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pid = parseInt(req.params.pid);
        const issues = yield (0, issueModel_1.getIssuesQuery)(pid);
        if (issues.length === 0) {
            res.status(200).json([]); // 빈 배열 반환
            return;
        }
        ;
        res.status(200).json(issues);
    }
    catch (err) {
        console.error(`데이터 조회 오류:${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.getIssues = getIssues;
// 새 이슈 생성하기
const newIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.userRole) {
        res.status(400).json({ error: '로그인하지 않은 사용자입니다.' });
        return;
    }
    ;
    const pid = parseInt(req.params.pid, 10); // 현재 속한 프로젝트의 pid
    const URSid = req.userRole.space_id; // UserRole에 저장된 space_id (임시 / 로직 보고 변경 필요)
    if (!req.body.title || !pid) {
        res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        return;
    }
    ;
    try {
        // 프로젝트 존재 여부 확인
        const projectExists = yield (0, dbHelpers_1.checkProjectExists)(pid);
        if (!projectExists) {
            res.status(400).json({ error: `Project ID ${pid}는 존재하지 않습니다.` });
            return;
        }
        ;
        // UserRole에서 user가 해당 스페이스에 권한이 있는지, 해당 프로젝트가 존재하는지 검증
        const user = req.userRole.user; // UserRole에 저장된 user(email 형식)
        if (!(yield (0, dbHelpers_1.checkUserInProjectAndSpace)(user, pid))) {
            res.status(403).json({ error: `사용자 ${user}가 해당 프로젝트에 권한이 없습니다.` });
            return;
        }
        ;
        const validStatuses = {
            Backlog: issueTypes_2.Status.Backlog,
            Working: issueTypes_2.Status.Working,
            Dev: issueTypes_2.Status.Dev,
            QA: issueTypes_2.Status.QA,
        };
        const status = (0, helpers_1.validateAndMap)(req.body.status, validStatuses, 'Status');
        // Type 값 검증 및 변환
        const validTypes = {
            process: issueTypes_3.Type.process,
            bug: issueTypes_3.Type.bug,
        };
        const type = (0, helpers_1.validateAndMap)(req.body.type, validTypes, 'Type');
        // Priority 값 검증 및 변환
        const validPriority = {
            high: issueTypes_1.Priority.high,
            normal: issueTypes_1.Priority.normal,
            low: issueTypes_1.Priority.low,
        };
        const priority = (0, helpers_1.validateAndMap)(req.body.priority, validPriority, 'Priority');
        // Sprint ID 처리
        const sprintId = (_a = req.body.sprint_id) !== null && _a !== void 0 ? _a : null;
        const sprintExists = yield (0, dbHelpers_1.checkSprintExists)(sprintId);
        if (!sprintExists) {
            res.status(400).json({ error: `Sprint ID ${sprintId}는 유효하지 않습니다.` });
            return;
        }
        ;
        // Manager가 해당 space에 소속해 있는지 UserRole에서 검증
        const managerEmail = req.body.manager;
        if (!(yield (0, dbHelpers_1.checkUserInSpace)(managerEmail, URSid))) {
            res.status(403).json({ message: `${managerEmail}는 스페이스 접근 권한이 없습니다.` });
            return;
        }
        ;
        // Created by가 해당 space에 소속해 있는지 UserRole에서 검증
        const createdByEmail = req.body.created_by;
        if (!(yield (0, dbHelpers_1.checkUserInSpace)(createdByEmail, URSid))) {
            res.status(403).json({ message: `${createdByEmail}는 스페이스 접근 권한이 없습니다.` });
            return;
        }
        ;
        const issue = {
            title: req.body.title,
            detail: req.body.detail || null,
            type: type || issueTypes_3.Type.process,
            status: status || issueTypes_2.Status.Backlog, // 변환된 status 사용
            sprint_id: sprintId,
            project_id: pid,
            manager: managerEmail || null,
            created_by: createdByEmail || null,
            file: req.body.file ? JSON.stringify(req.body.file) : null,
            priority: priority || issueTypes_1.Priority.normal,
        };
        const result = yield (0, issueModel_1.newIssueQuery)(issue);
        const insertId = result.insertId;
        res.status(201).json(Object.assign({ isid: insertId }, issue));
    }
    catch (err) {
        console.error(`데이터 조회 오류: ${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.newIssue = newIssue;

