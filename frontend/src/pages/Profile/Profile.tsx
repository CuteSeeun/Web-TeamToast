import React, { useState } from 'react';
import { ProfileWrap } from './profileStyle';
import { Link } from 'react-router-dom';
import PasswordModal from './PasswordModal';

// interface ProfileProps {
//     isAdmin?: boolean;
// }

const Profile = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <ProfileWrap>
              <h1>프로필</h1>
            
            <div className="profile-container">
                <div className="info-section">
                    <h2>회원정보</h2>
                    
                    <div className="form-row">
                        <label>이름</label>
                        <input type="text" value="사용자1"  />
                    </div>

                    <div className="form-row">
                        <label>이메일</label>
                        <input type="email" value="user1@example.com"  />
                    </div>

                    <div className="form-row">
                        <label>비밀번호</label>
                        <div className="password-group">
                            <button className="change-pwd-btn" 
                             onClick={() => setIsPasswordModalOpen(true)}>비밀번호 변경하기</button>
                            <button className="save-btn">수정</button>
                        </div>
                    </div>
                </div>

                 <div className="info-section">
                    <h2>플랜 정보</h2>
                    <div className="plan-info">
                        <div className="info-row">
                            <span className="label">내 요금제</span>
                            <span className="value">팀 요금제</span>
                        </div>
                        <div className="info-row">
                            <span className="label">추가 인원</span>
                            <span className="value">8명</span>
                        </div>
                        <div className="info-row">
                            <span className="label">월별 결제 요금</span>
                            <span className="value">24,000 원</span>
                        </div>
                        <Link to='/plan'>
                        <button className="plan-btn">플랜 관리</button>
                        </Link>
                    </div>

                    <h2>카드 정보</h2>
                    <div className="card-info">
                        <div className="info-row">
                            <span className="label">카드번호</span>
                            <span className="value">**** **** **** 4242</span>
                        </div>
                        <button className="card-btn">카드 변경하기</button>
                    </div>
                </div>
            </div>

            <PasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </ProfileWrap>
    );
};

export default Profile;