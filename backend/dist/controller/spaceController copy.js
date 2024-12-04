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
exports.selectSpace = exports.getCurrentSpace = exports.getMySpaces = exports.spaceList = exports.createSpace = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const uuid_1 = require("uuid");
const createSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { sname } = req.body;
        const spaceUuid = (0, uuid_1.v4)();
        yield connection.query(`insert into Space (sname , uuid) values (?, ?)`, [sname, spaceUuid]);
        res.status(201).json({ message: '스페이스 생성 완료', spaceUuid });
    }
    catch (error) {
        console.error('스페이스 생성 실패', error);
        res.status(500).json({ message: '스페이스 생성 실패' });
    }
    finally {
        connection.release();
    }
});
exports.createSpace = createSpace;
const spaceList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { sname } = req.body;
        const createEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!createEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        yield connection.beginTransaction();
        // 스페이스테이블에 추가
        const [spaceResult] = yield connection.query('insert into Space (sname) values (?)', [sname]);
        const spaceId = spaceResult.insertId;
        // UserRole 테이블에 생성자 권한 추가
        yield connection.query('insert into UserRole (role, user, space_id) values (?, ?, ?)', ['top_manager', createEmail, spaceId]);
        yield connection.commit();
        res.status(201).json({
            message: '스페이스 생성 성공',
            spaceId,
            spaceName: sname
        });
    }
    catch (error) {
        yield connection.rollback();
        console.error('스페이스 생성 에러 : ', error);
        res.status(500).json({ message: "스페이스 생성 실패" });
    }
    finally {
        yield connection.release();
    }
});
exports.spaceList = spaceList;
const getMySpaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        console.log('요청한 유저 이메일:', userEmail); // 유저 이메일 로깅
        if (!userEmail) {
            console.log('인증 정보 없음');
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        // 디버깅을 위한 로그 추가
        console.log('실행할 쿼리:', `
            select 
                s.sid as spaceId,
                s.sname as spaceName,
                ur.role
            from Space s join UserRole ur ON s.sid = ur.space_id
            where ur.user = ?
        `);
        console.log('Fetching spaces for user:', userEmail);
        // space 랑 userrole 테이블 조인해서 사용자의 스페이스 목록 조회함
        const [space] = yield connection.query(`
            select 
                s.sid as spaceId,
                s.sname as spaceName,
                ur.role
            from Space s join UserRole ur ON s.sid = ur.space_id
            where ur.user = ?
            `, [userEmail]);
        // 결과 확인을 위한 로그
        console.log('Query result:', space);
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
        const { uuid } = req.query; // 클라이언트로부터 UUID를 받음
        if (!userEmail || !uuid) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        // UserRole 테이블에서 현재 사용자가 마지막으로 선택한 스페이스 조회
        const [result] = yield connection.query(`SELECT sid AS spaceId, sname 
            FROM Space 
            WHERE last_accessed_at IS NOT NULL
            ORDER BY last_accessed_at DESC LIMIT 1`);
        if (!result.length) {
            res.status(404).json({ message: '현재 선택된 스페이스가 없습니다.' });
            return;
        }
        // 선택된 스페이스가 없으면 null 반환
        res.status(200).json({ spaceId: result.length ? result[0].spaceId : null, });
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
        // UUID를 사용해 Space ID 조회
        const [result] = yield connection.query(`SELECT sid AS spaceId FROM Space WHERE uuid = ?`, [uuid]);
        if (!result.length) {
            res.status(404).json({ message: '스페이스를 찾을 수 없습니다.' });
            return;
        }
        // 해당 스페이스를 마지막으로 접근한 것으로 업데이트
        yield connection.query(`UPDATE Space SET last_accessed_at = NOW() WHERE uuid = ?`, [uuid]);
        res.status(200).json({ message: '스페이스 선택 완료', spaceId: result[0].spaceId });
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
