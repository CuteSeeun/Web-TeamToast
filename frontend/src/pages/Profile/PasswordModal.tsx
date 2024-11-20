import React, { useState } from 'react';
import { PasswordModalWrap } from './profileStyle';


interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
 }

const PasswordModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {

    const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       // 비밀번호 변경 로직
       onClose();
   };

   if (!isOpen) return null;

    return (
        <PasswordModalWrap>
             <div className="modal-content">
               <h3>비밀번호 수정</h3>
               <form onSubmit={handleSubmit}>
                   <div className="input-box">
                       <label>현재 비밀번호</label>
                       <input
                           type="password"
                           value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)}
                           placeholder="현재 비밀번호를 입력해 주세요."
                       />
                   </div>
                   <div className="input-box">
                       <label>새 비밀번호</label>
                       <input
                           type="password"
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           placeholder="새 비밀번호를 입력해 주세요."
                       />
                   </div>
                   <div className="input-box">
                       <label>새 비밀번호 확인</label>
                       <input
                           type="password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           placeholder="새 비밀번호를 한 번 더 입력해 주세요."
                       />
                   </div>
                   <div className="button-group">
                       <button type="button" className="cancel-btn" onClick={onClose}>
                           취소
                       </button>
                       <button type="submit" className="submit-btn">
                           수정
                       </button>
                   </div>
               </form>
           </div>
        </PasswordModalWrap>
    );
};

export default PasswordModal; 