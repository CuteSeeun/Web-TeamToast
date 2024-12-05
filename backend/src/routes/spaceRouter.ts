import express from 'express';
import { checkToken } from '../middlewares/authMiddleware';
import { createSpace, getCurrentSpace, getMySpaces, getSpaceByUuid, selectSpace } from '../controller/spaceController';


const router = express.Router();


router.post('/create',checkToken,createSpace); // 스페이스 생성
router.get('/my-spaces',checkToken,getMySpaces); // 스페이스 목록 조회
router.get('/current-space',checkToken,getCurrentSpace); // 현재 스페이스 ID 조회
router.post('/select-space',checkToken,selectSpace); // 현재 스페이스 선택
router.get('/get-space/:uuid',checkToken,getSpaceByUuid) // 프로젝트헤더 스페이스 목록띄우기

export default router;
