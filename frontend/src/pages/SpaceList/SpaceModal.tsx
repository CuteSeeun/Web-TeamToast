import React, { useState } from 'react';
import { SpaceModalWrap } from '../../components/SpaceStyle';

interface SpaceModalProps {
    onClose: () => void;
    onConfirm: (spaceName:string) => Promise<void>;
}

const SpaceModal: React.FC<SpaceModalProps> = ({ onClose, onConfirm }) => {

    const [spaceName , setSpaceName] = useState<string>('');

    const clickSubmit = (e:React.MouseEvent) =>{
        e.preventDefault();
        if(spaceName.trim()){
            onConfirm(spaceName);
        }
    };

    return (
        <SpaceModalWrap>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>스페이스 생성</h3>
                    <div className="input-box">
                        <label>스페이스 이름</label>
                        <input 
                            type="text" 
                            placeholder="스페이스 이름을 입력해 주세요."
                            value={spaceName}
                            onChange={e=> setSpaceName(e.target.value)}
                        />
                    </div>
                    <div className="button-group">
                        <button className="cancel" onClick={onClose}>취소</button>
                        <button className="confirm" onClick={clickSubmit}>확인</button>
                    </div>
                </div>
            </div>
        </SpaceModalWrap>
    );
};

export default SpaceModal;