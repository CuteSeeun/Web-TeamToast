// sprintRouter.ts
import express, { Router } from 'express';
import { getSprint, InsertSprint, updateSprintStatus } from '../controller/sprintController';

const router: Router = express.Router();

router.get('/:projectid', getSprint);
router.put('/:spid/status', updateSprintStatus); // 상태 변경 라우트
router.post('/createSprint', InsertSprint);

export default router;
