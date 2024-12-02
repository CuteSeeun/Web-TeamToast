import express from 'express';
import { checkToken } from '../middlewares/authMiddleware';
import { getCurrentSpace, getMySpaces, selectSpace, spaceList } from '../controller/spaceController';
import { setTemporaryUser } from '../middlewares/temporaryAuthMiddleware';



const router = express.Router();

router.use(setTemporaryUser);
// 모든 스페이스 라우트에서 토큰 체크 
// router.use(checkToken);

router.post('/create',spaceList); // 스페이스 생성
router.get('/my-spaces',getMySpaces); // 스페이스 목록 조회
router.get('/current', getCurrentSpace); // 현재 스페이스 ID 조회
router.post('/select', selectSpace); // 현재 스페이스 선택

export default router;
