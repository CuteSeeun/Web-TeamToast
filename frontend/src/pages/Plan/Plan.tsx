import React, { useState } from 'react';
import { PlanWrap } from './planStyle';

const Plan = () => {
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'team'>('team');


    const handlePlanSelect = (plan: 'free' | 'team') => {
        setSelectedPlan(plan);
    };

    const handlePlanChange = () => {
        setShowPlanModal(true);
    };

    const closePlanModal = () => {
        setShowPlanModal(false);
    };

    return (
        <PlanWrap>
             <div className="plan-section">
                <div className="plan-options">
                    <div className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('free')}
                    >
                        <input 
                            type="radio" 
                            name="plan" 
                            value="free" 
                            checked={selectedPlan === 'free'}
                            onChange={() => handlePlanSelect('free')}
                        />
                        <div className="plan-info">
                            <h3>무료 요금제</h3>
                            <p>팀 인원</p>
                            <p>10명까지 사용 가능</p>
                            <p className="price">￦0 / 월</p>
                        </div>
                    </div>

                    <div className={`plan-card ${selectedPlan === 'team' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('team')}  // 추가
                   >
                        <input 
                            type="radio" 
                            name="plan" 
                            value="team"
                            checked={selectedPlan === 'team'}
                            onChange={() => handlePlanSelect('team')}
                        />
                        <div className="plan-info">
                            <h3>팀 요금제</h3>
                            <p>팀 인원</p>
                            <p>11명 이상부터 사용</p>
                            <p className="price">인당 ￦3,000 / 월</p>
                        </div>
                    </div>
                </div>

                <div className="calculator">
                    <h3>팀 요금제 계산기</h3>
                    <div className="calc-row">
                        <span>현재 인원</span>
                        <span>7명</span>
                    </div>
                    <div className="calc-row">
                        <span>추가 인원</span>
                        <input type="number" defaultValue="15" /> 명
                    </div>
                    <div className="summary">
                        <div className="row">
                            <span>무료</span>
                            <span>7명</span>
                        </div>
                        <div className="row">
                            <span>추가 인원</span>
                            <span>12명 × ￦3,000 = ￦36,000</span>
                        </div>
                    </div>
                    <div className="total-price">
                        <span>월별 결제 요금</span>
                        <span>￦36,000</span>
                    </div>
                    <button className="change-btn" onClick={handlePlanChange}>변경</button>
                </div>
            </div>

            {showPlanModal && (
               <div className="modal-overlay">
               <div className="modal">
                   <h3>플랜 변경 안내</h3>
                   <div className="modal-content">
                       <p>플랜이 성공적으로 변경되었습니다.</p>
                       <p>변경된 인원 수에 따라 월 요금이 조정되며,</p>
                       <p>다음 결제일에 반영됩니다.</p>
                       <p>인원을 줄인 경우: 남은 기간에 대한 금액이 다음 결제일에 차감됩니다.</p>
                   </div>
                   <div className="button-group">
                       <button onClick={closePlanModal} className="confirm">확인</button>
                       <button className="maximize">사용자 초대하기</button>
                   </div>
               </div>
           </div>
            )}
        </PlanWrap>
    );
};

export default Plan;