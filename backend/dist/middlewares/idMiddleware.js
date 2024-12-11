"use strict";
// 2024-11-25 한채경
// idMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePid = exports.validateSid = void 0;
// ID 검증 공통 함수
const validateId = (paramName) => {
    return (req, res, next) => {
        const id = parseInt(req.params[paramName], 10);
        if (isNaN(id)) {
            res.status(400).json({ error: `유효하지 않은 ${paramName}입니다.` });
            return;
        }
        req.params[paramName] = String(id); // 숫자로 변환 후 저장
        next();
    };
};
// 각각의 ID 검증 미들웨어 생성
exports.validateSid = validateId('sid');
exports.validatePid = validateId('pid');
