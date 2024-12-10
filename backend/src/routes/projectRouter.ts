// 2024-11-25 한채경
// projectRouter.ts

import express from 'express';
import { getAllProjects, getProjects, getProject, newProject, modifyProject, deleteProject, getProjectsByUUID, getSidByPid } from '../controller/projectController';
import { validateSid, validatePid } from '../middlewares/idMiddleware';
import { validateProjectFields } from '../middlewares/checkProjectInputs';
import { checkToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(checkToken);

router.get('/all', getAllProjects);
router.get('/all/:sid', validateSid, getProjects); //특정 sid와 연결된 모든 프로젝트 데이터를 가져오는 api
router.get('/:sid/:pid', validatePid, getProject);
router.get('/find/one/:pid', validatePid, getSidByPid);
router.post('/new/:sid', validateProjectFields, validateSid, newProject);
router.put('/modify/:sid/:pid', validateProjectFields, validateSid, validatePid, modifyProject);
router.delete('/delete/:sid/:pid', validatePid, deleteProject);

router.get('/projects/:uuid', checkToken, getProjectsByUUID);

export default router;