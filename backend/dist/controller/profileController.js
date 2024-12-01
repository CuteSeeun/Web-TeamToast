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
exports.updateProfile = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 프로필 업데이트 함수
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //jwt 토큰 추출
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // 토큰이 없는 경우 인증 오류 반환
    if (!token) {
        return res.status(401).json({
            success: false,
            message: '인증 필요'
        });
    }
    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jsonwebtoken_1.default.verify(token, 'secretKey');
        const { uname, email } = req.body;
        // 사용자 정보 업데이트
        const query = `
        update User set uname = ? , email = ? where uid = ?
        `;
        // 쿼리 실행 및 결과 확인
        const [result] = yield dbpool_1.default.query(query, [uname, email, decoded.uid]);
        if (result.affectedRows > 0) {
            // 업데이트 성공 시 최신 사용자 정보 조회
            const [row] = yield dbpool_1.default.query('SELECT uid, uname, email FROM User WHERE uid = ?', [decoded.uid]);
            res.json({
                success: true,
                message: '프로필이 성공적으로 수정되었습니다.',
                user: row // 업데이트 유저 정보
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.'
            });
        }
    }
    catch (error) {
        console.error('프로필 수정 에러 : ', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});
exports.updateProfile = updateProfile;
