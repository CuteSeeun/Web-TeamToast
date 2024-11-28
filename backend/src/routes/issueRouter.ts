// 2024-11-26 한채경
// issueRouter.ts

import express from 'express';
import { getIssues, newIssue } from '../controller/issueController';
import { validatePid } from '../middlewares/idMiddleware';
// 임시 사용자 정보
import { setTemporaryUser } from '../middlewares/temporaryAuthMiddleware.js';
// 사용자 권한 확인 (임시)
import { checkUserRole } from '../middlewares/checkUserRole.js';

const router = express.Router();

router.use(setTemporaryUser); // 임시 사용자 정보

router.get('/all/:pid', validatePid, getIssues);
router.post('/new/:pid', validatePid, checkUserRole, newIssue);

export default router;