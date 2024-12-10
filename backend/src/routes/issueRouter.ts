// 2024-11-26 한채경
// issueRouter.ts

import express from 'express';
import { getIssues, newIssue } from '../controller/issueController';
import { validatePid } from '../middlewares/idMiddleware';
import { checkToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(checkToken);

router.get('/all/:pid', validatePid, getIssues);
router.post('/new/:pid', validatePid, newIssue);

export default router;