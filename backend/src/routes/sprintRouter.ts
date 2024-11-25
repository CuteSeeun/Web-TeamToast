import express, { Router } from 'express';
import { getSprint } from '../controller/sprintController';

const router: Router = express.Router();

router.get('/:projectid', (req, res, next) => {
    console.log('Request received at /sprint/:projectid');
    next();
}, getSprint);

export default router;
