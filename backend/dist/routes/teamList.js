"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamController_1 = require("../controller/teamController");
const router = (0, express_1.Router)();
// 팀원 목록 조회
router.get("/members", teamController_1.getTeamMembers);
// 팀원 권한 변경
router.put("/update-role", teamController_1.updateRole);
// 팀원 삭제
router.post("/remove", teamController_1.removeMember);
exports.default = router;
