"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controller/subscriptionController");
const router = (0, express_1.Router)();
router.get("/details", subscriptionController_1.getSubscriptionData); //구독 상태 및 카드 정보 조회
exports.default = router;
