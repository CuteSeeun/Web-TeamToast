"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteUserController_1 = require("../controller/inviteUserController");
const router = (0, express_1.Router)();
router.post("/invite", inviteUserController_1.inviteUser); //구독 상태 및 카드 정보 조회
exports.default = router;
