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
        res.status(400).json({ message: "모든 필드를 입력하세요." });
        return;
    }
    try {
        // 사용자 확인
        const [user] = yield dbpool_1.default.execute("SELECT * FROM User WHERE email = ?", [
            email,
        ]);
        if (!user.length) {
            res.status(404).json({
                message: "사용자가 존재하지 않습니다. 회원가입이 필요합니다.",
            });
            return;
        }
        // 이미 초대된 사용자인지 확인
        const [existingRole] = yield dbpool_1.default.execute("SELECT * FROM UserRole WHERE user = ? AND space_id = ?", [email, space_id]);
        if (existingRole.length > 0) {
            res.status(409).json({ message: "이미 초대된 사용자입니다." });
            return;
        }
        // 새로운 초대 생성
        yield dbpool_1.default.execute("INSERT INTO UserRole (role, user, space_id) VALUES (?, ?, ?)", [role, email, space_id]);
        res.status(200).json({ message: "사용자가 성공적으로 초대되었습니다." });
    }
    catch (error) {
        console.error("초대 처리 중 오류 발생:", error);
        res.status(500).json({ message: "사용자 초대 중 오류가 발생했습니다." });
    }
});
exports.inviteUser = inviteUser;
exports.default = exports.inviteUser;
