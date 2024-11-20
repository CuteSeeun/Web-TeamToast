import React, { useState } from 'react';
import { PaymentWrap } from './priceStyle';
import PaymentModal from './PaymentModal';

const Payment = () => {
    const [additionalMembers, setAdditionalMembers] = useState(11);
    const baseMembers = 7;
    const freeMembers = 10;
    const pricePerPerson = 3000;

    const [modalState, setModalState] = useState<'none' | 'confirm' | 'complete'>('none');

    const handlePayment = () => {
        setModalState('confirm');  // 확인 모달 표시
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setModalState('none');
    };

    // 결제 확인
    const handleConfirmPayment = () => {
        setModalState('complete');  // 완료 모달로 변경
    };

    // 사용자 초대 페이지로 이동
    const handleInviteUsers = () => {
        // 사용자 초대 페이지로 이동하는 로직
        setModalState('none');
    };
 
    const totalMembers = baseMembers + additionalMembers;
    const extraMembers = totalMembers > freeMembers ? totalMembers - freeMembers : 0;
    const totalPrice = extraMembers * pricePerPerson;
 

    return (
        <PaymentWrap>
             <div className="container">
                <h2>결제</h2>
               <div className="card">
                   <h3 className="subtitle">플랜 종류</h3>
                   <div className="plan-info">
                       <p>기본 플랜: 최대 10명까지 무료</p>
                       <p>월별 팀 요금제: 월 3,000원 x 초과 인원 수</p>
                   </div>

                   <div className="section">
                       <h4>팀 요금제 계산기</h4>
                       <div className="flex-box">
                           <span>현재 인원</span>
                           <span>{baseMembers} 명</span>
                       </div>
                       <div className="flex-box">
                           <span>추가 인원</span>
                           <div className="input-with-unit">
                               <input
                                   type="number"
                                   value={additionalMembers}
                                   onChange={(e) => setAdditionalMembers(Number(e.target.value))}
                               />
                               <span>명</span>
                           </div>
                       </div>
                       
                       <div className="divider">
                           <div className="flex-box mute">
                               <span>무료</span>
                               <span>기본플랜 10명 무료</span>
                           </div>
                       </div>

                       <div className="flex-box price">
                           <span>초과 인원 요금</span>
                           <span>초과인원 {extraMembers}명 x {pricePerPerson.toLocaleString()}원 = {totalPrice.toLocaleString()}원</span>
                       </div>

                       <div className="total">
                           <div className="flex-box">
                               <span>월별 결제 요금</span>
                               <span>{totalPrice.toLocaleString()}원</span>
                           </div>
                       </div>
                   </div>
               </div>

                <div className="card">
                    <h3 className="subtitle">결제 방법</h3>
                    
                    <div className="input-group">
                        <label>신용카드번호</label>
                        <input placeholder="16자리 숫자" />
                    </div>
                    
                    <div className="input-group">
                        <label>유효기간</label>
                        <div className="flex-box">
                            <input className="medium" placeholder="년도" />
                            <input className="medium" placeholder="월" />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>CVV번호</label>
                        <input placeholder="카드 뒷면 3자리" />
                    </div>
                    
                    <div className="input-group">
                        <label>카드 소유자 이름</label>
                        <input placeholder="카드에 표시된 이름" />
                    </div>
                    
                    <div className="input-group">
                        <label>우편번호</label>
                        <input />
                    </div>

                    <div className="button-group">
                        <button className="outline">취소</button>
                        <button className="primary" onClick={handlePayment}>결제</button>
                    </div>
                </div>
            </div>

            {modalState === 'confirm' && (
                <PaymentModal 
                    type="confirm"
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmPayment}
                />
            )}

            {modalState === 'complete' && (
                <PaymentModal 
                    type="complete"
                    onClose={handleCloseModal}
                    onConfirm={handleInviteUsers}
                />
            )}

        </PaymentWrap>
    );
};

export default Payment;