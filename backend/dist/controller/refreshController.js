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
exports.reAccessToken = exports.RefreshToken = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.body;
    try {
        //리프레시 토큰 생성
        const refreshToken = jsonwebtoken_1.default.sign({}, 'refreshSecretKey', { expiresIn: '15d' });
        //db 저장
        yield dbpool_1.default.query(`insert into RefreshTokens (user_id, refresh_token, expires_at) values (?, ?, DATE_ADD(NOW(), INTERVAL 15 DAY))`, [uid, refreshToken]);
        res.status(201).json({ refreshToken });
    }
    catch (error) {
        console.error('리프레시 토큰 발급 중 오류 : ', error);
        res.status(500).json({ message: '리프레시 토큰 발급 실패' });
    }
});
exports.RefreshToken = RefreshToken;
const reAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {refreshToken} = req.body;
    var _a;
    try {
        const userId = req.body.uid || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.uid); // 미들웨어 또는 클라이언트에서 uid 가져옴
        if (!userId) {
            res.status(401).json({ message: '사용자 정보가 없습니다.' });
            return;
        }
        const [rows] = yield dbpool_1.default.query('select refresh_token from RefreshTokens where user_id = ?', [userId]);
        if (!rows.length) {
            res.status(403).json({ message: '유효하지않은 리프레시 토큰' });
            return;
        }
        const refreshToken = rows[0].refresh_token;
        try {
            jsonwebtoken_1.default.verify(refreshToken, 'refreshSecretKey');
        }
        catch (error) {
            console.error('리프레시 토큰 검증 실패 :', error);
            res.status(403).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
            return;
        }
        const [userInfo] = yield dbpool_1.default.query('SELECT uid, uname, email FROM User WHERE uid = ?', [userId]);
        const accessToken = jsonwebtoken_1.default.sign({
            uid: userId,
            uname: userInfo[0].uname,
            email: userInfo[0].email
        }, 'accessSecretKey', { expiresIn: '15m' });
        res.status(200).json({
            accessToken,
            user: {
                uid: userInfo[0].uid,
                uname: userInfo[0].uname,
                email: userInfo[0].email
            }
        });
    }
    catch (error) {
        console.error('리프레시 토큰 검증 실패:', error);
        res.status(403).json({ message: '리프레시 토큰 검증 실패' });
    }
});
exports.reAccessToken = reAccessToken;
