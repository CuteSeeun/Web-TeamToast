// 2024-11-26 한채경
// issueRouter.ts

import express from 'express';
import { getIssues, newIssue } from '../controller/issueController';
import { validatePid } from '../middlewares/idMiddleware';
import { setTemporaryUser } from '../middlewares/temporaryAuthMiddleware';
import { checkToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 임시 유저 정보, 로그인 구현 시 아래 주석 풀고 위 삭제
router.use(setTemporaryUser);
// router.use(checkToken);

router.get('/all/:sid/:pid', validatePid, getIssues);
router.post('/new/:sid/:pid', validatePid, newIssue);

export default router;