"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alarmController_1 = require("../controller/alarmController");
const router = (0, express_1.Router)();
//알림 가져오기
router.get("/notifications", alarmController_1.getIssueAlarm);
//이슈 생성 또는 업데이트
router.post('/markAsRead', alarmController_1.NotificationRead);
exports.default = router;
