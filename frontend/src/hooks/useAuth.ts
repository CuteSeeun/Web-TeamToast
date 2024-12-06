// 로그인 상태관리 훅 (사용자 유지시킴)

import { useSetRecoilState } from "recoil"
import { userState } from "../recoil/atoms/userAtoms"
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AccessToken from "../pages/Login/AccessToken";


export const useAuth = () =>{

    const setUser = useSetRecoilState(userState);

    useEffect(() => {
        const fetchUserData = async () => {
          const accessToken = localStorage.getItem('accessToken');
    
          if (accessToken) {
            try {

              const { exp } = jwtDecode<{ exp: number }>(accessToken);
              const now = Date.now() / 1000;

              // 토큰이 만료되었거나 만료 임박한 경우
              if (exp - now <= 90) {
                  // 토큰 재발급 시도
                  const { uid } = jwtDecode<{ uid: number }>(accessToken);
                  const response = await AccessToken.post('/editUser/refresh/token', 
                      { uid },
                  );
                  
                  if (response.data.accessToken) {
                      localStorage.setItem('accessToken', response.data.accessToken);
                  }
              }


              const response = await AccessToken.get('/editUser/me');                // headers: {
              
              //서버에서 유저정보 보낸게 있으면 리코일에 유저정보 저장
              if (response.data?.user) {
                setUser({
                  uid: response.data.user.uid,
                  uname: response.data.user.uname,
                  email: response.data.user.email,
                  isLoggedIn: true,
                  token: localStorage.getItem('accessToken') || undefined,
                  role: 'member'
                });
              } 
            } catch (error) {
              console.error('에러 발생', error);
              localStorage.removeItem('accessToken');
              setUser(null);
            }
          } else {
            setUser(null);
          }
        };
    
        fetchUserData();
      }, [setUser]);
}