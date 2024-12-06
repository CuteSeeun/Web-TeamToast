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
exports.updatedLimit = exports.upgradeToPaidPlan = exports.changeToFreePlan = exports.getSubscriptionData = exports.checkAdmin = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 최고 관리자 확인 API
const checkAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, spaceId } = req.query;
    if (!userEmail || !spaceId) {
        res.status(400).json({ message: "Missing userEmail or spaceId" });
        return;
    }
    try {
        const [adminResult] = yield dbpool_1.default.execute(`SELECT COUNT(*) as isAdmin FROM Space WHERE adminEmail = ? AND id = ?`, [userEmail, spaceId]);
        const isAdmin = adminResult[0].isAdmin > 0;
        res.status(200).json({ isAdmin });
    }
    catch (error) {
        console.error("Error checking admin status:", error.message);
        res.status(500).json({ message: "Failed to check admin status" });
    }
});
exports.checkAdmin = checkAdmin;
const getSubscriptionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, spaceId } = req.query;
    if (!userEmail || !spaceId) {
        res.status(400).json({ message: "Missing userEmail or spaceId" });
        return;
    }
    try {
        // Subscription 상태 조회
        const [subscriptionResult] = yield dbpool_1.default.execute(`SELECT plan, \`limit\` FROM Subscription WHERE spaceId = ? LIMIT 1`, [spaceId]);
        const subscription = subscriptionResult[0];
        if (!subscription) {
            res.status(404).json({ message: "No subscription found." });
            return;
        }
        // 카드 정보는 유료 플랜("team")일 경우에만 조회
        let cardNumber = null;
        if (subscription.plan === "team") {
            const [creditResult] = yield dbpool_1.default.execute(`SELECT cardNumber FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`, [userEmail]);
            const credit = creditResult[0];
            cardNumber = (credit === null || credit === void 0 ? void 0 : credit.cardNumber) || null; // 카드 정보 없을 시 null
        }
        // 응답
        res.status(200).json({
            plan: subscription.plan,
            limit: subscription.limit || 10, // 기본 제한 인원
            cardNumber, // 무료 플랜일 경우 null 반환
        });
    }
    catch (error) {
        console.error("Error fetching subscription data:", error.message);
        res.status(500).json({ message: "Failed to fetch subscription data" });
    }
});
exports.getSubscriptionData = getSubscriptionData;
//무료로 전환
const changeToFreePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { spaceId } = req.body;
    if (!spaceId) {
        res.status(400).json({ message: "Missing spaceId" });
        return;
    }
    const connection = yield dbpool_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        // `spaceId`로 `subId` 조회
        const [subIdResult] = yield connection.execute(`SELECT subId FROM Subscription WHERE spaceId = ? LIMIT 1`, [spaceId]);
        if (!subIdResult || subIdResult.length === 0) {
            throw new Error("No subscription found for the given spaceId.");
        }
        const subId = subIdResult[0].subId; // 조회된 `subId`
        // Subscription 테이블 업데이트
        const [updateSubscriptionResult] = yield connection.execute(`UPDATE Subscription
       SET plan = 'basic', \`limit\` = 10, nextBillingDate = NULL, updatedAt = NOW()
       WHERE spaceId = ?`, [spaceId]);
        if (updateSubscriptionResult.affectedRows === 0) {
            throw new Error("No subscription found to update.");
        }
        // Credit 테이블의 STATUS 업데이트 (`subId` 기준으로 업데이트)
        const [updateCreditResult] = yield connection.execute(`UPDATE Credit
       SET status = 'canceled', updatedAt = NOW()
       WHERE subId = ? AND status = 'active'`, [subId]);
        if (updateCreditResult.affectedRows === 0) {
            console.warn("No active credit records found for this subId.");
        }
        else {
            console.log("Credit table updated:", updateCreditResult);
        }
        yield connection.commit();
        res.status(200).json({ message: "무료 요금제로 변경 완료" });
    }
    catch (error) {
        console.error("Error changing to free plan:", error.message);
        if (connection) {
            yield connection.rollback();
        }
        res.status(500).json({ message: "Failed to change to free plan" });
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
});
exports.changeToFreePlan = changeToFreePlan;
// 유료 요금제로 업그레이드 API (무료=>유료 변경 전용)
const upgradeToPaidPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청된 body 데이터 출력
    console.log("Received req.body:", req.body);
    const { spaceId, userEmail, additionalMembers } = req.body;
    if (!spaceId || !userEmail || additionalMembers === undefined) {
        res.status(400).json({ message: "Missing required parameters" });
        return;
    }
    const connection = yield dbpool_1.default.getConnection();
    try {
        const limit = 10 + (additionalMembers || 0); // 기본 10명 + 추가 인원
        console.log("Starting transaction...");
        yield connection.beginTransaction();
        console.log(`Updating subscription for spaceId: ${spaceId}, limit: ${limit}`);
        const [result] = yield connection.execute(`UPDATE Subscription 
       SET plan = ?, \`limit\` = ?, nextBillingDate = DATE_ADD(NOW(), INTERVAL 1 MONTH), updatedAt = CURRENT_TIMESTAMP 
       WHERE spaceId = ?`, ["team", limit, spaceId]);
        if (result.affectedRows === 0) {
            throw new Error("Subscription update failed, no rows affected.");
        }
        console.log("Update result:", result);
        console.log("Committing transaction...");
        yield connection.commit();
        console.log("Transaction committed successfully");
        res
            .status(200)
            .json({ message: "Subscription upgraded to paid plan successfully" });
    }
    catch (error) {
        console.error("Error occurred during transaction:", error.message);
        // 트랜잭션 롤백
        if (connection) {
            console.log("Rolling back transaction...");
            yield connection.rollback();
        }
        res
            .status(500)
            .json({ message: "Failed to upgrade subscription to paid plan" });
    }
    finally {
        if (connection) {
            console.log("Releasing connection...");
            connection.release();
        }
    }
});
exports.upgradeToPaidPlan = upgradeToPaidPlan;
const updatedLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { spaceId, additionalMembers, customerKey } = req.body;
    if (!spaceId || additionalMembers === undefined || !customerKey) {
        res.status(400).json({ message: "Missing required parameters" });
        return;
    }
    const newLimit = 10 + additionalMembers; // 기본 10명 + 추가 인원
    const newTotalAmount = additionalMembers * 3000; // 총 결제 금액 계산
    console.log("Received payload:", {
        spaceId,
        additionalMembers,
        customerKey,
        newLimit,
        newTotalAmount,
    });
    try {
        // Credit 테이블에서 active 상태의 기록 조회
        const [creditResult] = yield dbpool_1.default.execute(`SELECT billingKey FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`, [customerKey]);
        if (!creditResult || creditResult.length === 0) {
            res
                .status(404)
                .json({ message: "No active billing key found for the space" });
            return;
        }
        // Credit 테이블의 totalAmount 업데이트
        const [updateCreditResult] = yield dbpool_1.default.execute(`UPDATE Credit
       SET totalAmount = ?, updatedAt = NOW()
       WHERE customerKey = ? AND status = 'active'`, [newTotalAmount, customerKey]);
        if (updateCreditResult.affectedRows === 0) {
            res
                .status(404)
                .json({ message: "No credit record found to update the totalAmount." });
            return;
        }
        // Subscription 테이블 업데이트
        const [updateSubscriptionResult] = yield dbpool_1.default.execute(`UPDATE Subscription
       SET \`limit\` = ?, updatedAt = NOW()
       WHERE spaceId = ?`, [newLimit, spaceId]);
        if (updateSubscriptionResult.affectedRows === 0) {
            res
                .status(404)
                .json({ message: "No subscription found to update the limit." });
            return;
        }
        res.status(200).json({
            message: "Subscription limit and credit totalAmount updated successfully",
            newLimit,
            newTotalAmount,
        });
    }
    catch (error) {
        console.error("Error in updatedLimit:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ message: "Failed to update limit or totalAmount" });
    }
});
exports.updatedLimit = updatedLimit;
