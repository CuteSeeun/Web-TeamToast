import axios from "axios";
const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY || "test_sk_DpexMgkW36xJQYxKbq0brGbR5ozO";
const BASE_URL = "https://api.tosspayments.com/v1/billing";

// Function to issue billing key
export const issueBillingKey = async (
  customerKey: string,
  { authKey }: { authKey: string }
) => {
  console.log(
    "Issuing billing key - customerKey:",
    customerKey,
    "authKey:",
    authKey
  ); // 요청 데이터 로그

  const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  console.log("Encoded Key:", encodedKey); // 인코딩된 키 확인

  try {
    const response = await axios.post(
      `${BASE_URL}/authorizations/issue`,
      {
        customerKey,
        authKey,
      },
      {
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

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
  } catch (error: any) {
    console.error(
      "Error issuing billing key - Axios error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to issue billing key"
    );
  }
};

// Function to approve recurring payment (카드 자동결제 승인)
export const processRecurringPayment = async (
  billingKey: string,
  {
    customerKey,
    amount,
    orderId,
    orderName,
  }: { customerKey: string; amount: number; orderId: string; orderName: string }
) => {
  const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

  try {
    const response = await axios.post(
      `${BASE_URL}/${billingKey}`,
      {
        customerKey,
        amount,
        orderId,
        orderName,
      },
      {
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // 자동결제 승인 응답 반환
  } catch (error: any) {
    console.error(
      "Error approving recurring payment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to approve recurring payment"
    );
  }
};

// Toss Payments 금액 변경 함수
export const updateTossPaymentAmount = async (
  billingKey: string,
  amount: number
): Promise<void> => {
  const apiUrl = "https://api.tosspayments.com/v1/billing"; // Toss Payments API 엔드포인트
  const secretKey = "test_sk_DpexMgkW36xJQYxKbq0brGbR5ozO"; // Toss Payments Secret Key (환경 변수로 관리 권장)

  try {
    const response = await axios.post(
      `${apiUrl}/${billingKey}`,
      { amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Toss Payments amount updated:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError 타입에 접근 가능
      console.error(
        "Failed to update Toss Payments amount:",
        error.response?.data || error.message
      );
    } else {
      // Unknown 에러 처리
      console.error("Unknown error occurred:", error);
    }
    throw new Error("Toss Payments 금액 업데이트 실패");
  }
};

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
