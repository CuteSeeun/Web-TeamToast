"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

// SingleissueRouter.ts
const express_1 = __importDefault(require("express"));
const BissueController_1 = require("../controller/BissueController");
const router = express_1.default.Router();
router.get('/project/:projectId', BissueController_1.getIssuesByProjectId);
router.get('/:projectid/:issueid', BissueController_1.getIssue);
router.get('/detail/:projectid/:isid', BissueController_1.getIssueById);
router.put('/updateDetail/:isid', BissueController_1.updateIssueDetail);

exports.default = router;
