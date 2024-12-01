"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const spaceController_1 = require("../controller/spaceController");
const router = express_1.default.Router();
// 모든 스페이스 라우트에서 토큰 체크 
router.use(authMiddleware_1.checkToken);
router.post('/create', spaceController_1.spaceList); // 스페이스 생성
router.get('/my-spaces', spaceController_1.getMySpaces); // 스페이스 목록 조회
router.get('/current', spaceController_1.getCurrentSpace); // 현재 스페이스 ID 조회
router.post('/select', spaceController_1.selectSpace); // 현재 스페이스 선택
exports.default = router;
