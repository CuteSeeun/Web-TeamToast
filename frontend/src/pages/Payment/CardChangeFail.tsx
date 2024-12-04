import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FailureWrap } from "./priceStyle"; // 실패 스타일 사용

const CardChangeFail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 실패 정보 가져오기
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  const handleNavigateToSubscription = () => {
    navigate("/payment");
  };

  return (
    <FailureWrap>
      <h1>카드 정보 변경에 실패했습니다.</h1>
      <p>
        <strong>오류 코드:</strong> {code || "알 수 없음"}
      </p>
      <p>
        <strong>오류 메시지:</strong>{" "}
        {message || "오류 메시지가 제공되지 않았습니다."}
      </p>
      <button onClick={handleNavigateToSubscription}>
        구독 관리 페이지로 돌아가기
      </button>
    </FailureWrap>
  );
};

export default CardChangeFail;
