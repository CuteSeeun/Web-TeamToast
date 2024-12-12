import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import { Link, useNavigate } from 'react-router-dom';
import { IntroWrap } from './introStyle';

const Intro = () => {

    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const loginGo = () =>{
        alert('로그인 후 사용해주세요.');
    }

    return (
        <IntroWrap>
             <div className="intro-container">
                <div className="text-section">
                    <h1 className="main-title">일이 술술 풀리는 협업툴 TeamToast</h1>
                    <p className="sub-title">
                        원활한 소통과 매끄러운 업무 흐름을 가장 쉬운 협업 공간, 잔디에서 경험해 보세요.
                    </p>
                    <div className="button-group">
                        {user ? (
                            <>
                                 <button className="secondary-button" onClick={() => navigate('/space')}>
                            입장하기
                        </button>
                            </>
                        ):(
                            <>
                             <button className="secondary-button" onClick={() => navigate('/signup')}>
                            회원가입
                        </button>
                            </>
                        )
                    }
                       
                    </div>
                </div>
                <div className="visual-section">
                    
                </div>
            </div>
        </IntroWrap>
    );
};

export default Intro;