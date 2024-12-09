//인트로에서 요금 페이지

import React from 'react';
import { RatePlanWrap } from './ratePlanStyle';
import { PriceCard } from '../Payment/priceStyle';

const RatePlan = () => {

    return (
        <RatePlanWrap>
             <div className="maincontainer">
                {/* Standard Plan */}
                <PriceCard>
                    <h2>Standard</h2>
                    <button disabled className="freebtn">Free</button>
                    <p><span>기본 요금제</span></p>
                    <p><span>가격 :</span> 무료</p>
                    <p><span>사용 가능 인원 :</span> 최대 10명</p>
                    <p className="description"><span>특징 :</span> 소규모 팀에 적합한 무료 플랜</p>
                        <p><b>포함 사항:</b></p>
                        <ul>
                            <li>무제한 목표, 프로젝트, 작업 및 양식</li>
                            <li>백로그, 목록, 보드, 타임라인, 캘린더</li>
                            <li>보고서 및 대시보드</li>
                            <li>2GB의 저장 용량</li>
                            <li>Atlassian 커뮤니티에서 지원</li>
                        </ul>
                </PriceCard>

                {/* Team Plan */}
                <PriceCard>
                    <h2>Team</h2>
                    <button disabled className="teambtn">Team</button>
                    <p><span>팀 요금제</span></p>
                    <p><span>가격 :</span> 인원당 월 3,000원</p>
                    <p>(10명 초과 시 적용)</p>
                    <p><span>사용 가능 인원 :</span> 11명 이상</p>
                    <p className="description"><span>특징 :</span> 중대형 팀에 적합한 플랜</p>
                    <p><b>포함 사항:</b></p>
                    <ul>
                        <li>사용자 역할 및 권한</li>
                        <li>외부 공동 작업</li>
                        <li>다중 지역 데이터 보존</li>
                        <li>250GB 스토리지</li>
                        <li>9/5 지역별 지원</li>
                        <li>단일 사이트에서 최대 50,000명의 사용자</li>
                    </ul>
                </PriceCard>
            </div>
        </RatePlanWrap>
    );
};

export default RatePlan;