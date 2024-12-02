import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FailureWrap } from "./priceStyle"; // FailureWrap 스타일 임포트

const Fail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL 파라미터에서 실패 정보 가져오기
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  const navigateToPaymentPage = () => {
    navigate("/payment");
  };

  return (
    <FailureWrap>
      <h1>결제가 실패했습니다.</h1>
      <p>
        오류 코드: {code ? code : "알 수 없음"}
        <br />
        오류 메시지: {message ? message : "오류 메시지가 제공되지 않았습니다."}
        <br />
        결제가 정상적으로 완료되지 않았습니다. 다시 시도해주세요.
      </p>
      <button onClick={navigateToPaymentPage}>
        구독 관리 페이지로 돌아가기
      </button>
    </FailureWrap>
  );
};

export default Fail;
