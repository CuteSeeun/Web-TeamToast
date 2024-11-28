import express, { Router } from 'express';
import { getSprint, updateSprintStatus } from '../controller/sprintController';

const router: Router = express.Router();

router.get('/:projectid', getSprint);
router.put('/:spid/status', updateSprintStatus); // 상태 변경 라우트 추가

export default router;
