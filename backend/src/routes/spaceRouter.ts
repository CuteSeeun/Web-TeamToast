import express from 'express';
import { checkToken } from '../middlewares/authMiddleware';
import { createSpace, deleteSpace, getCurrentSpace, getMySpaces, getSpaceByUuid, selectSpace, updateSpace } from '../controller/spaceController';


const router = express.Router();


router.post('/create',checkToken,createSpace); // 스페이스 생성
router.get('/my-spaces',checkToken,getMySpaces); // 스페이스 목록 조회
router.get('/current-space',checkToken,getCurrentSpace); // 현재 스페이스 ID 조회
router.post('/select-space',checkToken,selectSpace); // 현재 스페이스 선택
router.get('/get-space/:uuid',checkToken,getSpaceByUuid) // 프로젝트헤더 스페이스 목록띄우기
router.put('/update-space/:uuid',checkToken,updateSpace); // 스페이스 이름 수정
router.delete('/delete-space/:uuid',checkToken,deleteSpace); // 스페이스 삭제

export default router;
