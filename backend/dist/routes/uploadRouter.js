"use strict";
// 2024-12-03 한채경
// uploadRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const uploadController_1 = require("../controller/uploadController");
const router = express_1.default.Router();
router.post('/upload', uploadMiddleware_1.default.array('files', 5), uploadController_1.uploadFiles);
// 다운로드 URL 생성
router.get('/download', uploadController_1.getDownloadUrl);
exports.default = router;
