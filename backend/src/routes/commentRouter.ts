import express from 'express';
import { getCommentsByIssueId, insertComment } from '../controller/commentController';
const router = express.Router();

router.get('/:isid', getCommentsByIssueId);
router.post('/', insertComment);

export default router;
