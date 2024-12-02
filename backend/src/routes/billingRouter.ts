import { Router } from "express";
import {
  createBillingKey,
  processScheduledPayment,
  updateCardInfo,
} from "../controller/billingController";

const router = Router();

router.post("/complete", createBillingKey); //빌링키 발급 요청
router.post("/scheduled", processScheduledPayment); //자동결제 요청
router.post("/card-update", updateCardInfo); // 활성 카드 정보 가져오기

export default router;
