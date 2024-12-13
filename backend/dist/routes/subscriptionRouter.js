"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionController_1 = require("../controller/subscriptionController");
const router = express_1.default.Router();
// 최고 관리자 확인
router.get("/check-admin", subscriptionController_1.checkAdmin);
//userEmail, subId 조회
router.get("/user/details", subscriptionController_1.fetchUserDetails);
// 구독 정보 조회
router.get("/details", subscriptionController_1.getSubscriptionData);
// 무료 요금제로 변경
router.post("/change-to-free", subscriptionController_1.changeToFreePlan);
//유료 요금제로 변경
router.post("/change-to-paid", subscriptionController_1.upgradeToPaidPlan);
//추가 인원 변경
router.post("/updatedLimit", subscriptionController_1.updatedLimit);
//추가 인원 변경
router.post("/updatedLimit", subscriptionController_1.updatedLimit);
exports.default = router;
