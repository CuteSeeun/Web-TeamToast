"use strict";
// 2024-11-26 한채경
// issueRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issueController_1 = require("../controller/issueController");
const idMiddleware_1 = require("../middlewares/idMiddleware");
const bellalarmController_1 = require("../controller/bellalarmController");
const router = express_1.default.Router();
// router.use(setTemporaryUser); // 임시 사용자 정보
router.get('/all/:pid', idMiddleware_1.validatePid, issueController_1.getIssues);
// router.post('/new/:pid', validatePid, checkUserRole, newIssue);
router.get('/notifications', bellalarmController_1.getAlarm); // 이슈 알림
router.get('/notifications/:nid', bellalarmController_1.getProjectid); // 특정 알림의 프로젝트 ID 가져오기
exports.default = router;
