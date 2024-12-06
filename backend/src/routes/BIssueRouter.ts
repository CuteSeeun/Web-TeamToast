
// SingleissueRouter.ts
import express, { Router } from 'express';
import { getIssue, getIssueById, getIssuesByProjectId, updateIssueDetail } from '../controller/BissueController';

const router: Router = express.Router();

router.get('/project/:projectId', getIssuesByProjectId);
router.get('/:projectid/:issueid', getIssue);
router.get('/detail/:projectid/:isid', getIssueById);
router.put('/updateDetail/:isid', updateIssueDetail);



export default router;
