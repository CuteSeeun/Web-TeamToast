// 2024-11-25 한채경
// projectRouter.ts

import express from 'express';
import { getAllProjects, getProjects, getProject, newProject, modifyProject, deleteProject } from '../controller/projectController';
import { validateSid, validatePid } from '../middlewares/idMiddleware.js';
import { validateProjectFields } from '../middlewares/checkProjectInputs.js';
import { checkToken } from '../middlewares/authMiddleware.js';
import { setTemporaryUser } from '../middlewares/temporaryAuthMiddleware';

const router = express.Router();

router.use(setTemporaryUser);
// router.use(checkToken);

// 현진
router.get('/all', getAllProjects);
router.get('/all/:sid', validateSid, getProjects);
router.get('/:sid/:pid', validatePid, getProject);
router.post('/new/:sid', validateProjectFields, validateSid, newProject);
router.put('/modify/:sid/:pid', validateProjectFields, validateSid, validatePid, modifyProject);
router.delete('/delete/:sid/:pid', validatePid, deleteProject);

export default router;