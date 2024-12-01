import React, { useEffect, useState } from 'react';
import { PassFindModalWrap } from '../../components/NavStyle';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newPassword: string) => void;
 }

const PassFindModal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passOk, setPassOk] = useState(false);


    // 비밀번호 일치 여부 확인
    useEffect(() => {
        if(confirmPassword) {
            setPassOk(newPassword === confirmPassword);
        }
    }, [newPassword, confirmPassword]);

    // 모달 닫히면 값들 초기화
    useEffect(() => {
        if (!isOpen) {
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setPassOk(false);
        }
    }, [isOpen]);


    //비밀번호 변경 함수
    const handleSubmit = () => {
        if (newPassword === '') {
            setError('새 비밀번호를 입력해주세요.');
            return;
        }
        if (confirmPassword === '') {
            setError('비밀번호 확인을 입력해주세요.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 8) {
            setError('비밀번호는 8자리 이상이어야 합니다.');
            return;
        }
        // 모든 유효성 검사 통과 하면 비밀번호 변경
        onSubmit(newPassword);
        // 나머지는 상태 초기화 및 모달 끄기
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setPassOk(false);
        onClose();
    };
    
    //모달 닫혀있으면 null 반환
    if (!isOpen) return null;

    return (
        <PassFindModalWrap>
            <div className="modal-content">
            <h3>새 비밀번호 설정</h3>
            
            <div className="input-box">
                <label>새 비밀번호 [8자리 이상]</label>
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력해주세요"
                />
            </div>

            <div className="input-box">
                <label>새 비밀번호 확인</label>
                <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                />
                        {confirmPassword && (
                            <span style={{
                                color: passOk ? 'green' : 'red', 
                                fontSize: '12px',
                                display: 'block',
                                marginTop: '5px'
                        }}>
                            {passOk ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </span>
                    )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
                <button className="cancel-btn" onClick={onClose}>취소</button>
                <button className="submit-btn" onClick={handleSubmit}>확인</button>
            </div>
        </div>
        </PassFindModalWrap>
    );
};

export default PassFindModal;