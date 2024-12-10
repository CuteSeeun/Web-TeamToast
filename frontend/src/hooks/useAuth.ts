// 로그인 상태관리 훅 (사용자 유지시킴)

import { useSetRecoilState } from "recoil"
import { userState } from "../recoil/atoms/userAtoms"
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AccessToken from "../pages/Login/AccessToken";
import { useNavigate } from "react-router-dom";


export const useAuth = () =>{
  const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);

    const pendigAuth = async()=>{
      try {
        // 로컬 스토리지에서 토큰 확인
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          // 토큰이 없으면 로그인 페이지로 리다이렉트
          navigate('/login');
          return;
        }
  
        // 토큰으로 사용자 정보 재검증
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        // 성공적으로 검증되면 사용자 상태 업데이트
        const userData = await response.json();
        // 여기서 전역 상태 관리자(Redux/Recoil 등)로 사용자 상태 업데이트
        
        console.log('Auto login recovery successful');
  
      } catch (error) {
        console.error('Auto login recovery failed:', error);
        // 실패시 토큰 제거하고 로그인 페이지로 이동
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    };
  
    // 네트워크 요청 상태 모니터링
    useEffect(() => {
      const checkPendingRequests = () => {
        const pendingXHR = document.querySelectorAll('.xhr[status="(pending)"]');
        if (pendingXHR.length > 0) {
          pendigAuth();
        }
      };
  
      // 주기적으로 pending 상태 체크 (5초 간격)
      const intervalId = setInterval(checkPendingRequests, 5000);
  
      return () => clearInterval(intervalId);
    }, []);
  };
    
