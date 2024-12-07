"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const spaceController_1 = require("../controller/spaceController");
const router = express_1.default.Router();
router.post('/create', authMiddleware_1.checkToken, spaceController_1.createSpace); // 스페이스 생성
router.get('/my-spaces', authMiddleware_1.checkToken, spaceController_1.getMySpaces); // 스페이스 목록 조회
router.get('/current-space', authMiddleware_1.checkToken, spaceController_1.getCurrentSpace); // 현재 스페이스 ID 조회
router.post('/select-space', authMiddleware_1.checkToken, spaceController_1.selectSpace); // 현재 스페이스 선택
router.get('/get-space/:uuid', authMiddleware_1.checkToken, spaceController_1.getSpaceByUuid); // 프로젝트헤더 스페이스 목록띄우기
router.put('/update-space/:uuid', authMiddleware_1.checkToken, spaceController_1.updateSpace); // 스페이스 이름 수정
router.delete('/delete-space/:uuid', authMiddleware_1.checkToken, spaceController_1.deleteSpace); // 스페이스 삭제
exports.default = router;
