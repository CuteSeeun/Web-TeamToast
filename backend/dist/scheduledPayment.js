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
exports.scheduledRecurringPayments = void 0;
//@ts-ignore
const node_schedule_1 = __importDefault(require("node-schedule"));
const dbpool_1 = __importDefault(require("./config/dbpool")); // DB 연결
const tossApiClient_1 = require("./tossApiClient"); // Toss API 호출
const scheduledRecurringPayments = () => {
    // 매일 0시에 스케줄 실행
    node_schedule_1.default.scheduleJob("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Checking for scheduled payments...");
        try {
            // DB에서 오늘 자동 결제가 필요한 항목 조회
            const [rows] = yield dbpool_1.default.execute(`SELECT crId, subId, billingKey, totalAmount, customerKey, orderId, orderName
         FROM Credit
         WHERE nextBillingDate = CURDATE() AND status = 'active'`);
            if (rows.length === 0) {
                console.log("No scheduled payments for today.");
                return;
            }
            // 조회된 항목에 대해 반복 처리
            for (const row of rows) {
                const { crId, subId, billingKey, totalAmount, customerKey, orderId, orderName, } = row;
                try {
                    // Toss API로 자동 결제 요청
                    const paymentResponse = yield (0, tossApiClient_1.processRecurringPayment)(billingKey, {
                        amount: totalAmount,
                        customerKey,
                        orderId,
                        orderName,
                    });
                    console.log(`Payment successful for ID ${crId}`, paymentResponse);
                    // 다음 결제 예정일 계산
                    const nextBillingDate = new Date();
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                    const formattedNextBillingDate = nextBillingDate
                        .toISOString()
                        .split("T")[0];
                    // 결제 성공 시 DB 업데이트
                    yield dbpool_1.default.execute(`UPDATE Credit
             SET lastTransactionKey = ?, nextBillingDate = ?, status = 'active'
             WHERE crId = ?`, [paymentResponse.lastTransactionKey, formattedNextBillingDate, crId]);
                }
                catch (error) {
                    // 결제 실패 시 상태 업데이트
                    console.error(`Payment failed for ID ${crId}:`, error.message);
                    yield dbpool_1.default.execute(`UPDATE Credit SET status = 'failed' WHERE crId = ?`, [crId]);
                }
            }
        }
        catch (error) {
            // 전체 스케줄 처리 실패
            console.error("Error processing scheduled payments:", error.message);
        }
    }));
};
exports.scheduledRecurringPayments = scheduledRecurringPayments;
