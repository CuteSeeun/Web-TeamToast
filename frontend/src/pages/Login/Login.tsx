import React, { useEffect, useState } from 'react';
import { LoginWrap } from '../../components/NavStyle'; 
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccessToken from './AccessToken';

const Login:React.FC = () => {
    const [useremail , setUseremail] = useState<string>('');
    const [userpw , setUserpw] = useState<string>('');
    // const [isLoading,setIsLoading] = useState<boolean>(false);
    const navi = useNavigate();

    //로그인 정보 확인
    // 입력값 유효성 확인하고 서버에 로그인 요청함
    // 로그인 성공 시 토큰 저장
    const infoCheck = async(e:React.FormEvent)=>{
        e.preventDefault();

        console.log('Sending login data:', { useremail, userpw });


        if(useremail === '' && userpw === ''){
            alert('아이디와 비밀번호를 입력해주세요');
            return;
        }else if(useremail === ''){
            alert('아이디를 입력해주세요');
            return;
        }else if(userpw === ''){
            alert('비밀번호를 입력해주세요');
            return;
        }
        
        try {
            console.log('Attempting login with:', { useremail, userpw });
            const response= await axios.post('http://localhost:3001/editUser/loginUser',{
                useremail,
                userpw
            },{
                timeout:5000 // 5초 설정
            });

            console.log('Login response:', response.data); 

            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken',accessToken);
          
            await navi('/');
            await setTimeout(() => window.location.reload(), 100);

        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                alert('서버 응답 시간이 초과되었습니다. 다시 시도해주세요.');
            } else if (error.code === 'ECONNREFUSED') {
                alert('서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.');
            } else if (error.response?.status === 403) {
                alert('이메일 인증이 필요합니다.');
            } else if (error.response?.status === 401) {
                alert('아이디와 비밀번호를 다시 확인해주세요');
            } else {
                console.error('로그인 중 문제가 발생했습니다:', error);
                alert('로그인 중 문제가 발생했습니다.');
            }
        }
    };

    // 카카오 소셜 로그인 처리
    // 서버로부터 카카오 로그인 url 받아와서 리다이렉트
    const getKakao = async() =>{
        try {
            // const response = await axios.get('http://localhost:3001/editUser/kakao-login');
            const response = await axios.get('/editUser/kakao-login');
            const {redirectUrl} = response.data;
            window.location.href = redirectUrl;
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <LoginWrap>
            <div className="inner">
                <h2>로그인</h2>
                <p>TeamToast에 오신 것을 환영합니다.</p>
                <form onSubmit={infoCheck}> 
                <div className="inputBox">
                    <input type="text" value={useremail} onChange={e=> setUseremail(e.target.value.trim())} placeholder='이메일를 입력해주세요' />
                </div>
                <div className="inputBox">
                    <input type="password" value={userpw} onChange={e=> setUserpw(e.target.value.trim())} placeholder='비밀번호를 입력해주세요' />
                </div>
                <div>
                    <button type='submit' className='loginBtn'>로그인</button>
                </div>
                </form>
                <div className="social-section">
                    <div className="line-wrapper">
                        <div className="line"></div>
                        <span className='social-text'>또는</span>
                        <div className="line"></div>
                    </div>
                </div>
                <div className='social-media'>
                    <button type="button" className='kakaoBtn' onClick={getKakao}>
                        <i><RiKakaoTalkFill /></i><span>카카오 로그인/회원가입</span>
                    </button>
                    <button type="button" className='googleBtn'>
                        <i><FcGoogle /></i><span>구글 로그인/회원가입</span>
                    </button>
                </div>

                <div className='join-pass'>
                    <span onClick={() => navi('/join')}>회원가입</span>
                    <span onClick={() => navi('/pass')}>비밀번호 찾기</span>
                </div>

            </div>
        </LoginWrap>
    );
};

export default Login;