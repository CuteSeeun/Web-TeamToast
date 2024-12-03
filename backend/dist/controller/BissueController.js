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
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sprintId = parseInt(req.params.issueid, 10);
    const projectId = parseInt(req.params.projectid, 10);
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
