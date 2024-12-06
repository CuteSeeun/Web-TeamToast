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
exports.updateTossPaymentAmount = exports.processRecurringPayment = exports.issueBillingKey = void 0;
const axios_1 = __importDefault(require("axios"));
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_DpexMgkW36xJQYxKbq0brGbR5ozO";
const BASE_URL = "https://api.tosspayments.com/v1/billing";
// Function to issue billing key
const issueBillingKey = (customerKey_1, _a) => __awaiter(void 0, [customerKey_1, _a], void 0, function* (customerKey, { authKey }) {
    var _b, _c, _d;
    console.log("Issuing billing key - customerKey:", customerKey, "authKey:", authKey); // 요청 데이터 로그
    const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
    console.log("Encoded Key:", encodedKey); // 인코딩된 키 확인
    try {
        const response = yield axios_1.default.post(`${BASE_URL}/authorizations/issue`, {
            customerKey,
            authKey,
        }, {
            headers: {
                Authorization: `Basic ${encodedKey}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Toss API response:", response.data); // Toss API 응답 데이터 로그
        // 응답 데이터 추출
        const { billingKey, card } = response.data;
        if (!billingKey || !card) {
            throw new Error("Missing billingKey or card data in response");
        }
        return {
            billingKey,
            card: {
                number: card.number,
                cardCompany: response.data.cardCompany || "Unknown", // 외부 cardCompany 사용
                cardType: card.cardType,
            },
        };
    }
    catch (error) {
        console.error("Error issuing billing key - Axios error:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        throw new Error(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to issue billing key");
    }
});
exports.issueBillingKey = issueBillingKey;
// Function to approve recurring payment (카드 자동결제 승인)
const processRecurringPayment = (billingKey_1, _a) => __awaiter(void 0, [billingKey_1, _a], void 0, function* (billingKey, { customerKey, amount, orderId, orderName, }) {
    var _b, _c, _d;
    const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
    try {
        const response = yield axios_1.default.post(`${BASE_URL}/${billingKey}`, {
            customerKey,
            amount,
            orderId,
            orderName,
        }, {
            headers: {
                Authorization: `Basic ${encodedKey}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; // 자동결제 승인 응답 반환
    }
    catch (error) {
        console.error("Error approving recurring payment:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        throw new Error(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to approve recurring payment");
    }
});
exports.processRecurringPayment = processRecurringPayment;
// Toss Payments 금액 변경 함수
const updateTossPaymentAmount = (billingKey, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
            amount, // 변경된 금액
            currency: "KRW", // 통화 (Toss는 KRW만 지원)
        }, {
            headers: {
                Authorization: `Basic ${Buffer.from("test_sk_DpexMgkW36xJQYxKbq0brGbR5ozO:").toString("base64")}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Toss Payments billing amount updated successfully:", response.data);
    }
    catch (error) {
        console.error("Failed to update Toss Payments billing amount:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error("Toss Payments 금액 업데이트 실패");
    }
});
exports.updateTossPaymentAmount = updateTossPaymentAmount;
// export const getCardDetails = async (
//   paymentKey: string
// ): Promise<{ cardNumber: string }> => {
//   try {
//     const response = await axios.get(
//       `https://api.tosspayments.com/v1/payments/${paymentKey}`,
//       {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             `${process.env.TOSS_SECRET_KEY}:`
//           ).toString("base64")}`,
//         },
//       }
//     );
//     // Toss API 응답에서 카드 정보를 반환
//     return response.data.card; // 카드 정보를 포함한 객체 반환
//   } catch (error: any) {
//     console.error(
//       "Error fetching card details from Toss Payments:",
//       error.message
//     );
//     throw new Error("Failed to fetch card details");
//   }
// }
