import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PaymentWrap } from "./priceStyle";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/userAtoms"; // Recoil 상태 가져오기
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "team">("basic");
  const [cardInfo, setCardInfo] = useState<string | null>(null);
  const [additionalMembers, setAdditionalMembers] = useState(0); // 추가 인원
  const [monthlyFee, setMonthlyFee] = useState(0); // 월별 결제 요금
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null); // Subscription ID
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [billingAmount, setBillingAmount] = useState<number | null>(null);
  const [proRataAmount, setProRataAmount] = useState<number>(0); // 비례 금액 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const unitPrice = 3000; // 인당 금액

  // Recoil에서 사용자 정보 가져오기
  const user = useRecoilValue(userState);

  // spaceId는 세션 스토리지에서 가져오기
  const spaceId = sessionStorage.getItem("sid");
  const navigate = useNavigate(); // 페이지 이동 훅

  const calculateMonthlyFee = (additional: number) => {
    setMonthlyFee(additional * unitPrice); // 추가 인원당 요금 계산
  };

  // fetchAllDetails 함수 정의 (useCallback으로 감싸기)
  const fetchAllDetails = useCallback(
    async (userEmail: string, spaceId: string) => {
      try {
        // Promise.all로 사용자 정보 및 구독 정보 동시 호출
        const [userResponse, subscriptionResponse] = await Promise.all([
          axios.get("http://localhost:3001/subscription/user/details", {
            params: { userEmail, spaceId },
          }),
          axios.get("http://localhost:3001/subscription/details", {
            params: { userEmail, spaceId },
          }),
        ]);

        // 사용자 정보 처리
        const { subscriptionId } = userResponse.data;
        setSubscriptionId(subscriptionId); // Subscription ID 설정

        // 구독 정보 처리
        const {
          plan,
          cardNumber,
          limit,
          nextBillingDate,
          monthlyFee,
          proRataAmount,
        } = subscriptionResponse.data;
        setSelectedPlan(plan);
        setCardInfo(plan === "team" ? cardNumber : null);
        setNextBillingDate(nextBillingDate || null); // 다음 결제일 설정
        setBillingAmount(monthlyFee || null); // 결제 금액 설정
        const calculatedAdditionalMembers = limit > 10 ? limit - 10 : 0;
        setAdditionalMembers(calculatedAdditionalMembers);
        calculateMonthlyFee(calculatedAdditionalMembers);
        // 비례 금액 상태 저장
        setProRataAmount(proRataAmount || 0); // 새로운 상태 추가
      } catch (error) {
        console.error("Failed to fetch details:", error);
      }
    },
    []
  );

  // 최고관리자 상태 확인 함수
  const checkAdminStatus = useCallback(async () => {
    if (!user?.email || !spaceId) {
      setLoading(false);
      return;
    }
    try {
      await fetchAllDetails(user.email, spaceId); // 데이터 강제 갱신
      const response = await axios.get(
        "http://localhost:3001/subscription/check-admin",
        {
          params: { userEmail: user.email, spaceId },
        }
      );
      console.log("Admin check response:", response.data); // 디버깅 로그 추가
      setIsAdmin(response.data.isAdmin);
      if (response.data.isAdmin) {
        sessionStorage.setItem("userRole", "top_manager"); // 최고관리자 역할 설정
      } else {
        sessionStorage.setItem("userRole", "normal");
      }
    } catch (error) {
      console.error("Failed to check admin status:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email, spaceId, fetchAllDetails]);

  // 초기 관리자 확인 및 데이터 로딩
  useEffect(() => {
    setLoading(true); // 로딩 시작
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    if (loading) {
      // 로딩 중일 때는 아무 작업도 하지 않음
      return;
    }

    if (!isAdmin) {
      alert("구독 관리에 접근할 권한이 없습니다.");
      navigate("/team");
    }
  }, [loading, isAdmin, navigate]);

  const handlePlanSelect = (plan: "basic" | "team") => {
    setSelectedPlan(plan);
  };

  const handleFreePlanChange = async () => {
    try {
      // 확인 팝업창 표시
      const isConfirmed = window.confirm(
        `무료 요금제로 변경하시겠습니까? ${formattedNextBillingDate}부터 팀 요금제를 이용하실 수 없습니다.`
      );
      if (!isConfirmed) {
        // 사용자가 취소를 선택한 경우 함수 종료
        return;
      }
      if (!spaceId || !user?.email)
        throw new Error("spaceId가 유효하지 않습니다.");

      const response = await axios.post(
        "http://localhost:3001/subscription/change-to-free",
        { spaceId }
      );
      alert(response.data.message);
      setSelectedPlan("basic");
      setAdditionalMembers(0);
      setMonthlyFee(0);
      // 무료 요금제로 전환 후 상태 업데이트
      await fetchAllDetails(user.email, spaceId); // 최신 구독 정보 가져오기
    } catch (error: any) {
      console.error(
        "Failed to change subscription to free plan:",
        error.response?.data || error.message
      );
      alert("무료 요금제로 변경 중 오류가 발생했습니다.");
    }
  };

  const handleCardChange = () => {
    const tossPayments = (window as any).TossPayments(
      "test_ck_GjLJoQ1aVZ9xkgwmj0o13w6KYe2R" // Toss Payments 테스트 키
    );

    tossPayments
      .requestBillingAuth("카드", {
        customerKey: user?.email, // Recoil에서 가져온 사용자 이메일 사용
        successUrl: `http://localhost:3000/card-change-success`,
        failUrl: `http://localhost:3000/card-change-fail`,
      })
      .then(() => {
        alert("카드 정보 변경 요청이 성공적으로 완료되었습니다.");
        if (user?.email && spaceId) {
          fetchAllDetails(user.email, spaceId); // 카드 변경 후 구독 정보 갱신
        }
      })
      .catch((error: any) => {
        console.error("카드 변경 요청 중 오류 발생:", error);
        alert("카드 변경 중 문제가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const handleUpgrade = async () => {
    try {
      if (!spaceId) throw new Error("spaceId가 유효하지 않습니다.");
      if (!subscriptionId)
        throw new Error("subscriptionId가 유효하지 않습니다."); // 추가 확인

      const orderName = "Team Subscription Fee";
      const orderId = `ORDER-${Date.now()}`; // 고유 주문 ID 생성
      const amount = additionalMembers * unitPrice; // 결제 금액 계산

      // 현재 인원과 변경된 인원을 비교하여 메시지 동적 생성
      const billingAmountWithDefault = billingAmount ?? 0; // null이면 기본값 0
      const currentMembers = billingAmountWithDefault / unitPrice + 10; // 현재 구독 인원 계산
      const memberDifference = additionalMembers - (currentMembers - 10); // 추가/감소된 인원 계산

      const popupMessage =
        memberDifference > 0
          ? `총 팀원을 ${currentMembers}명에서 ${
              currentMembers + memberDifference
            }명으로 변경하시겠습니까?\n` +
            `변경된 금액은 다음 결제일에 반영되며, 월 요금은 ￦${amount}로 조정됩니다.`
          : `총 팀원을 ${currentMembers}명에서 ${
              currentMembers + memberDifference
            }명으로 변경하시겠습니까?\n` +
            `변경된 금액은 다음 결제일에 반영되며, 월 요금은 ￦${amount}로 조정됩니다.`;

      // 확인 팝업창 표시
      const isConfirmed = window.confirm(popupMessage);

      if (!isConfirmed) {
        // 사용자가 취소를 선택한 경우 함수 종료
        return;
      }

      if (selectedPlan === "team" && cardInfo) {
        // 유료 -> 유료 변경 (결제 없이 업데이트만)
        await axios.post("http://localhost:3001/subscription/updatedLimit", {
          spaceId,
          additionalMembers,
          customerKey: user?.email,
          orderId,
          orderName,
        });
        alert(
          `구독 변경이 완료되었습니다. 다음 결제일부터는 ￦${amount}이 결제될 예정입니다.`
        );
        fetchAllDetails(user?.email!, spaceId); // 최신 정보 갱신
      } else {
        // 무료 -> 유료 변경 (결제 필요)
        const tossPayments = (window as any).TossPayments(
          "test_ck_GjLJoQ1aVZ9xkgwmj0o13w6KYe2R"
        );

        await tossPayments.requestBillingAuth("카드", {
          customerKey: user?.email,
          amount,
          orderId,
          orderName,
          successUrl: `http://localhost:3000/success?amount=${amount}&orderName=${encodeURIComponent(
            orderName
          )}&orderId=${orderId}&spaceId=${spaceId}&subscriptionId=${subscriptionId}&additionalMembers=${additionalMembers}`,
          failUrl: "http://localhost:3000/fail",
        });
      }
    } catch (error: any) {
      console.error("구독 업그레이드 중 오류 발생:", error);
      alert("구독 업그레이드 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (!user?.email || !spaceId || !subscriptionId) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  // "결제 예정일" 변수로 저장
  const formattedNextBillingDate = formatDate(nextBillingDate);

  return (
    <PaymentWrap>
      <div className="plan-section">
        <div className="section-header">
          구독 관리
          {selectedPlan === "team" && nextBillingDate && billingAmount && (
            <p className="billing-date">
              <strong>결제 예정일: </strong> {formattedNextBillingDate}
              <strong> | </strong>
              <strong>금액: </strong> {billingAmount}
            </p>
          )}
        </div>
        <div className="billing-info"></div>
        <div className="plan-options">
          <div
            className={`plan-card ${
              selectedPlan === "basic" ? "selected" : ""
            }`}
            onClick={() => handlePlanSelect("basic")}
          >
            <input
              type="radio"
              name="plan"
              value="basic"
              checked={selectedPlan === "basic"}
              onChange={() => handlePlanSelect("basic")}
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
        {selectedPlan === "basic" && (
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
                value={additionalMembers || 0}
                min="0"
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  setAdditionalMembers(value);
                  calculateMonthlyFee(value); // 요금 계산
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
