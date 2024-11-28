"use strict";
// 2024-11-25 한채경
// checkUserRole.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = void 0;
const checkUserRole = (req, res, next) => {
    try {
        if (!req.userRole) {
            res.status(401).json({ error: '로그인이 필요합니다.' });
            return;
        }
        // 임시 사용자 데이터인 temporaryAuthMiddleware.ts 안의 req.userRole에서 role 확인
        const { role } = req.userRole;
        // manager, top_manager가 아니면 튕김
        if (role !== 'manager' && role !== 'top_manager') {
            res.status(403).json({ error: '프로젝트를 생성, 수정 또는 삭제할 권한이 없습니다.' });
            return;
        }
        next(); // 권한이 올바른 경우 다음 핸들러 호출
    }
    catch (error) {
        console.error('권한 확인 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};
exports.checkUserRole = checkUserRole;
