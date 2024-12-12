import express from "express";
import {
  checkAdmin,
  getSubscriptionData,
  changeToFreePlan,
  upgradeToPaidPlan,
  updatedLimit,
  fetchUserDetails,
} from "../controller/subscriptionController";

const router = express.Router();

// 최고 관리자 확인
router.get("/check-admin", checkAdmin);

//userEmail, subId 조회
router.get("/user/details", fetchUserDetails);

// 구독 정보 조회
router.get("/details", getSubscriptionData);

// 무료 요금제로 변경
router.post("/change-to-free", changeToFreePlan);

//유료 요금제로 변경
router.post("/change-to-paid", upgradeToPaidPlan);

//추가 인원 변경
router.post("/updatedLimit", updatedLimit);

export default router;
