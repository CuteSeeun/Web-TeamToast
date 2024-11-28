"use strict";
// 2024-11-25 한채경, 11-26일 마지막 수정
// issueModel.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIssueQuery = exports.getIssuesQuery = void 0;
const dbUtils_1 = require("../utils/dbUtils");
// 프로젝트에 포함된 모든 이슈 가져오기
const getIssuesQuery = (pid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        // project_id가 pid인 모든 이슈 가져오는 쿼리문
        const query = `
      SELECT *
      FROM Issue
      WHERE project_id = ?;
    `;
        const [rows] = yield connection.query(query, [pid]);
        const issues = rows;
        return issues;
    }));
});
exports.getIssuesQuery = getIssuesQuery;
// 이슈 생성
const newIssueQuery = (issue) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
      INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
        const [result] = yield connection.query(query, [
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
    }));
});
exports.newIssueQuery = newIssueQuery;
