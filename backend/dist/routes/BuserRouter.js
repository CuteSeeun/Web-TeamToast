"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// BuserRouter.ts
const express_1 = __importDefault(require("express"));
const BuserController_1 = require("../controller/BuserController");
const router = express_1.default.Router();
router.get('/project/:projectid/managers', BuserController_1.getProjectManagers);
exports.default = router;
