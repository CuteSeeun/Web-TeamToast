import express, { Router } from 'express';
import { getIssue } from '../controller/issueController';

const router: Router = express.Router();

router.get('/:projectid/:issueid', getIssue);

export default router;
