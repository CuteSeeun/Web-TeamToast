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
exports.getSubscriptionData = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getSubscriptionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, spaceId } = req.query;
    if (!userEmail || !spaceId) {
        res.status(400).json({ message: "Missing userEmail or spaceId" });
        return;
    }
    try {
        // Subscription 상태 조회
        const [subscriptionResult] = yield dbpool_1.default.execute(`SELECT plan, \`limit\` FROM Subscription WHERE sId = ? LIMIT 1`, [spaceId]);
        const subscription = subscriptionResult[0]; // 첫 번째 요소 추출
        if (!subscription) {
            res.status(404).json({ message: "No subscription found." });
            return;
        }
        console.log("Subscription data:", subscription);
        // Credit 상태에서 카드 정보 조회
        const [creditResult] = yield dbpool_1.default.execute(`SELECT cardNumber FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`, [userEmail]);
        const credit = creditResult[0]; // 첫 번째 요소 추출
        console.log("Credit data:", credit);
        // 응답
        res.status(200).json({
            plan: subscription.plan,
            limit: subscription.limit || 10, // 기본 제한 인원
            cardNumber: (credit === null || credit === void 0 ? void 0 : credit.cardNumber) || null, // 카드 정보 없을 시 null
        });
    }
    catch (error) {
        console.error("Error fetching subscription data:", error.message);
        res.status(500).json({ message: "Failed to fetch subscription data" });
    }
});
exports.getSubscriptionData = getSubscriptionData;
