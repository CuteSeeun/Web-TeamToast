import { Router } from "express";
import {
  getTeamMembers,
  updateRole,
  removeMember,
} from "../controller/teamListController";

import { inviteUser } from "../controller/inviteUserController";

const router = Router();

//팀원 초대
router.post("/invite", inviteUser); //구독 상태 및 카드 정보 조회

// 팀원 목록 조회
router.get("/members", getTeamMembers);

// 팀원 권한 변경
router.put("/update-role", updateRole);

// 팀원 삭제
router.post("/remove", removeMember);

export default router;
