"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTemporaryUser2 = void 0;
const setTemporaryUser2 = (req, res, next) => {
    // 임시로 설정된 사용자 정보
    req.user = {
        uid: 2, // 사용자 ID
        email: 'jane.smith@example.com', // 사용자 이메일
        uname: 'Jane Smith', // 사용자 이름
    };
    next();
};
exports.setTemporaryUser2 = setTemporaryUser2;
