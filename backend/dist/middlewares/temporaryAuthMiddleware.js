"use strict";
// 2024-11-25 한채경
// temporaryAuthMiddleware.ts
// 임시 사용자 데이터 (로그인 구현 시 삭제)
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTemporaryUser = void 0;
const setTemporaryUser = (req, res, next) => {
    // 임시 사용자 정보 설정
    req.user = {
        uid: 11,
        uname: '한채경',
        email: 'gch2505@gmail.com',
    };
    next();
};
exports.setTemporaryUser = setTemporaryUser;
