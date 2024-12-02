import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { UpgradeSuccessWrap } from "./priceStyle";

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // URL에서 필요한 파라미터 가져오기
  const customerKey = searchParams.get("customerKey");
  const authKey = searchParams.get("authKey");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");
  const orderId = searchParams.get("orderId");
  const subscriptionId = searchParams.get("subscriptionId");

  useEffect(() => {
    if (
      customerKey &&
      authKey &&
      amount &&
      orderName &&
      orderId &&
      subscriptionId
    ) {
      sendBillingInfo(
        customerKey,
        authKey,
        amount,
        orderName,
        orderId,
        subscriptionId
      );
    } else {
      setErrorMessage("결제 정보가 누락되었습니다.");
    }
  }, [customerKey, authKey, amount, orderName, orderId, subscriptionId]);

  // 결제 정보를 서버로 전송
  const sendBillingInfo = async (
    customerKey: string,
    authKey: string,
    amount: string,
    orderName: string,
    orderId: string,
    subscriptionId: string
  ) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://localhost:3001/billing/complete",
        {
          customerKey,
          authKey,
          amount: parseInt(amount),
          orderName,
          orderId,
          subscriptionId: parseInt(subscriptionId),
        }
      );
      console.log("결제 정보 서버 전송 성공:", response.data);
      alert("결제 정보가 성공적으로 처리되었습니다.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "결제 정보 서버 전송 실패:",
          error.response?.data || error.message
        );
        setErrorMessage("결제 정보를 서버에 전송하는 데 실패했습니다.");
      } else {
        console.error("예기치 않은 오류 발생:", error);
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 팀 초대 화면으로 이동
  const navigateToTeamWithInvite = () => {
    navigate("/team", { state: { openInviteModal: true } });
  };

  return (
    <UpgradeSuccessWrap>
      <h1>🎉구독 업그레이드가 성공적으로 완료되었습니다! 🎉</h1>
      {isLoading ? (
        <p>결제 처리 중입니다...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <>
          <p>새로운 팀원을 초대하고 더 많은 협업을 시작하세요.</p>
          <button onClick={navigateToTeamWithInvite}>팀원 초대하기</button>
        </>
      )}
    </UpgradeSuccessWrap>
  );
};

export default Success;
