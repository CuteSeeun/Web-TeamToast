"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamListController_1 = require("../controller/teamListController");
const inviteUserController_1 = require("../controller/inviteUserController");
const router = (0, express_1.Router)();
// 팀원 초대
router.post("/invite", inviteUserController_1.inviteUser);
// 초대 가능한 인원 확인
router.get("/invite/limit", inviteUserController_1.getSpaceLimit);
// 팀원 목록 조회
router.get("/members", teamListController_1.getTeamMembers);
// 팀원 역할 변경
router.put("/update-role", teamListController_1.updateRole);
// 팀원 삭제 (DELETE 사용)
router.delete("/remove", teamListController_1.removeMember);
// 권한 수정된거 role 다시 보내기
router.get('/user-role', teamListController_1.getUserRole);
exports.default = router;
