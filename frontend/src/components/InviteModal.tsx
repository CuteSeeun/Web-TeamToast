//팀원 초대 모달

import React, { useState } from 'react';
import { ProjectInviteWrap } from '../styles/InviteModal';


interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProjectInvite = ({ isOpen, onClose }: InviteUserModalProps) => {

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('관리자');  // 기본값 '관리자'로 설정

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 초대 로직 구현
        console.log('초대:', { email, role });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ProjectInviteWrap>
             <div className="modal-content">
                <h3>사용자 초대</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>사용자 이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력해 주세요."
                        />
                    </div>

                    <div className="input-group">
                        <label>권한</label>
                        <div className="select-wrapper">
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="관리자">관리자</option>
                                <option value="멤버">멤버</option>
                            </select>
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="button" className="cancel" onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className="invite">
                            초대
                        </button>
                    </div>
                </form>
            </div>
        </ProjectInviteWrap>
    );
};

export default ProjectInvite;