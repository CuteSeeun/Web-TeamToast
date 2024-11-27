import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userState } from '../../recoil/atoms/userAtoms';
import { useSetRecoilState } from 'recoil';

const OAuthCallback = () => {
    const location = useLocation();
    const navi = useNavigate();
    const setUser = useSetRecoilState(userState);


    useEffect(()=>{
        const code = new URLSearchParams(location.search).get('code');
        if(code){
            // axios.post('http://localhost:3001/editUser/kakao-token',{code},
            axios.post('/editUser/kakao-token',{code},
                {
                     baseURL: 'http://localhost:8080'
                }
            )
            .then(response => {
                const {token,user} = response.data;
                sessionStorage.setItem('token',token);
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