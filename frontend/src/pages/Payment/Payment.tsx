import React, { useState, useEffect } from "react";
import axios from "axios";
import { PaymentWrap } from "./priceStyle";

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "team">("free");
  const [cardInfo, setCardInfo] = useState<string | null>(null);
  const [additionalMembers, setAdditionalMembers] = useState(0); // 추가 인원
  const [monthlyFee, setMonthlyFee] = useState(0); // 월별 결제 요금
  const userEmail = "kh32100@naver.com"; // 로그인 후 동적으로 변경
  const spaceId = 4; // 실제 스페이스 ID로 설정 (임시 값)
  const unitPrice = 3000; // 인당 금액

  // 서버에서 구독 정보 가져오기
  const fetchSubscriptionDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/subscription/details",
        { params: { spaceId, userEmail } }
      );

      const { plan, cardNumber, additionalMembers } = response.data;
      console.log("Fetched cardNumber:", cardNumber); // 서버에서 받은 카드 번호 확인
      setSelectedPlan(plan);
      setCardInfo(cardNumber || null); // null 처리
      setAdditionalMembers(additionalMembers || 0);
      calculateMonthlyFee(additionalMembers || 0); // 추가 인원 기준으로 요금 계산
    } catch (error) {
      console.error("Failed to fetch subscription details:", error);
    }
  };

  // 월별 요금 계산
  const calculateMonthlyFee = (additional: number) => {
    setMonthlyFee(additional * unitPrice); // 추가 인원당 요금 계산
  };

  // 요금제 변경 처리
  const handlePlanSelect = (plan: "free" | "team") => {
    setSelectedPlan(plan);
  };

  // 유료 => 무료로 변경
  const handleFreePlanChange = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/subscription/change-to-free",
        {
          spaceId, // 변경할 space ID
        }
      );
      alert(response.data.message);
      // 필요한 경우 상태 업데이트
      setSelectedPlan("free");
      setAdditionalMembers(0);
      setMonthlyFee(0);
    } catch (error: any) {
      console.error(
        "Failed to change subscription to free plan:",
        error.response?.data || error.message
      );
      alert("무료 요금제로 변경 중 오류가 발생했습니다.");
    }
  };

  // 무료 -> 유료 또는 유료 -> 유료 변경 처리
  const handleUpgrade = async () => {
    try {
      if (selectedPlan === "team" && cardInfo) {
        // 유료 -> 유료 변경 (결제 없이 업데이트만)
        await axios.post("http://localhost:3001/subscription/updatedLimit", {
          spaceId,
          additionalMembers,
        });
        alert(
          `구독 변경이 완료되었습니다. 다음 결제일부터는 ￦${monthlyFee}이 결제될 예정입니다.`
        );
        fetchSubscriptionDetails(); // 구독 상태 갱신
      } else {
        // 무료 -> 유료 변경 (결제 필요)
        const amount = additionalMembers * unitPrice;
        const orderName = "Team Subscription Fee";
        const orderId = `ORDER-${Date.now()}`;
        const subscriptionId = 2; // 실제 Subscription ID로 대체

        const tossPayments = (window as any).TossPayments(
          "test_ck_GjLJoQ1aVZ9xkgwmj0o13w6KYe2R"
        );

        await tossPayments.requestBillingAuth("카드", {
          customerKey: userEmail,
          amount,
          orderId,
          orderName,
          successUrl: `http://localhost:3000/success?amount=${amount}&orderName=${encodeURIComponent(
            orderName
          )}&orderId=${orderId}&subscriptionId=${subscriptionId}&spaceId=${spaceId}&additionalMembers=${additionalMembers}`,
          failUrl: "http://localhost:3000/fail",
        });
      }
    } catch (error: any) {
      console.error("구독 업그레이드 중 오류 발생:", error);
      alert("구독 업그레이드 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 카드 정보 변경 요청
  const handleCardChange = () => {
    const tossPayments = (window as any).TossPayments(
      "test_ck_GjLJoQ1aVZ9xkgwmj0o13w6KYe2R"
    );

    tossPayments
      .requestBillingAuth("카드", {
        customerKey: userEmail,
        successUrl: `http://localhost:3000/card-change-success`,
        failUrl: "http://localhost:3000/card-change-fail",
      })
      .then(() => {
        alert("카드 정보 변경 요청이 성공적으로 완료되었습니다.");
      })
      .catch((error: any) => {
        console.error("카드 변경 요청 중 오류 발생:", error);
      });
  };

  // 구독 상태 및 요금 계산
  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  // 추가 인원 변경 시 월별 요금 계산
  useEffect(() => {
    calculateMonthlyFee(additionalMembers);
  }, [additionalMembers]);

  useEffect(() => {
    console.log("Card Info:", cardInfo); // cardInfo 값 확인
  }, [cardInfo]);

  return (
    <PaymentWrap>
      <div className="plan-section">
        <div className="section-header">구독 관리</div>
        <div className="plan-options">
          <div
            className={`plan-card ${selectedPlan === "free" ? "selected" : ""}`}
            onClick={() => handlePlanSelect("free")}
          >
            <input
              type="radio"
              name="plan"
              value="free"
              checked={selectedPlan === "free"}
              onChange={() => handlePlanSelect("free")}
            />
            <div className="plan-info">
              <h3>무료 요금제</h3>
              <p>팀 인원</p>
              <p>10명까지 사용 가능</p>
              <p className="price">￦0 / 월</p>
            </div>
          </div>
          <div
            className={`plan-card ${selectedPlan === "team" ? "selected" : ""}`}
            onClick={() => handlePlanSelect("team")}
          >
            <input
              type="radio"
              name="plan"
              value="team"
              checked={selectedPlan === "team"}
              onChange={() => handlePlanSelect("team")}
            />
            <div className="plan-info">
              <h3>팀 요금제</h3>
              <p>11명 이상부터 사용</p>
              <p className="price">인당 ￦3,000 / 월</p>
            </div>
          </div>
        </div>
        {selectedPlan === "free" && (
          <button className="change-btn" onClick={handleFreePlanChange}>
            무료 요금제로 변경
          </button>
        )}
        {selectedPlan === "team" && (
          <div className="calculator">
            <h3>팀 요금제 계산기</h3>
            <div className="calc-row">
              <span>인당 금액</span>
              <span>{unitPrice} 원</span>
            </div>
            <div className="calc-row">
              <span>추가 인원</span>
              <input
                type="number"
                value={additionalMembers || 0} // undefined 방지
                min="0"
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  setAdditionalMembers(value);
                }}
              />
              명
            </div>
            <div className="total-price">
              <span>월별 결제 요금</span>
              <span>￦{monthlyFee}</span>
            </div>
            <button className="change-btn" onClick={handleUpgrade}>
              업그레이드
            </button>
          </div>
        )}
      </div>
      {cardInfo ? (
        <div className="card-section">
          <h2>카드 관리</h2>
          <div className="card-details">
            <span>카드번호</span>
            <span>{cardInfo}</span>
          </div>
          <div className="card-actions">
            <button className="card-change-btn" onClick={handleCardChange}>
              카드 변경
            </button>
          </div>
        </div>
      ) : (
        <p>카드 정보가 없습니다</p>
      )}
    </PaymentWrap>
  );
};

export default Payment;
