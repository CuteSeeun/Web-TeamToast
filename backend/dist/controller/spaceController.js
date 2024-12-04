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
exports.selectSpace = exports.getCurrentSpace = exports.getMySpaces = exports.createSpace = exports.getSpaceByUuid = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const uuid_1 = require("uuid");
// 프로젝트헤더에서도  값 불러옴
const getSpaceByUuid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { uuid } = req.params;
        const [result] = yield connection.query(`select sid as spaceId, sname as spaceName, uuid
            from Space where uuid = ?
            `, [uuid]);
        if (!result.length) {
            res.status(404).json({ message: '스페이스를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('스페이스 조회 실패 : ', error);
        res.status(500).json({ message: '서버 오류' });
    }
    finally {
        connection.release();
    }
});
exports.getSpaceByUuid = getSpaceByUuid;
// 새 스페이스 생성
const createSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { sname, uname } = req.body;
        const spaceUuid = (0, uuid_1.v4)();
        const createEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!createEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        yield connection.beginTransaction();
        // Space 테이블에 추가
        const [spaceResult] = yield connection.query(`INSERT INTO Space (sname, uuid) VALUES (?, ?)`, [sname, spaceUuid]);
        const spaceId = spaceResult.insertId;
        // UserRole 테이블에 생성자 권한 추가
        yield connection.query(`INSERT INTO UserRole (role, user, space_id, uname) VALUES (?, ?, ?, ?)`, ['top_manager', createEmail, spaceId, uname]);
        // Subscription 테이블에 기본 구독 정보 추가
        yield connection.query("INSERT INTO Subscription (spaceId, email, plan, `limit`) VALUES (?, ?, ?, ?)", [spaceId, createEmail, 'basic', 10]);
        yield connection.commit();
        res.status(201).json({
            message: '스페이스 생성 성공',
            spaceId,
            spaceName: sname,
            spaceUuid,
        });
    }
    catch (error) {
        yield connection.rollback();
        console.error('스페이스 생성 에러:', error);
        res.status(500).json({ message: '스페이스 생성 실패' });
    }
    finally {
        connection.release();
    }
});
exports.createSpace = createSpace;
const getMySpaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        // UserRole을 기반으로 스페이스 목록 조회
        const [space] = yield connection.query(`SELECT s.sid AS spaceId, s.sname AS spaceName, ur.role, s.uuid
            FROM Space s 
            JOIN UserRole ur ON s.sid = ur.space_id 
            WHERE ur.user = ?`, [userEmail]);
        res.json({ space });
    }
    catch (error) {
        console.error('스페이스 목록 조회 실패 : ', error);
        res.status(500).json({ message: '스페이스 목록 조회 실패' });
    }
});
exports.getMySpaces = getMySpaces;
// 현재 스페이스 조회
const getCurrentSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }
        // UUID와 UserRole을 기준으로 Space 조회
        const [result] = yield connection.query(`SELECT s.sid AS spaceId, s.sname AS spaceName, s.uuid
             FROM Space s 
             JOIN UserRole ur ON s.sid = ur.space_id 
             WHERE ur.user = ?
             ORDER BY s.last_accessed_at DESC LIMIT 1`, [userEmail]);
        if (!result.length) {
            res.status(404).json({ message: '현재 선택된 스페이스가 없습니다.' });
            return;
        }
        res.status(200).json({
            spaceId: result[0].spaceId,
            spaceName: result[0].spaceName,
            uuid: result[0].uuid, // UUID도 반환
        });
    }
    catch (error) {
        console.error('현재 스페이스 조회 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
    finally {
        connection.release();
    }
});
exports.getCurrentSpace = getCurrentSpace;
// 스페이스 선택
const selectSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { uuid } = req.body;
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail || !uuid) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }
        // UUID로 Space를 선택하고 마지막 접근 시간 업데이트
        const [result] = yield connection.query(`UPDATE Space SET last_accessed_at = NOW() WHERE uuid = ?`, [uuid]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: '해당 스페이스를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ message: '스페이스 선택 완료' });
    }
    catch (error) {
        console.error('스페이스 선택 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
    finally {
        connection.release();
    }
});
exports.selectSpace = selectSpace;
