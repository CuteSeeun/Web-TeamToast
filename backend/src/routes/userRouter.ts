import express, { Router } from 'express';
import { getProjectManagers } from '../controller/userController';

const router: Router = express.Router();

router.get('/project/:projectid/managers', getProjectManagers);

export default router;
