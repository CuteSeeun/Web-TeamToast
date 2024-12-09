// BuserRouter.ts
import express, { Router } from 'express';
import { getProjectManagers } from '../controller/BuserController';

const router: Router = express.Router();

router.get('/project/:projectid/managers', getProjectManagers);

export default router;
