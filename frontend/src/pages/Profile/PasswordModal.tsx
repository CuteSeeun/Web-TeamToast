import React, { useEffect, useState } from 'react';
import { PasswordModalWrap } from './profileStyle';
import axios from 'axios';
import AccessToken from '../Login/AccessToken';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
 }

const PasswordModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {

    const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [currentPasswordValid, setCurrentPasswordValid] = useState<boolean | null>(null);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

    //현재 비밀번호 확인
    const checkCurrentPassword = async(password:string)=>{
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }

            const response = await AccessToken.post('http://localhost:3001/editUser/check-password',{
                currentPw : password});
            setCurrentPasswordValid(response.data.valid);
        } catch (error) {
            setCurrentPasswordValid(false);
        }
    }

    //현재 비밀번호 입력 시 검증
    useEffect(()=>{
        if(currentPassword.length > 0){
            const timer = setTimeout(()=>{
                checkCurrentPassword(currentPassword);
            },100)
        return () => clearTimeout(timer);
        }
    },[currentPassword]);

    //새 비밀번호 일치 여부 확인
    useEffect(()=>{
        if(newPassword && confirmPassword){
            setPasswordsMatch(newPassword === confirmPassword);
        }
    },[newPassword,confirmPassword]);

   const handleSubmit = async(e: React.FormEvent) => {
       e.preventDefault();

        if(!currentPasswordValid || !passwordsMatch){
            alert('비밀번호를 확인해주세요')
            return;
        }
        try {
            await AccessToken.post('http://localhost:3001/editUser/change-password',{
                currentPw: currentPassword,
                newpw: newPassword
            })
            alert('비밀번호가 성공적으로 변경되었습니다.');
            onClose();
            window.location.reload();
        } catch (error) {
            alert('비밀번호 변경 중 오류가 발생했습니다.');            
        }
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
                       {currentPassword && (
                           <div className={currentPasswordValid ? 'valid-feedback' : 'invalid-feedback'}>
                               {currentPasswordValid ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                           </div>
                       )}
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
                       {confirmPassword && (
                           <div className={passwordsMatch ? 'valid-feedback' : 'invalid-feedback'}>
                               {passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                           </div>
                       )}
                   </div>
                   <div className="button-group">
                       <button type="button" className="cancel-btn" onClick={onClose}>
                           취소
                       </button>
                       <button 
                           type="submit" 
                           className="submit-btn"
                           disabled={!currentPasswordValid || !passwordsMatch}
                       >
                           수정
                       </button>
                   </div>
               </form>
           </div>
        </PasswordModalWrap>
    );
};

export default PasswordModal; 