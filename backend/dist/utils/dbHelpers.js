"use strict";
// dbHelpers.ts
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
exports.checkSprintExists = exports.checkProjectExists = exports.checkUserInProjectAndSpace = exports.checkUserInSpace = void 0;
// DB 연결이 필요한 헬퍼 함수들
const dbUtils_1 = require("./dbUtils");
//현진
const checkUserInSpace = (userId, sid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId)
        return false;
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        // 먼저 User 테이블에서 uid로 email 찾기
        const userQuery = `SELECT email FROM User WHERE uid = ?`;
        const [userRows] = yield connection.query(userQuery, [userId]);
        if (!userRows || userRows.length === 0)
            return false;
        const userEmail = userRows[0].email;
        // UserRole 테이블에서 email과 space_id로 권한 확인
        const roleQuery = `
      SELECT COUNT(*) as count 
      FROM UserRole 
      WHERE user = ? AND space_id = ?;
    `;
        const [rows] = yield connection.query(roleQuery, [userEmail, sid]);
        return rows[0].count > 0;
    }));
});
exports.checkUserInSpace = checkUserInSpace;
//------------------------------------------------------------------------------------------------
// 이슈를 생성하는 user가 space와 project에 소속되어 있는지 검증
const checkUserInProjectAndSpace = (uid, pid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!uid)
        return false;
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const userQuery = `SELECT email FROM User WHERE uid = ?`;
        const [userRows] = yield connection.query(userQuery, [uid]);
        if (!userRows || userRows.length === 0)
            return false;
        const userEmail = userRows[0].email;
        const roleQuery = `
      SELECT COUNT(*) as count 
      FROM UserRole ur
      WHERE ur.user = ? AND ur.space_id = (
        SELECT p.space_id 
        FROM Project p 
        WHERE p.pid = ?
      );
    `;
        const [rows] = yield connection.query(roleQuery, [userEmail, pid]);
        return rows[0].count > 0;
    }));
});
exports.checkUserInProjectAndSpace = checkUserInProjectAndSpace;
// Project 테이블에서 project_id 검증
const checkProjectExists = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'SELECT COUNT(*) as count FROM Project WHERE pid = ?';
        const [rows] = yield connection.query(query, [projectId]);
        return rows[0].count > 0;
    }));
});
exports.checkProjectExists = checkProjectExists;
// Sprint 테이블에서 sprint_id 검증
const checkSprintExists = (sprintId) => __awaiter(void 0, void 0, void 0, function* () {
    if (sprintId === null)
        return true;
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'SELECT COUNT(*) as count FROM Sprint WHERE spid = ?';
        const [rows] = yield connection.query(query, [sprintId]);
        return rows[0].count > 0;
    }));
});
exports.checkSprintExists = checkSprintExists;
