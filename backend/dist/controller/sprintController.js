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

exports.DeleteSprint = exports.ModifiySprint = exports.InsertSprint = exports.updateSprintStatus = exports.getSprint = exports.getAllSprints = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 스프린트 전체 호출 컨트롤러
const getAllSprints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {

    try {
        const [rows] = yield dbpool_1.default.query('SELECT * FROM Sprint');
        const sprints = rows;
        res.json(sprints);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('오류:', error.message);
        }
        else {
            console.error('알 수 없는 오류가 발생했습니다:', error);
        }
    }
});
exports.getAllSprints = getAllSprints;
// 스프린트 호출 컨트롤러
const getSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = Number(req.params.projectid);
    try {
        const [rows] = yield dbpool_1.default.query('SELECT * FROM Sprint WHERE project_id = ?', [projectId]);
        const sprints = rows;
        res.json(sprints);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('오류:', error.message);
        }
        else {
            console.error('알 수 없는 오류가 발생했습니다:', error);
        }
    }
});
exports.getSprint = getSprint;

// 스프린트 활성 상태 변경 컨트롤러

const updateSprintStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spid = Number(req.params.spid);
    const { status } = req.body; // ENUM 타입 적용
    try {
        const [result] = yield dbpool_1.default.query('UPDATE Sprint SET status = ? WHERE spid = ?', [status, spid]);
        if (result.affectedRows > 0) {

            res.json({ message: '스프린트 상태가 성공적으로 업데이트되었습니다.' });
        }
        else {
            res.status(404).json({ error: '스프린트를 찾을 수 없습니다.' });

        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: error.message });
        }
        else {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
});
exports.updateSprintStatus = updateSprintStatus;

// 스프린트 생성 컨트롤러
const InsertSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spname, startDate, endDate, goal, project_id } = req.body;
    if (!spname || !startDate || !endDate || !project_id) {
        res.status(400).json({ success: false, message: '필수 필드를 입력해 주세요.' });
        return;
    }
    try {
        const query = 'INSERT INTO Sprint (spname, startdate, enddate, goal, project_id) VALUES (?, ?, ?, ?, ?)';
        const values = [spname, startDate, endDate, goal, project_id];
        yield dbpool_1.default.query(query, values);
        res.status(201).json({ success: true, message: '스프린트가 성공적으로 생성되었습니다.' });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ success: false, message: '서버 에러로 인해 스프린트를 생성하지 못했습니다.', error: err.message });
    }
});
exports.InsertSprint = InsertSprint;
// 스프린트 수정 컨트롤러
const ModifiySprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spid, spname, startdate, enddate, goal, status, project_id } = req.body;
    try {
        const query = `
            UPDATE Sprint
            SET spname = ?, startdate = ?, enddate = ?, goal = ?, status = ?, project_id = ?
            WHERE spid = ?
        `;
        const values = [spname, startdate, enddate, goal, status, project_id, spid];
        yield dbpool_1.default.query(query, values);
        res.json({ success: true, message: '스프린트가 수정되었습니다.' });
    }
    catch (error) {
        console.error('스프린트를 수정하는 중 오류가 발생했습니다:', error);
        res.status(500).json({ success: false, message: '스프린트를 수정하는 중 오류가 발생했습니다.' });
    }
});
exports.ModifiySprint = ModifiySprint;
// 스프린트 삭제 컨트롤러
const DeleteSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spid } = req.params;
    try {
        const query = 'DELETE FROM Sprint WHERE spid = ?';
        yield dbpool_1.default.query(query, [spid]);
        res.json({ success: true, message: '스프린트가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('스프린트를 삭제하는 중 오류가 발생했습니다:', error);
        res.status(500).json({ success: false, message: '스프린트를 삭제하는 중 오류가 발생했습니다.' });
    }
});
exports.DeleteSprint = DeleteSprint;

