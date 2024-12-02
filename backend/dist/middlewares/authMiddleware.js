"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: '토큰이 없습니다.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'accessSecretKey');
        console.log('Decoded token:', decoded);
        //req.user 에 토큰에서 가져온 정보 저장함
        req.user = {
            uid: decoded.uid,
            uname: decoded.uname,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        console.error('토큰 검증 오류:', error);
        // 구체적인 에러 메시지 제공
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                message: '유효하지 않은 토큰입니다.',
                error: error.message
            });
        }
        else {
            res.status(401).json({ message: '토큰 검증 중 오류가 발생했습니다.' });
        }
    }
};
exports.checkToken = checkToken;
