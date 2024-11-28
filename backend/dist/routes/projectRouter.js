"use strict";
// 2024-11-25 한채경
// projectRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_js_1 = require("../controller/projectController.js");
const idMiddleware_js_1 = require("../middlewares/idMiddleware.js");
const checkProjectInputs_js_1 = require("../middlewares/checkProjectInputs.js");
// 임시 사용자 정보
const temporaryAuthMiddleware_js_1 = require("../middlewares/temporaryAuthMiddleware.js");
// 사용자 권한 확인 (임시)
const checkUserRole_js_1 = require("../middlewares/checkUserRole.js");
const router = express_1.default.Router();
router.use(temporaryAuthMiddleware_js_1.setTemporaryUser); // 임시 사용자 정보
router.get('/all', projectController_js_1.getAllProjects); // 모든 프로젝트 정보(admin)
router.get('/all/:sid', idMiddleware_js_1.validateSid, projectController_js_1.getProjects); // sid에 해당하는 모든 프로젝트 정보
router.get('/:sid/:pid', idMiddleware_js_1.validatePid, projectController_js_1.getProject); // pid에 해당하는 프로젝트 정보
router.post('/new/:sid', checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, checkUserRole_js_1.checkUserRole, projectController_js_1.newProject); // 새 프로젝트 생성
router.put('/modify/:sid/:pid', checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, idMiddleware_js_1.validatePid, checkUserRole_js_1.checkUserRole, projectController_js_1.modifyProject); // 프로젝트 수정
router.delete('/delete/:sid/:pid', idMiddleware_js_1.validatePid, checkUserRole_js_1.checkUserRole, projectController_js_1.deleteProject); // 프로젝트 삭제
exports.default = router;
