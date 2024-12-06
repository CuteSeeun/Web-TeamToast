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
exports.updateCreditAmount = exports.updateCardInfo = exports.processScheduledPayment = exports.createBillingKey = void 0;
const tossApiClient_1 = require("../tossApiClient");
const dbpool_1 = __importDefault(require("../config/dbpool"));
// Helper 함수: ISO 형식의 날짜 문자열 반환
const formatToMySQLDate = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
};
// Helper 함수: 다음 결제일 계산
const calculateNextBillingDate = (approvedAt) => {
    const nextBillingDate = new Date(approvedAt);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    return nextBillingDate.toISOString().split("T")[0];
};
// 공통 빌링키 생성 로직
const generateBillingKey = (customerKey, authKey, amount, orderId, orderName) => __awaiter(void 0, void 0, void 0, function* () {
    const billingKeyResponse = yield (0, tossApiClient_1.issueBillingKey)(customerKey, { authKey });
    const { billingKey, card } = billingKeyResponse;
    const cardNumber = card.number;
    if (amount && orderId && orderName) {
        const paymentResponse = yield (0, tossApiClient_1.processRecurringPayment)(billingKey, {
            customerKey,
            amount,
            orderId,
            orderName,
        });
        return {
            billingKey,
            cardNumber,
            paymentData: {
                paymentKey: paymentResponse.paymentKey,
                approvedAt: paymentResponse.approvedAt,
                lastTransactionKey: paymentResponse.lastTransactionKey || null,
                status: paymentResponse.status,
                nextBillingDate: calculateNextBillingDate(paymentResponse.approvedAt),
            },
        };
    }
    return { billingKey, cardNumber };
});
// Toss Payments 상태를 Credit 상태로 매핑
const mapTossStatusToCreditStatus = (tossStatus) => {
    const statusMapping = {
        READY: "pending",
        IN_PROGRESS: "pending",
        WAITING_FOR_DEPOSIT: "pending",
        DONE: "active",
        CANCELED: "canceled",
        PARTIAL_CANCELED: "canceled",
        ABORTED: "failed",
        EXPIRED: "expired",
    };
    return statusMapping[tossStatus] || "failed"; // 기본적으로 매핑되지 않은 상태는 'failed'
};
const createBillingKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerKey, authKey, amount, orderId, orderName, subscriptionId } = req.body;
    if (!customerKey ||
        !authKey ||
        !amount ||
        !orderId ||
        !orderName ||
        !subscriptionId) {
        res.status(400).json({ message: "Missing required parameters" });
        return;
    }
    try {
        const { billingKey, cardNumber, paymentData } = yield generateBillingKey(customerKey, authKey, amount, orderId, orderName);
        if (!paymentData) {
            throw new Error("Payment data is undefined.");
        }
        // Toss 상태를 Credit 상태로 변환
        const creditStatus = mapTossStatusToCreditStatus(paymentData.status);
        yield dbpool_1.default.execute(`
        INSERT INTO Credit (
          subId,
          customerKey,
          paymentKey,
          billingKey,
          lastTransactionKey,
          status,
          totalAmount,
          orderId,
          orderName,
          approvedAt,
          billingDate,
          nextBillingDate,
          cardNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            subscriptionId,
            customerKey,
            paymentData.paymentKey,
            billingKey,
            paymentData.lastTransactionKey,
            creditStatus,
            amount,
            orderId,
            orderName,
            formatToMySQLDate(new Date(paymentData.approvedAt)),
            paymentData.approvedAt.split("T")[0],
            paymentData.nextBillingDate,
            cardNumber,
        ]);
        res.status(200).json({
            message: "Billing key issued and first payment completed successfully",
            billingKey,
            paymentData,
        });
    }
    catch (error) {
        console.error("Error creating billing key:", error.message);
        res.status(500).json({ message: "Failed to create billing key", error });
    }
});
exports.createBillingKey = createBillingKey;
// 자동 결제 API 호출
const processScheduledPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield dbpool_1.default.execute(`SELECT crId, subId, billingKey, totalAmount, customerKey, orderId, orderName
       FROM Credit
       WHERE nextBillingDate = CURDATE() AND status = 'active'`);
        if (rows.length === 0) {
            res.status(200).json({ message: "No scheduled payments for today." });
            return;
        }
        for (const row of rows) {
            const { crId, subscriptionId, billingKey, totalAmount, customerKey, orderId, orderName, } = row;
            try {
                const paymentResponse = yield (0, tossApiClient_1.processRecurringPayment)(billingKey, {
                    customerKey,
                    amount: totalAmount,
                    orderId,
                    orderName,
                });
                // Toss 상태를 Credit 상태로 변환
                const creditStatus = mapTossStatusToCreditStatus(paymentResponse.status);
                const nextBillingDate = calculateNextBillingDate(paymentResponse.approvedAt);
                yield dbpool_1.default.execute(`UPDATE Credit SET lastTransactionKey = ?, nextBillingDate = ?, status = ? WHERE crId = ?`, [paymentResponse.paymentKey, nextBillingDate, creditStatus, crId]);
            }
            catch (error) {
                console.error(`Payment failed for ID ${crId}:`, error.message);
                yield dbpool_1.default.execute(`UPDATE Credit SET status = 'failed' WHERE crId = ?`, [
                    crId,
                ]);
            }
        }
        res.status(200).json({ message: "Scheduled payments processed." });
    }
    catch (error) {
        console.error("Error processing scheduled payments:", error.message);
        res.status(500).json({ message: "Failed to process scheduled payments." });
    }
});
exports.processScheduledPayment = processScheduledPayment;
//카드정보 업데이트
const updateCardInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerKey, authKey, spaceId } = req.body;
    if (!customerKey || !authKey || !spaceId) {
        res.status(400).json({ message: "Missing required parameters" });
        return;
    }
    try {
        const { billingKey, cardNumber } = yield generateBillingKey(customerKey, authKey);
        // 기존 데이터 조회
        const [existingData] = yield dbpool_1.default.execute(`
      SELECT * 
      FROM Credit 
      INNER JOIN Subscription ON Credit.subId = Subscription.subId
      WHERE Credit.customerKey = ? AND Subscription.spaceId = ? AND Credit.status = 'active'
      LIMIT 1
      `, [customerKey, spaceId]);
        if (!existingData || existingData.length === 0) {
            res.status(404).json({
                message: "No active record found for customerKey and sId",
            });
            return;
        }
        const currentRecord = existingData[0];
        // 기존 카드 정보를 expired로 업데이트
        yield dbpool_1.default.execute(`UPDATE Credit SET status = 'expired', updatedAt = NOW() WHERE crId = ?`, [currentRecord.crId]);
        // 새로운 카드 정보를 active로 추가 (기존 데이터 재활용)
        yield dbpool_1.default.execute(`
        INSERT INTO Credit (
          subId,
          customerKey,
          billingKey,
          status,
          cardNumber,
          totalAmount, -- 기존 totalAmount를 그대로 사용
          orderId,
          orderName,
          approvedAt,
          billingDate,
          nextBillingDate,
          lastTransactionKey,
          createdAt,
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
            currentRecord.subId,
            customerKey,
            billingKey,
            "active", // 새 카드는 active 상태
            cardNumber,
            currentRecord.totalAmount, // 기존 totalAmount 재활용
            currentRecord.orderId,
            currentRecord.orderName,
            currentRecord.approvedAt,
            currentRecord.billingDate,
            currentRecord.nextBillingDate,
            currentRecord.lastTransactionKey,
        ]);
        res.status(200).json({ message: "Card information updated successfully" });
    }
    catch (error) {
        console.error("Error updating card information:", error.message);
        res.status(500).json({ message: "Failed to update card information" });
    }
});
exports.updateCardInfo = updateCardInfo;
const updateCreditAmount = (customerKey, newAmount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield dbpool_1.default.execute(`UPDATE Credit 
       SET amount = ?, updatedAt = NOW()
       WHERE customerKey = ? AND status = 'active'`, [newAmount, customerKey]);
        if (result.affectedRows === 0) {
            console.warn("No credit record found to update amount.");
        }
        else {
            console.log("Credit amount updated successfully:", result);
        }
    }
    catch (error) {
        console.error("Failed to update Credit amount:", error);
        throw new Error("Credit amount 업데이트 실패");
    }
});
exports.updateCreditAmount = updateCreditAmount;
