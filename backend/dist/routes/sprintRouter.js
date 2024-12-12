"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// sprintRouter.ts
const express_1 = __importDefault(require("express"));
const sprintController_1 = require("../controller/sprintController");
const router = express_1.default.Router();
router.get('/all', sprintController_1.getAllSprints); // 전체 스프린트 호출
router.get('/project/:projectid', sprintController_1.getSprint); // 특정 프로젝트 스프린트 호출 라우트
router.put('/:spid/status', sprintController_1.updateSprintStatus); // 상태 변경 라우트
router.post('/createSprint/:projectid', sprintController_1.InsertSprint); // 스프린트 삽입 라우트
router.put('/modifiySprint', sprintController_1.ModifiySprint); // 스프린트 수정 라우트
router.delete('/deletesprint/:spid', sprintController_1.DeleteSprint); // 스프린트 삭제 라우트
exports.default = router;
