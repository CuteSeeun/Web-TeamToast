"use strict";
// SissueRouter.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BissueController_1 = require("../controller/BissueController");
const router = express_1.default.Router();
router.get('/backlog/:projectid', BissueController_1.getBacklogIssue);
router.put('/:issueid', BissueController_1.updateIssueSprint);
exports.default = router;
