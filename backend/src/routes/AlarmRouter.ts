import { Router } from "express";
import { getIssueAlarm, NotificationRead } from "../controller/alarmController";


const router = Router();

//알림 가져오기
router.get("/notifications",getIssueAlarm);

//이슈 생성 또는 업데이트
router.post('/markAsRead',NotificationRead);

export default router;