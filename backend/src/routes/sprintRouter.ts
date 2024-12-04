// sprintRouter.ts
import express, { Router } from 'express';
import { DeleteSprint, getSprint, InsertSprint, ModifiySprint, updateSprintStatus } from '../controller/sprintController';

const router: Router = express.Router();

router.get('/:projectid', getSprint); // 전체 스프린트 호출 라우트
router.put('/:spid/status', updateSprintStatus); // 상태 변경 라우트
router.post('/createSprint', InsertSprint); // 스프린트 삽입 라우트
router.put('/modifiySprint', ModifiySprint); //스프린트 수정 라우트
router.delete('/deletesprint/:spid', DeleteSprint); // 스프린트 삭제 라우트

export default router;
