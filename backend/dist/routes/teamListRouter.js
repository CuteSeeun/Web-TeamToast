"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamListController_1 = require("../controller/teamListController");
const router = (0, express_1.Router)();
// 팀원 목록 조회
router.get("/members", teamListController_1.getTeamMembers);
// 팀원 권한 변경
router.put("/update-role", teamListController_1.updateRole);
// 팀원 삭제
router.post("/remove", teamListController_1.removeMember);
exports.default = router;
