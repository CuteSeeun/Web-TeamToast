import React from 'react';
import { IntroHeaderWrap } from '../../styles/HeaderStyle';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import axios from 'axios';
import AccessToken from '../Login/AccessToken';

const IntroHeader = () => {

    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const logoutGo = async() =>{
        try {
            const accessToken = localStorage.getItem('accessToken');
            if(accessToken){
                await AccessToken.post('http://localhost:3001/editUser/logout',{},{
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                });
            }
            const confirmed = window.confirm('로그아웃 하시겠습니까?');
            if(confirmed){
                // 토큰 삭제
                localStorage.removeItem('accessToken');
                // 리코일 초기화
                setUser(null);
                // 인트로 이동
                navigate('/');
                // 새로고침
                window.location.reload();
            }
        } catch (error) {
            console.error('로그아웃 중 에러 발생:', error);
            // 에러가 발생하더라도 로컬의 데이터는 삭제
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    }


    return (
        <IntroHeaderWrap>
           <div className='headerIntro'>


                <div className="leftIntro">
                    <h1>
                        <Link to="/" className="logo">TeamToast</Link>
                    </h1>
                    <nav>
                        <Link to="/rate" className="nav-link">요금</Link>
                    </nav>
                </div>

                {user ? (
                    <>
                    <div className="rightIntro">
                    <div className="menu-wrap">
                    <div className="user-circle">
                            {user?.uname?.charAt(0)} 
                        </div>
                        <ul className="sub-menu">
                            <Link to='/profile'><li>프로필</li></Link>
                            <li onClick={logoutGo}>로그아웃</li>
                        </ul>
                    </div>
                    </div>
                    </>
                ):(
                <div className="rightIntro">
                    <Link to="/join" className="btn btn-signup">회원가입</Link>
                    <Link to="/login" className="btn btn-login">로그인</Link>
                </div>

                )
            }

            </div>
        </IntroHeaderWrap>
    );
};

export default IntroHeader;