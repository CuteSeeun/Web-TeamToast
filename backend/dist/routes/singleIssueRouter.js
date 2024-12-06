"use strict";
// BuserRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issueController_1 = require("../controller/issueController");
const router = express_1.default.Router();
router.get('/:projectid/:issueid', issueController_1.getIssue);
exports.default = router;
