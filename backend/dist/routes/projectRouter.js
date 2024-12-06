"use strict";
// 2024-11-25 한채경
// projectRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controller/projectController");
const idMiddleware_js_1 = require("../middlewares/idMiddleware.js");
const checkProjectInputs_js_1 = require("../middlewares/checkProjectInputs.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = express_1.default.Router();
// router.use(setTemporaryUser); // 임시 사용자 정보
// router.get('/all', getAllProjects); // 모든 프로젝트 정보(admin)
// router.get('/all/:sid', validateSid, getProjects); // sid에 해당하는 모든 프로젝트 정보
// router.get('/:sid/:pid', validatePid, getProject); // pid에 해당하는 프로젝트 정보
// router.post('/new/:sid', validateProjectFields, validateSid, checkUserRole, newProject); // 새 프로젝트 생성
// router.put('/modify/:sid/:pid', validateProjectFields, validateSid, validatePid, checkUserRole, modifyProject); // 프로젝트 수정
// router.delete('/delete/:sid/:pid', validatePid, checkUserRole, deleteProject); // 프로젝트 삭제
// 현진
router.get('/all', authMiddleware_js_1.checkToken, projectController_1.getAllProjects);
router.get('/all/:sid', authMiddleware_js_1.checkToken, idMiddleware_js_1.validateSid, projectController_1.getProjects);
router.get('/:sid/:pid', authMiddleware_js_1.checkToken, idMiddleware_js_1.validatePid, projectController_1.getProject);
router.post('/new/:sid', authMiddleware_js_1.checkToken, checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, projectController_1.newProject);
router.put('/modify/:sid/:pid', authMiddleware_js_1.checkToken, checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, idMiddleware_js_1.validatePid, projectController_1.modifyProject);
router.delete('/delete/:sid/:pid', authMiddleware_js_1.checkToken, idMiddleware_js_1.validatePid, projectController_1.deleteProject);
router.get('/projects/:uuid', authMiddleware_js_1.checkToken, projectController_1.getProjectsByUUID);
exports.default = router;
