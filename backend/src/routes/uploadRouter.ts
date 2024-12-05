// 2024-12-03 한채경
// uploadRouter.ts

import express, { Router } from 'express';
import upload from '../middlewares/uploadMiddleware';
import { uploadFiles, getDownloadUrl } from '../controller/uploadController';

const router: Router = express.Router();

router.post('/upload', upload.array('files', 5), uploadFiles);

// 다운로드 URL 생성
router.get('/download', getDownloadUrl);

export default router;