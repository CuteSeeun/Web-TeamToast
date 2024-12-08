"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRole = exports.removeMember = exports.updateRole = exports.getTeamMembers = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spaceId = Number(req.query.spaceId);
    if (!spaceId) {
        res.status(400).json({ message: "Missing spaceId" });
        return;
    }
    try {
        const [members] = yield dbpool_1.default.execute(`SELECT u.uname AS name, u.email, ur.role
       FROM UserRole ur
       JOIN User u ON ur.user = u.email
       WHERE ur.space_id = ?`, [spaceId]);
        res.status(200).json(members);
    }
    catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ message: "Failed to fetch team members" });
    }
});
exports.getTeamMembers = getTeamMembers;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spaceId, email, role } = req.body;
    if (!spaceId || !email || !role) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const [result] = yield dbpool_1.default.execute(`UPDATE UserRole SET role = ? WHERE user = ? AND space_id = ?`, [role, email, spaceId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "No matching user found" });
            return;
        }
        res.status(200).json({ message: "Role updated successfully" });
    }
    catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Failed to update role" });
    }
});
exports.updateRole = updateRole;
const removeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spaceId, email } = req.body;
    if (!spaceId || !email) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const [result] = yield dbpool_1.default.execute(`DELETE FROM UserRole WHERE user = ? AND space_id = ?`, [email, spaceId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "No matching user found to remove" });
            return;
        }
        res.status(200).json({ message: "Member removed successfully" });
    }
    catch (error) {
        console.error("Error removing team member:", error);
        res.status(500).json({ message: "Failed to remove team member" });
    }
});
exports.removeMember = removeMember;
// 권한 변경 후 롤 다시 가져오는 로직
const getUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    if (!email) {
        res.status(400).json({ message: '이메일이 없습니다.' });
        return;
    }
    try {
        // query =< execute 같은 기능 인데 execute가 상위호환느낌이다.
        // 앞으로 execute만 쓰자
        const [result] = yield dbpool_1.default.execute(`select role from UserRole where user = ? and space_id = (select sid from Space order by last_accessed_at desc limit 1)`, [email]);
        if (!result.length) {
            res.status(404).json({ message: "Role not found for the user" });
            return;
        }
        res.status(200).json({ role: result[0].role });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "롤 가져오기 실패" });
    }
});
exports.getUserRole = getUserRole;
