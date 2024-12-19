// 로그인 상태관리 훅 (사용자 유지시킴)

import { useSetRecoilState } from "recoil"
import { userState } from "../recoil/atoms/userAtoms"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AccessToken from "../pages/Login/AccessToken";
import axios from "axios";


export const useAuth = () =>{

    const setUser = useSetRecoilState(userState);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
          const accessToken = localStorage.getItem('accessToken');

          /* 
          로컬에서 액세스토큰을 가져와서 토큰이 있으면
          아래 코드 실행
          서버에서 getinfo api 호출해서
          그 호출한곳에서 axios.get으로 정보 가져오고
          그 정보가 있다면 리코일에 가져온 정보 저장
          */
    
          if (accessToken) {
            try {
              const response = await AccessToken.get('/editUser/me');                
              //서버에서 유저정보 보낸게 있으면 리코일에 유저정보 저장
              if (response.data?.user) {
                setUser({
                  uid: response.data.user.uid,
                  uname: response.data.user.uname,
                  email: response.data.user.email,
                });
              }else {
                setUser(null);
              }
            } catch (error) {
              console.error('에러 발생', error);
              localStorage.removeItem('accessToken');
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false); //로딩 끝
        };
    
        fetchUserData();
      }, [setUser]);

      return loading; // 로딩 상태 반환
}