"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BissueController_1 = require("../controller/BissueController");
const router = express_1.default.Router();
router.get('/:projectid/:issueid', BissueController_1.getIssue);
exports.default = router;
