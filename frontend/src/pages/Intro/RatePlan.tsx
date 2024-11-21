//인트로에서 요금 페이지

import React from 'react';
import { RatePlanWrap } from './ratePlanStyle';
import { Link, useNavigate } from 'react-router-dom';
import { userState } from '../../recoil/atoms/userAtoms';
import { useRecoilValue } from 'recoil';

interface User {
    isLoggedIn: boolean;
    role: 'admin' | 'member' | null;
}

const RatePlan = () => {
    const navigate = useNavigate();
    const userRecoil = useRecoilValue(userState);
    
    
    // 실제로는 전역 상태 관리(Redux, Context 등)나 API를 통해 받아올 유저 정보
    const user: User = {
        isLoggedIn: !!userRecoil, // 로그인 상태
        role: userRecoil?.role // 유저 권한
    };

    const handleUpgradeClick = () => {
        if (!user.isLoggedIn) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }

        if (user.role !== 'admin') {
            alert('관리자만 접근할 수 있는 서비스입니다.');
            return;
        }

        // 관리자인 경우에만 payment 페이지로 이동
        navigate('/payment');
    };

    const getUpgradeButton = () => {
        // 관리자인 경우에만 Link 컴포넌트로 감싸기
        if (user.isLoggedIn && user.role === 'admin') {
            return (
                <Link to='/payment'>
                    <button className="teambtn">업그레이드</button>
                </Link>
            );
        }

        // 그 외의 경우 일반 버튼으로 표시
        return (
            <button 
                className="teambtn" 
                onClick={handleUpgradeClick}
            >
                업그레이드
            </button>
        );
    };
    return (
        <RatePlanWrap>
            {/* <div className="maincontainer">
               <PriceCard>
                   <h2>Standard</h2>
                   <button disabled className="freebtn">Free</button>
                   <p><span>기본 요금제</span></p>
                   <p><span>가격 :</span> 무료</p>
                   <p><span>사용 가능 인원 :</span> 최대 10명</p>
                   <p className="description"><span>특징 :</span> 소규모 팀에 적합한 무료 플랜</p>
               </PriceCard>
               
               <PriceCard>
                   <h2>Team</h2>
                   {getUpgradeButton()}
                   <p><span>팀 요금제</span></p>
                   <p><span>가격 :</span> 인원당 월 3,000원</p>
                   <p>(10명 초과시 적용)</p>
                   <p><span>사용 가능 인원 :</span> 11명 이상</p>
                   <p className="description"><span>특징 :</span> 중대형 팀에 적합한 플랜</p>
               </PriceCard>
           </div> */}
            
        </RatePlanWrap>
    );
};

export default RatePlan;