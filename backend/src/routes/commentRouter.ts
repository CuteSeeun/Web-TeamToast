import express from 'express';
import { deleteComment, editComment, getCommentsByIssueId, insertComment } from '../controller/commentController';
const router = express.Router();

router.get('/:isid', getCommentsByIssueId);
router.post('/', insertComment);
router.put('/edit/:cid', editComment);
router.delete('/delete/:cid', deleteComment);

export default router;
