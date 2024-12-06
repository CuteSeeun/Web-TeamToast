"use strict";
// 2024-11-25 한채경
// checkProjectInputs.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectFields = void 0;
// 프로젝트 생성/수정 인풋필드 내용 검증
const validateProjectFields = (req, res, next) => {
    const pname = req.body.pname;
    const desc = req.body.description;
    if (!pname || pname.trim() === '') {
        res.status(400).json({ error: 'pname은 필수 입력값입니다.' });
        return;
    }
    if (!desc || desc.trim() === '') {
        res.status(400).json({ error: 'desc는 필수 입력값입니다.' });
        return;
    }
    next(); // 모든 검증 통과 시 다음 핸들러 호출
};
exports.validateProjectFields = validateProjectFields;