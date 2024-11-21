import React from 'react';
import { IntroHeaderWrap } from '../../styles/HeaderStyle';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';

const IntroHeader = () => {

    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const logoutGo = () =>{
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if(confirmed){
            setUser(null);
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload();
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
                            {user?.name?.charAt(0)} 
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