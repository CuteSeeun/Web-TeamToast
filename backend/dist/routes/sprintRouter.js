"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sprintController_1 = require("../controller/sprintController");
const router = express_1.default.Router();
router.get('/:projectid', (req, res, next) => {
    console.log('Request received at /sprint/:projectid');
    next();
}, sprintController_1.getSprint);
exports.default = router;
