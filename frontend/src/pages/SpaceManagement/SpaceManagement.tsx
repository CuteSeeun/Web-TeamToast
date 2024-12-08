import React, { useEffect, useState } from 'react';
import { SpaceEditWrap } from '../../components/SpaceStyle';
import { useNavigate } from 'react-router-dom';
import AccessToken from '../Login/AccessToken';

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

const SpaceManagement = () => {
    const [spaceName, setSpaceName] = useState(''); // 스페이스 이름
    const [deleteSpaceName, setDeleteSpaceName] = useState(''); // 스페이스 삭제 입력
    const [validationMsg, setValidationMsg] = useState<ValidationMessage | null>(null); // 검증 메시지
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달
    const [activeTab, setActiveTab] = useState<'space' | 'plan'>('space'); // 탭 상태
    const currentSid = sessionStorage.getItem('sid')
    const navi = useNavigate();



    useEffect(() => {
        // 로컬에서 uuid 가져옴
        // const currentUuid = localStorage.getItem('currentSpaceUuid');
        if(!currentSid){
            alert('스페이스 정보가 없습니다.');
            navi('/space')
            return;
        }

        // 스페이스 이름 가져오기
        const fetchSpaceName = async() =>{
            try {
                const response = await AccessToken.get(`/space/get-space/${currentSid}`); // 
                setSpaceName(response.data.spaceName);
            } catch (error) {
                console.error('스페이스 정보를 가져오는 데 실패함',error);
                alert('스페이스 정보를 불러오지 못했습니다.');
                navi('/space');
            }
        };
        fetchSpaceName();
    }, [navi]);


    // 스페이스 이름 수정 
    const handleSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceName(e.target.value);
    };


    // 스페이스 삭제 
    const handleDeleteSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeleteSpaceName(value);

        if (value === '') {
            setValidationMsg(null);
        } else if (value === spaceName) {
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

    // 스페이스 이름 수정 요청
    const handleUpdate = async () => {
    //    const currentUuid = localStorage.getItem('currentSpaceUuid');
       if(!currentSid) return;
       try {
           await AccessToken.put(`/space/update-space/${currentSid}`,{sname:spaceName , sid:currentSid});
           alert('스페이스 이름이 수정되었습니다.');
        } catch (error) {
            console.error('스페이스 이름 수정 실패 : ',error);
            alert('스페이스 이름 수정에 실패했습니다.');
        }
    };

    // 스페이스 삭제 
    const handleDelete = () => {
        if (deleteSpaceName !== spaceName) {
            alert('스페이스 명을 다시 확인해주세요.');
            return;
        }
        setShowDeleteModal(true);
    };

    // 스페이스 삭제 요청
    const confirmDelete = async () => {
        // const currentUuid = localStorage.getItem('currentSpaceUuid');
       if(!currentSid) return;
       try {
           await AccessToken.delete(`/space/delete-space/${currentSid}`);
        //    alert('스페이스가 삭제되었습니다.');
           setShowDeleteModal(false);
           navi('/space');
        } catch (error) {
            console.error('스페이스 삭제 실패 : ',error);
            alert('스페이스 삭제에 실패했습니다.');
        }
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
           </div>

           <h1>{activeTab === 'space' ? '스페이스 관리' : ''}</h1>

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
                                   placeholder="스페이스 이름"
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

           {/* {activeTab === 'plan' && (
                 <div className="plan-section">
                 <h2>플랜 정보</h2>
                 <div className="plan-info-grid">
                     <div className="info-row">
                         <span>내 요금제</span>
                         <span>팀 요금제</span>
                     </div>
                     <div className="info-row">
                         <span>추가 인원</span>
                         <span>8명</span>
                     </div>
                     <div className="info-row">
                         <span>월별 결제 요금</span>
                         <span>24,000 원</span>
                     </div>
                 </div>
                 <button className="plan-manage-btn" onClick={()=>navi('/plan')}>플랜 관리</button>

                 <div className="card-info">
                     <h2>카드 정보</h2>
                     <div className="info-row">
                         <span>카드번호</span>
                         <span>**** **** **** 4242</span>
                     </div>
                     <button className="card-change-btn">카드 변경하기</button>
                 </div>
             </div>
            )} */}
        </SpaceEditWrap>
    );
};

export default SpaceManagement;