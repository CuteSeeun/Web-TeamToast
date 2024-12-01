"use strict";
// 2024-11-25 한채경
// projectController.ts
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
exports.deleteProject = exports.modifyProject = exports.newProject = exports.getProject = exports.getProjects = exports.getAllProjects = void 0;
const projectModel_js_1 = require("../models/projectModel.js");
const dbHelpers_js_1 = require("../utils/dbHelpers.js"); // UserRole 테이블에서 리퀘스트를 요청한 user가 sid에 권한이 있는지 확인하기 위한 헬퍼함수
// 모든 프로젝트 가져오기 (admin)
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 사이트 관리자만 쓸 수 있음 (로직, 권한 설정 필요)
        const projects = yield (0, projectModel_js_1.getAllProjectsQuery)();
        if (projects.length === 0) {
            res.status(404).json({ error: '프로젝트가 없습니다.' });
            return;
        }
        res.status(200).json(projects);
    }
    catch (err) {
        console.error(`오류:${err}`);
        res.status(500).json({ error: '서버 오류' });
    }
    ;
});
exports.getAllProjects = getAllProjects;
// 프로젝트 여러개 가져오기
// sid와 space_id가 일치하는 모든 프로젝트 반환
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sid = parseInt(req.params.sid, 10);
        // const user: string = req.userRole.user; // 채경
        // UserRole 테이블에서 권한 검증
        // if (!(await checkUserInSpace(user, sid))) { // 채경
        if (!(yield (0, dbHelpers_js_1.checkUserInSpace)(req.user.uid.toString(), sid))) { // 현진
            res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
            return;
        }
        ;
        const projects = yield (0, projectModel_js_1.getProjectsQuery)(sid);
        if (projects.length === 0) {
            res.status(404).json({ error: '해당 space_id의 프로젝트가 없습니다.' });
            return;
        }
        res.status(200).json(projects);
    }
    catch (err) {
        console.error(`오류:${err}`);
        res.status(500).json({ error: '서버 오류' });
    }
    ;
});
exports.getProjects = getProjects;
// 프로젝트 하나 가져오기
// pid와 일치하는 프로젝트를 가져옴
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sid = parseInt(req.params.sid, 10);
        // const user: string = req.userRole.user; // 채경
        // UserRole 테이블에서 권한 검증
        // if (!(await checkUserInSpace(user, sid))) { // 채경
        if (!(yield (0, dbHelpers_js_1.checkUserInSpace)(req.user.uid.toString(), sid))) { // 현진
            res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
            return;
        }
        ;
        const pid = parseInt(req.params.pid, 10);
        const projects = (yield (0, projectModel_js_1.getProjectQuery)(pid));
        if (projects.length === 0) {
            res.status(404).json({ error: '해당하는 데이터가 없습니다.' });
            return;
        }
        ;
        res.status(200).json(projects);
    }
    catch (err) {
        console.error(`오류:${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.getProject = getProject;
// 프로젝트 생성
// space_id(params), pname, description을 받아서 DB에 새 프로젝트 데이터 생성, space_id와 pname이 모두 일치하는 데이터(&&)는 생성 불가.
const newProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sid = parseInt(req.params.sid, 10);
        // const user: string = req.userRole.user; // 채경
        // UserRole 테이블에서 권한 검증
        // if (!(await checkUserInSpace(user, sid))) { // 채경
        if (!(yield (0, dbHelpers_js_1.checkUserInSpace)(req.user.uid.toString(), sid))) { // 현진
            res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
            return;
        }
        ;
        const pname = req.body.pname;
        const desc = req.body.description;
        // 데이터 조회
        const result = (yield (0, projectModel_js_1.newProjectQuery)(pname, desc, sid));
        if (result.affectedRows === 0) {
            res.status(400).json({ error: '이미 존재하는 pname과 space_id 조합입니다.' });
            return;
        }
        ;
        const insertId = result.insertId;
        res.status(201).json({
            pid: insertId,
            pname,
            description: desc
        });
    }
    catch (err) {
        console.error(`데이터 조회 오류: ${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.newProject = newProject;
// PUT
// 프로젝트 정보 수정
//  pid와 일치하는 데이터의 pname과 desc값을 수정, space 안에 중복되는 pname이 있다면 수정 불가
const modifyProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sid = parseInt(req.params.sid, 10);
        const pid = parseInt(req.params.pid, 10);
        const pname = req.body.pname;
        const desc = req.body.description;
        // const user: string = req.userRole.user; // 채경
        // UserRole 테이블에서 권한 검증
        // if (!(await checkUserInSpace(user, sid))) { // 채경
        if (!(yield (0, dbHelpers_js_1.checkUserInSpace)(req.user.uid.toString(), sid))) {
            res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
            return;
        }
        ;
        const result = (yield (0, projectModel_js_1.modifyProjectQuery)(pname, desc, pid, sid));
        if (result.affectedRows === 0) {
            res.status(400).json({ error: '이미 존재하는 pname과 space_id 조합입니다.' });
            return;
        }
        ;
        res.status(200).json({
            pid,
            pname,
            description: desc
        });
    }
    catch (err) {
        console.error(`데이터 조회 오류: ${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.modifyProject = modifyProject;
// DELETE
// 프로젝트 삭제
// pid와 일치하는 프로젝트 데이터 삭제
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sid = parseInt(req.params.sid, 10);
        // const user: string = req.userRole.user; // 채경
        // UserRole 테이블에서 권한 검증
        // if (!(await checkUserInSpace(user, sid))) { // 채경
        if (!(yield (0, dbHelpers_js_1.checkUserInSpace)(req.user.uid.toString(), sid))) { // 현진
            res.status(403).json({ message: '해당 스페이스의 접근 권한이 없습니다.' });
            return;
        }
        ;
        const pid = parseInt(req.params.pid, 10);
        const result = (yield (0, projectModel_js_1.deleteProjectQuery)(pid));
        // 삭제된 데이터가 없다면 에러 처리
        if (result.affectedRows === 0) {
            res.status(404).json({ error: '해당 ID의 프로젝트를 찾을 수 없습니다.' });
            return;
        }
        ;
        res.status(200).json({ message: '데이터가 삭제되었습니다.' });
    }
    catch (err) {
        console.error(`데이터 조회 오류: ${err}`);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    ;
});
exports.deleteProject = deleteProject;
