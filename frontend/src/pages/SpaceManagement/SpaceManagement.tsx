import React, { useEffect, useState } from 'react';
import { SpaceEditWrap } from '../../components/SpaceStyle';
import { userState } from '../../recoil/userAtoms';
import { useRecoilValue } from 'recoil';

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

const SpaceManagement = () => {

    const currentSpace = useRecoilValue(userState); // 현재 스페이스 정보
    const [spaceName, setSpaceName] = useState('');
    const [deleteSpaceName, setDeleteSpaceName] = useState('');
    const [validationMsg, setValidationMsg] = useState<ValidationMessage | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'space' | 'plan'>('space');



    useEffect(() => {
        if (currentSpace?.name) {
            setSpaceName(currentSpace.name);
        }
    }, [currentSpace]);

    const handleSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceName(e.target.value);
    };

    const handleDeleteSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeleteSpaceName(value);

        if (value === '') {
            setValidationMsg(null);
        } else if (value === currentSpace?.name) {
            setValidationMsg({
                text: '스페이스 명이 동일합니다.',
                type: 'success'
            });
        } else {
            setValidationMsg({
                text: '스페이스 명이 다릅니다.',
                type: 'error'
            });
        }
    };

    const handleUpdate = async () => {
        try {
            // API 호출로 스페이스 이름 수정
            // await updateSpace(spaceName);
            alert('스페이스 이름이 수정되었습니다.');
        } catch (error) {
            alert('스페이스 이름 수정에 실패했습니다.');
        }
    };

    const handleDelete = () => {
        if (deleteSpaceName !== currentSpace?.name) {
            alert('스페이스 명을 다시 확인해주세요.');
            return;
        }
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
    };

    const handlePlanChange = () => {
        setShowPlanModal(true); // 플랜 모달 열기
    };

    const closePlanModal = () => {
        setShowPlanModal(false); // 플랜 모달 닫기
    };


    return (
        <SpaceEditWrap>
            <div className="tab-menu">
               <button 
                   className={`tab-button ${activeTab === 'space' ? 'active' : ''}`}
                   onClick={() => setActiveTab('space')}
               >
                   스페이스 관리
               </button>
               <button 
                   className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}
                   onClick={() => setActiveTab('plan')}
               >
                   플랜 관리
               </button>
           </div>

           <h1>{activeTab === 'space' ? '스페이스 관리' : '플랜 관리'}</h1>

           {activeTab === 'space' && (
               <>
                   <div className="edit-section">
                       <h2>스페이스 수정</h2>
                       <div className="name-edit">
                           <label>스페이스 이름</label>
                           <div className="input-group">
                               <input 
                                   type="text" 
                                   value={spaceName}
                                   onChange={handleSpaceNameChange}
                                   placeholder="스페이스 이름 1"
                               />
                               <button className="confirm-btn" onClick={handleUpdate}>수정</button>
                           </div>
                       </div>
                   </div>

                   <div className="delete-section">
                       <h2>스페이스 삭제</h2>
                       <div className="delete-info">
                           <p className="warning">이 스페이스를 삭제하면 다음과 같은 정보들이 영구적으로 삭제됩니다.</p>
                           <ul>
                               <li>• 스페이스 내 모든 프로젝트와 관련된 데이터</li>
                               <li>• 프로젝트에 포함된 스크린샷, 이슈, 뷰잉 및 모든 활동 기록</li>
                               <li>• 이 스페이스에 연결된 모든 사용자 및 권한 설정</li>
                           </ul>
                           <p className="note">삭제된 데이터는 복구할 수 없으니 신중히 확인해 주세요.</p>
                           
                           <div className="delete-confirm">
                               <p>계속하려면 삭제할 스페이스의 이름을 입력해 주세요.</p>
                               <div className="input-group">
                                   <input 
                                       type="text" 
                                       value={deleteSpaceName}
                                       onChange={handleDeleteSpaceNameChange}
                                       placeholder="스페이스의 이름을 입력해 주세요."
                                   />
                                   {validationMsg && (
                                       <p className={`validation-message ${validationMsg.type}`}>
                                           {validationMsg.text}
                                       </p>
                                   )}
                                   <button className="delete-btn" onClick={handleDelete}>삭제</button>
                               </div>
                           </div>
                       </div>
                   </div>

                   {showDeleteModal && (
                       <div className="modal-overlay">
                           <div className="modal">
                               <h3>스페이스 삭제 완료</h3>
                               <p>해당 스페이스 삭제가 완료되었습니다.</p>
                               <button onClick={confirmDelete} className="confirm">확인</button>
                           </div>
                       </div>
                   )}
               </>
           )}

           {activeTab === 'plan' && (
               <div className="plan-section">
                   <div className="plan-options">
                       <div className="plan-card">
                           <input 
                               type="radio" 
                               name="plan" 
                               value="free" 
                           />
                           <div className="plan-info">
                               <h3>무료 요금제</h3>
                               <p>팀 인원</p>
                               <p>10명까지 사용 가능</p>
                               <p className="price">￦0 / 월</p>
                           </div>
                       </div>

                       <div className="plan-card selected">
                           <input 
                               type="radio" 
                               name="plan" 
                               value="team" 
                               checked 
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
           )}
            {showPlanModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>플랜 변경 완료</h3>
                        <p>
                            플랜이 성공적으로 변경되었습니다. 
                        <p>변경된 인원 수에 따라 월 요금이 조정되며, 다음
                        결제일에 반영됩니다.</p> 
                        </p>
                        <button onClick={closePlanModal} className="confirm">
                            확인
                        </button>
                    </div>
                </div>
            )}
        </SpaceEditWrap>
    );
};

export default SpaceManagement;