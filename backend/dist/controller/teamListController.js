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
exports.removeMember = exports.updateRole = exports.getTeamMembers = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getTeamMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spaceId } = req.query;
    if (!spaceId) {
        res.status(400).json({ message: "Missing spaceId" });
        return;
    }
    try {
        const [members] = yield dbpool_1.default.execute(`SELECT ur.urid AS id, u.uname AS name, u.email, ur.role
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