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
exports.inviteUser = exports.getSpaceLimit = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 특정 space_id에 해당하는 스페이스의 limit 수와 현 멤버 수 조회 및 반환
const getSpaceDetails = (space_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [spaceData] = yield dbpool_1.default.execute("SELECT `limit` FROM Subscription WHERE spaceId= ?", [space_id]);
    if (spaceData.length === 0) {
        throw new Error("해당 스페이스가 존재하지 않습니다.");
    }
    const [currentMembers] = yield dbpool_1.default.execute("SELECT COUNT(*) AS memberCount FROM UserRole WHERE space_id = ?", [space_id]);
    return {
        limit: spaceData[0].limit,
        memberCount: currentMembers[0].memberCount,
    };
});
// 클라이언트에서 요청한 남은 초대 가능 인원 수 정보 제공
const getSpaceLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spaceId = Number(req.query.space_id);
    if (isNaN(spaceId) || spaceId <= 0) {
        res.status(400).json({ message: "유효하지 않은 스페이스 ID입니다." });
        return;
    }
    try {
        const { limit, memberCount } = yield getSpaceDetails(spaceId);
        const remainingInvites = limit - memberCount;
        res.status(200).json({
            limit,
            remaining: remainingInvites,
        });
    }
    catch (error) {
        console.error("초대 가능한 인원 정보 가져오기 중 오류 발생:", error);
        res.status(500).json({
            message: "초대 가능한 인원 정보를 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.getSpaceLimit = getSpaceLimit;
// 사용자 초대 함수
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, space_id, role } = req.body;
    const spaceId = Number(space_id);
    if (isNaN(spaceId) || spaceId <= 0) {
        res.status(400).json({ message: "유효하지 않은 스페이스 ID입니다." });
        return;
    }
    if (!email || !role) {
        res.status(400).json({ message: "모든 필드를 입력하세요." });
        return;
    }
    try {
        const { limit, memberCount } = yield getSpaceDetails(spaceId);
        if (memberCount >= limit) {
            res.status(403).json({
                message: `현재 초대 가능한 최대 인원은 ${limit}명입니다. 추가 인원 초대를 원하시면 결제를 진행해 주세요.`,
            });
            return;
        }
        // User 테이블에서 uname 가져오기
        const [user] = yield dbpool_1.default.execute("SELECT uname FROM `User` WHERE email = ?", [email]);
        if (user.length === 0) {
            res.status(409).json({
                message: "초대할 사용자가 아직 TeamToast에 가입하지 않았습니다. 해당 사용자를 초대하려면 TeamToast에 먼저 회원가입을 완료해야 합니다.",
            });
            return;
        }
        const uname = user[0].uname; // 사용자 이름 가져오기
        // UserRole 테이블에 이미 등록된 사용자 확인
        const [existingRole] = yield dbpool_1.default.execute("SELECT * FROM `UserRole` WHERE `user` = ? AND `space_id` = ?", [email, spaceId]);
        if (existingRole.length > 0) {
            res.status(409).json({ message: "이미 초대된 사용자입니다." });
            return;
        }
        // UserRole 테이블에 데이터 삽입 (uname 포함)
        yield dbpool_1.default.execute("INSERT INTO `UserRole` (`role`, `user`, `space_id`, `uname`) VALUES (?, ?, ?, ?)", [role, email, spaceId, uname]);
        res.status(200).json({ message: "사용자가 성공적으로 초대되었습니다.",
            member: { name: uname, email, role },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("초대 처리 중 오류 발생:", error.message);
        }
        else {
            console.error("초대 처리 중 알 수 없는 오류 발생:", error);
        }
        res.status(500).json({ message: "사용자 초대 중 오류가 발생했습니다." });
    }
});
exports.inviteUser = inviteUser;
// // 이메일 가져와서 이름 끄집어냄
// export const checkName = async(req:Request , res:Response) =>{
//   const {email} = req.body;
// }
