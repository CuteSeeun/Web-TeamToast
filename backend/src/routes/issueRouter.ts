// issueRouter.ts
import express, { Router } from 'express';
import { getBacklogIssue, updateIssueSprint } from '../controller/issueController';

const router: Router = express.Router();

router.get('/backlog/:projectid', getBacklogIssue);
router.put('/:issueid', updateIssueSprint); 

export default router;
