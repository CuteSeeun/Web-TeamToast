// 2024-11-25 한채경
// projectRouter.ts

import express from 'express';
import { getAllProjects, getProjects, getProject, newProject, modifyProject, deleteProject } from '../controller/projectController.js';
import { validateSid, validatePid } from '../middlewares/idMiddleware.js';
import { validateProjectFields } from '../middlewares/checkProjectInputs.js';
// 임시 사용자 정보
import { setTemporaryUser } from '../middlewares/temporaryAuthMiddleware.js';
// 사용자 권한 확인 (임시)
import { checkUserRole } from '../middlewares/checkUserRole.js';
import { setTemporaryUser2 } from '../middlewares/setTemporaryUser.js';

const router = express.Router();

router.use(setTemporaryUser); // 임시 사용자 role 정보
router.use(setTemporaryUser2); // 임시 사용자 정보

router.get('/all', getAllProjects); // 모든 프로젝트 정보(admin)
router.get('/all/:sid', validateSid, getProjects); // sid에 해당하는 모든 프로젝트 정보
router.get('/:sid/:pid', validatePid, getProject); // pid에 해당하는 프로젝트 정보
router.post('/new/:sid', validateProjectFields, validateSid, checkUserRole, newProject); // 새 프로젝트 생성
router.put('/modify/:sid/:pid', validateProjectFields, validateSid, validatePid, checkUserRole, modifyProject); // 프로젝트 수정
router.delete('/delete/:sid/:pid', validatePid, checkUserRole, deleteProject); // 프로젝트 삭제

export default router;