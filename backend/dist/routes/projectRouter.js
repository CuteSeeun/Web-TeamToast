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
// 임시 유저 정보, 로그인 구현 시 아래 주석 풀고 위 삭제
// router.use(setTemporaryUser);
router.use(authMiddleware_js_1.checkToken);
router.get('/all', projectController_1.getAllProjects);
router.get('/all/:sid', idMiddleware_js_1.validateSid, projectController_1.getProjects); //특정 sid와 연결된 모든 프로젝트 데이터를 가져오는 api
router.get('/:sid/:pid', idMiddleware_js_1.validatePid, projectController_1.getProject);
router.get('/find/one/:pid', idMiddleware_js_1.validatePid, projectController_1.getSidByPid);
router.post('/new/:sid', checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, projectController_1.newProject);
router.put('/modify/:sid/:pid', checkProjectInputs_js_1.validateProjectFields, idMiddleware_js_1.validateSid, idMiddleware_js_1.validatePid, projectController_1.modifyProject);
router.delete('/delete/:sid/:pid', idMiddleware_js_1.validatePid, projectController_1.deleteProject);
router.get('/projects/:uuid', authMiddleware_js_1.checkToken, projectController_1.getProjectsByUUID);
exports.default = router;
