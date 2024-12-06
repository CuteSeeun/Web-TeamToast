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
exports.inviteUser = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, space_id, role } = req.body;
    if (!email || !space_id || !role) {
        return res
            .status(400)
            .json({ message: "email, space_id, role are required" });
    }
    try {
        // Step 1: 회원 여부 확인
        const [user] = yield dbpool_1.default.execute("SELECT uid FROM user WHERE email = ?", [email]);
        if (!user || user.length === 0) {
            // 비회원일 경우
            return res.status(404).json({
                message: "User not found. Please ask the user to sign up for TeamToast.",
            });
        }
        const user_id = user[0].uid;
        // Step 2: 이미 해당 스페이스에 초대된 상태인지 확인
        const [existingRole] = yield dbpool_1.default.execute("SELECT * FROM userRole WHERE user = ? AND space_id = ?", [email, space_id]);
        if (existingRole.length > 0) {
            return res.status(400).json({
                message: "User is already a member of this space.",
            });
        }
        // Step 3: 초대 처리 (userRole에 추가)
        yield dbpool_1.default.execute("INSERT INTO userRole (user, space_id, role) VALUES (?, ?, ?)", [email, space_id, role]);
        res.status(200).json({
            message: `User with email ${email} has been successfully invited to space ID ${space_id}.`,
        });
    }
    catch (error) {
        console.error("Error inviting user:", error.message);
        res.status(500).json({ message: "Failed to invite user" });
    }
});
exports.inviteUser = inviteUser;
