// 
import express, { Router } from 'express';
import { getIssue, getIssueById } from '../controller/BissueController';

const router: Router = express.Router();

router.get('/:projectid/:issueid', getIssue);
router.get('/detail/:projectid/:isid', getIssueById);

export default router;
