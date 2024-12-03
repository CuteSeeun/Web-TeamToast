"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// sprintRouter.ts
const express_1 = __importDefault(require("express"));
const sprintController_1 = require("../controller/sprintController");
const router = express_1.default.Router();
router.get('/:projectid', sprintController_1.getSprint);
router.put('/:spid/status', sprintController_1.updateSprintStatus); // 상태 변경 라우트
router.post('/createSprint', sprintController_1.InsertSprint);
exports.default = router;
