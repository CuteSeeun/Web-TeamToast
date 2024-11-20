import React, { useEffect, useState } from 'react';
import { LoginWrap } from '../../components/NavStyle'; 
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login:React.FC = () => {
    const [useremail , setUseremail] = useState<string>('');
    const [userpw , setUserpw] = useState<string>('');
    const navi = useNavigate();

    const infoCheck = async(e:React.FormEvent)=>{
        e.preventDefault();
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
            const response= await axios.post('http://localhost:3333/editUser/loginUser',{
                useremail,
                userpw
            });

            const {user,token} = response.data;

            if (!user || !token) {
                throw new Error('로그인 응답 데이터가 올바르지 않습니다.');
            }

            sessionStorage.setItem('token',token);
            navi('/')
            window.location.reload();

        } catch (error:any) {
            if (error.response && error.response.status === 403) {
                alert('이메일 인증이 필요합니다.');
            } else if (error.response && error.response.status === 401) {
                alert('아이디와 비밀번호를 다시 확인해주세요');
            } else {
                console.error('로그인 중 문제가 발생했습니다:', error);
                alert('로그인 중 문제가 발생했습니다.');
            }
        }
    };

    const getKakao = async() =>{
        try {
            const response = await axios.get('http://localhost:3333/editUser/kakao-login');
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
                <div className="inputBox">
                    <input type="text" value={useremail} onChange={e=> setUseremail(e.target.value)} placeholder='이메일를 입력해주세요' />
                </div>
                <div className="inputBox">
                    <input type="password" value={userpw} onChange={e=> setUserpw(e.target.value)} placeholder='비밀번호를 입력해주세요' />
                </div>
                <div>
                    <button type='submit' className='loginBtn' onClick={infoCheck}>로그인</button>
                </div>
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
            </div>
        </LoginWrap>
    );
};

export default Login;