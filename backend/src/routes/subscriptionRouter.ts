import { Router } from "express";
import { getSubscriptionData } from "../controller/subscriptionController";

const router = Router();

router.get("/details", getSubscriptionData); //구독 상태 및 카드 정보 조회

export default router;
