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
exports.checkEmail = exports.getInfo = exports.login = exports.join = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbpool_1 = __importDefault(require("../config/dbpool")); // 기존 db 연결 모듈 사용
// 회원가입 함수
const join = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, userpw, tel } = req.body;
    const connection = yield dbpool_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const hashPw = yield bcrypt_1.default.hash(userpw, 10);
        // 사용자 정보 저장
        const [userResult] = yield connection.query('INSERT INTO User(uname, email, passwd, tel) VALUES (?, ?, ?, ?)', [name, email, hashPw, tel]);
        yield connection.commit();
        res.status(201).json({ message: '회원가입 성공' });
    }
    catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ message: '회원가입 실패' });
        yield connection.rollback();
    }
    finally {
        connection.release();
    }
});
exports.join = join;
// 로그인 함수
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { useremail, userpw } = req.body;
    try {
        const [rows] = yield dbpool_1.default.query('SELECT * FROM User WHERE email = ?', [useremail]);
        if (rows.length === 0) {
            res.status(401).json({ message: '사용자 없음' });
            return;
        }
        const user = rows[0];
        console.log('DB에서 가져온 사용자:', user);
        const isPw = yield bcrypt_1.default.compare(userpw, user.passwd);
        if (!isPw) {
            res.status(401).json({ message: '비밀번호 틀림' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ uid: user.uid, uname: user.uname }, 'secretKey', { expiresIn: '1h' });
        // 리프레시 토큰 사용하려면 두번째 토큰 생성 (추후 예정)
        // const token2 = jwt.sign(
        //   { uid: user.uid, uname: user.uname },
        //   'secretKey',
        //   { expiresIn: '1h' }
        // );
        res.json({
            message: '로그인 성공',
            token,
            user: {
                uid: user.uid,
                uname: user.uname,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '로그인 중 오류 발생' });
    }
});
exports.login = login;
//----------------------------------------------------------------------------------------
// 사용자 정보 조회 (토큰 검증) 함수 // 새로고침
const getInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: '토큰이 없습니다.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'secretKey');
        const [rows] = yield dbpool_1.default.query('SELECT uid, uname, email FROM User WHERE uid = ?', [decoded.uid]);
        if (rows.length === 0) {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            return;
        }
        const user = rows[0];
        res.json({ user });
    }
    catch (error) {
        console.error('토큰 검증 오류:', error);
        res.status(401).json({ message: '유효하지 않은 토큰' });
    }
});
exports.getInfo = getInfo;
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const [result] = yield dbpool_1.default.query('SELECT * FROM User WHERE email = ?', [email]);
        res.json({ isAvailable: result.length === 0 });
    }
    catch (error) {
        console.error('이메일 중복 확인 오류:', error);
        res.status(500).json({ isAvailable: false });
    }
});
exports.checkEmail = checkEmail;
