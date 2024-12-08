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
exports.deleteSpace = exports.updateSpace = exports.selectSpace = exports.getCurrentSpace = exports.getMySpaces = exports.createSpace = exports.getSpaceByUuid = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 프로젝트헤더에서도  값 불러옴
const getSpaceByUuid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { sid } = req.params;
        const [result] = yield connection.query(`select sid as spaceId, sname as spaceName
            from Space where sid = ?
            `, [sid]);
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
        // const spaceUuid = uuidv4();
        const createEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!createEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }
        yield connection.beginTransaction();
        // 중복 확인
        const [exitSpace] = yield connection.query(`SELECT * FROM Space WHERE sname = ?`, [sname]);
        if (exitSpace.length > 0) {
            res.status(400).json({ message: '이미 존재하는 스페이스입니다.' });
            return;
        }
        // Space 테이블에 추가
        const [spaceResult] = yield connection.query(`INSERT INTO Space (sname) VALUES (?)`, [sname]);
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
            // spaceUuid,
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
        const [space] = yield connection.query(`SELECT s.sid AS spaceId, s.sname AS spaceName, ur.role
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
        const [result] = yield connection.query(`SELECT s.sid AS spaceId, s.sname AS spaceName
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
        const { spaceId } = req.body;
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail || !spaceId) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }
        // UUID로 Space를 선택하고 마지막 접근 시간 업데이트
        const [result] = yield connection.query(`UPDATE Space SET last_accessed_at = NOW() WHERE sid = ?`, [spaceId]);
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
//스페이스 이름 수정
const updateSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        // const {sid} = req.body;
        const { sname, sid } = req.body;
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail || !sid || !sname) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }
        // 해당 스페이스가 유효한지 확인
        const [spaceCheck] = yield connection.query(`select * from Space where sid = ? `, [sid]);
        if (!spaceCheck.length) {
            res.status(404).json({ message: '스페이스를 찾을 수 없습니다.' });
            return;
        }
        //스페이스 이름 업데이트
        const [updateResult] = yield connection.query(`update Space set sname = ? where sid = ?`, [sname, sid]);
        if (updateResult.affectedRows === 0) {
            res.status(400).json({ message: '스페이스 이름 수정 실패' });
            return;
        }
        res.status(200).json({ message: '스페이스 이름 수정 성공' });
    }
    catch (error) {
        console.error('스페이스 이름 수정 실패 : ', error);
        res.status(500).json({ message: '서버 오류' });
    }
    finally {
        connection.release();
    }
});
exports.updateSpace = updateSpace;
//스페이스 삭제
const deleteSpace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = yield dbpool_1.default.getConnection();
    try {
        const { sid } = req.params; // uuid 가져옴
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail || !sid) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }
        //해당 스페이스가 유효한지 확인
        const [spaceCheck] = yield connection.query(`select * from Space where sid = ? `, [sid]);
        if (!spaceCheck.length) {
            res.status(404).json({ message: '스페이스를 찾을 수 없습니다.' });
            return;
        }
        //트랜잭션 시작
        yield connection.beginTransaction();
        // 관련된 유저롤 삭제
        yield connection.query(`delete from UserRole where space_id = (select sid from Space where sid = ?)`, [sid]);
        // 관련된 구독 삭제
        yield connection.query(`delete from Subscription where spaceId = (select sid from Space where sid = ?)`, [sid]);
        //스페이스 삭제
        const [deleteResult] = yield connection.query(`delete from Space where sid = ?`, [sid]);
        if (deleteResult.affectedRows === 0) {
            yield connection.rollback();
            res.status(400).json({ message: '스페이스 삭제 실패' });
            return;
        }
        yield connection.commit(); // 저장
        res.status(200).json({ message: '스페이스 삭제 성공' });
    }
    catch (error) {
        yield connection.rollback(); // 오류나면 롤백함
        console.error('스페이스 삭제 실패 :', error);
        res.status(500).json({ message: '서버 오류' });
    }
    finally {
        connection.release();
    }
});
exports.deleteSpace = deleteSpace;
