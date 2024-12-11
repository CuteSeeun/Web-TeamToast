"use strict";
// 2024-11-25 한채경
// projectModel.ts
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
exports.getProjectsByUUIDQuery = exports.deleteProjectQuery = exports.modifyProjectQuery = exports.newProjectQuery = exports.getProjectQuery = exports.getProjectsQuery = exports.getAllProjectsQuery = void 0;
const dbUtils_1 = require("../utils/dbUtils");
const dbpool_1 = __importDefault(require("../config/dbpool")); // 데이터베이스 연결
// 모든 프로젝트 가져오기
const getAllProjectsQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'SELECT * FROM Project;';
        const [rows] = yield connection.query(query);
        const projects = rows;
        return projects;
    }));
});
exports.getAllProjectsQuery = getAllProjectsQuery;
// sid가 일치하는 프로젝트 모두 가져오기
const getProjectsQuery = (sid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
      SELECT * 
      FROM Project
      WHERE space_id = ?;
    `;
        const [rows] = yield connection.query(query, [sid]);
        const projects = rows;
        return projects;
    }));
});
exports.getProjectsQuery = getProjectsQuery;
// pid가 일치하는 프로젝트 하나 가져오기
const getProjectQuery = (pid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'SELECT * FROM Project WHERE pid = ?;';
        const [rows] = yield connection.query(query, [pid]);
        const projects = rows;
        return projects;
    }));
});
exports.getProjectQuery = getProjectQuery;
// 프로젝트 생성
const newProjectQuery = (pname, desc, sid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
      INSERT INTO Project (pname, description, space_id)
      SELECT ?, ?, ?
      FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM Project WHERE pname = ? AND space_id = ?
      );
    `;
        const [result] = yield connection.query(query, [pname, desc, sid, pname, sid]);
        return result;
    }));
});
exports.newProjectQuery = newProjectQuery;
// 프로젝트 정보 수정
const modifyProjectQuery = (pname, desc, pid, sid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
      UPDATE Project 
      SET pname = ?, description = ? 
      WHERE pid = ? 
      AND NOT EXISTS (
        SELECT 1 FROM Project WHERE pname = ? AND space_id = ? AND pid != ?
      );
    `;
        const [result] = yield connection.query(query, [pname, desc, pid, pname, sid, pid]);
        return result;
    }));
});
exports.modifyProjectQuery = modifyProjectQuery;
// 프로젝트 삭제
const deleteProjectQuery = (pid) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, dbUtils_1.executeQuery)((connection) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'DELETE FROM Project WHERE pid = ?;';
        const [result] = yield connection.query(query, [pid]);
        return result;
    }));
});
exports.deleteProjectQuery = deleteProjectQuery;
const getProjectsByUUIDQuery = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        const [rows] = yield connection.query(`
        SELECT p.* 
        FROM Project p
        JOIN Space s ON p.space_id = s.sid
        WHERE s.uuid = ?
        `, // space_id와 uuid를 조인하여 프로젝트 검색
        [uuid]);
        console.log('Fetched projects:', rows);
        return rows;
    }
    finally {
        connection.release();
    }
});
exports.getProjectsByUUIDQuery = getProjectsByUUIDQuery;
