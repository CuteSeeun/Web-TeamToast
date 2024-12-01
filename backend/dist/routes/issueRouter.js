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
// 임시 사용자 정보
const temporaryAuthMiddleware_js_1 = require("../middlewares/temporaryAuthMiddleware.js");
const router = express_1.default.Router();
router.use(temporaryAuthMiddleware_js_1.setTemporaryUser); // 임시 사용자 정보
router.get('/all/:pid', idMiddleware_1.validatePid, issueController_1.getIssues);
router.post('/new/:pid', idMiddleware_1.validatePid, issueController_1.newIssue);
exports.default = router;
