import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { UpgradeSuccessWrap } from "./priceStyle"; // 성공/실패 공용 스타일 사용

const CardChangeSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authKey = searchParams.get("authKey"); // Toss Payments에서 반환된 인증 키
  const customerKey = searchParams.get("customerKey"); // 고객 고유 키
  // spaceId는 세션 스토리지에서 가져오기
  const spaceId = sessionStorage.getItem("sid");

  // postAuthKeyToServer를 useCallback으로 메모이제이션
  const postAuthKeyToServer = useCallback(async () => {
    if (!authKey || !customerKey || !spaceId) {
      setErrorMessage("authKey, customerKey 또는 spaceId가 누락되었습니다.");
      console.error(
        "authKey, customerKey 또는 spaceId가 없습니다. 서버로 데이터를 보낼 수 없습니다."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://localhost:3001/billing/card-update",
        {
          customerKey, // 고객 고유 키
          authKey, // Toss Payments에서 반환된 인증 키
          spaceId, // 스페이스 ID
        }
      );
      if (response.status === 200) {
        console.log(
          "카드 정보가 서버에 성공적으로 저장되었습니다:",
          response.data
        );
      } else {
        console.error("카드 정보를 서버에 저장하지 못했습니다:", response.data);
        setErrorMessage("카드 정보를 서버에 저장하지 못했습니다.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "카드 정보 서버 전송 실패:",
          error.response?.data || error.message
        );
        setErrorMessage("카드 정보를 서버에 전송하는 데 실패했습니다.");
      } else {
        console.error("예기치 않은 오류 발생:", error);
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [authKey, customerKey, spaceId]); // 의존성 배열 추가

  // useEffect에서 postAuthKeyToServer 호출
  useEffect(() => {
    postAuthKeyToServer();
  }, [postAuthKeyToServer]); // useCallback으로 메모이제이션된 함수 사용

  const handleNavigateToSubscription = () => {
    navigate("/payment");
  };

  return (
    <UpgradeSuccessWrap>
      <h1>카드 정보가 성공적으로 변경되었습니다!</h1>
      {isLoading ? (
        <p>카드 정보를 처리 중입니다...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <p>새로운 카드 정보가 저장되었습니다.</p>
      )}
      <button onClick={handleNavigateToSubscription}>
        구독 관리 페이지로 돌아가기
      </button>
    </UpgradeSuccessWrap>
  );
};

export default CardChangeSuccess;
