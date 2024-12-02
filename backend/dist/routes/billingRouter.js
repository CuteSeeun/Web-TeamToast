"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billingController_1 = require("../controller/billingController");
const router = (0, express_1.Router)();
router.post("/complete", billingController_1.createBillingKey); //빌링키 발급 요청
router.post("/scheduled", billingController_1.processScheduledPayment); //자동결제 요청
router.post("/card-update", billingController_1.updateCardInfo); // 활성 카드 정보 가져오기
exports.default = router;
