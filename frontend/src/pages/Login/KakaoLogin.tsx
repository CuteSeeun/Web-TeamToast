import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userState } from '../../recoil/atoms/userAtoms';
import { useSetRecoilState } from 'recoil';

const OAuthCallback = () => {
    const location = useLocation();
    const navi = useNavigate();
    const setUser = useSetRecoilState(userState);

    //카카오 소셜 로그인
    useEffect(()=>{
        //url 에서 인증코드 가져옴
        const code = new URLSearchParams(location.search).get('code');
        if(code){
            // 서버에 인증 코드 전송해서 토큰 발급
            // axios.post('http://localhost:3001/editUser/kakao-token',{code},
            axios.post('/editUser/kakao-token',{code},
                {
                     baseURL: 'http://localhost:8080'
                }
            )
            .then(response => {
                const {token,user} = response.data;
                localStorage.setItem('accessToken',token);
                setUser(user)

                navi('/');
            })
            .catch(error=>{
                console.error('카카오 오류:',error);
                navi('/login');
            })
        }
    },[location,navi,setUser])

    return (
        <div>
            로그인 처리중
        </div>
    );
};

export default OAuthCallback;