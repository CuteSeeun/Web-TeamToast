//인트로에서 요금 페이지

import React from 'react';
import { RatePlanWrap } from './ratePlanStyle';
import { Link, useNavigate } from 'react-router-dom';
import { userState } from '../../recoil/atoms/userAtoms';
import { useRecoilValue } from 'recoil';
import { PriceCard } from '../Payment/priceStyle';

const RatePlan = () => {

    return (
        <RatePlanWrap>
            <div className="maincontainer">
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
                   <button disabled className="freebtn">Team</button>
                   <p><span>팀 요금제</span></p>
                   <p><span>가격 :</span> 인원당 월 3,000원</p>
                   <p>(10명 초과시 적용)</p>
                   <p><span>사용 가능 인원 :</span> 11명 이상</p>
                   <p className="description"><span>특징 :</span> 중대형 팀에 적합한 플랜</p>
               </PriceCard>
           </div>
            
        </RatePlanWrap>
    );
};

export default RatePlan;