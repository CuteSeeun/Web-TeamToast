import React, { useState } from 'react';
import { SpaceAllWrap } from '../../components/SpaceStyle';
import { GoPlus } from "react-icons/go";
import SpaceModal from './SpaceModal';
import { Link } from 'react-router-dom';

interface spaceall {
    id: number;
    name: string;
    email: string;
    color: string;
}

const SpaceAll:React.FC = () => {

    const [showModal, setShowModal] = useState<boolean>(false);


    const spaces:spaceall[] = [
        { id: 1, name: '스페이스 이름 1', email: 'user1@example.com', color: 'color-1' },
        { id: 2, name: '스페이스 이름 2', email: 'user2@example.com', color: 'color-2' },
        { id: 3, name: '스페이스 이름 3', email: 'user3@example.com', color: 'color-3' },
        { id: 4, name: '스페이스 이름 4', email: 'user4@example.com', color: 'color-4' },
        { id: 5, name: '스페이스 이름 5', email: 'user5@example.com', color: 'color-5' }
    ];

    const handleCreateClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        // 여기에 스페이스 생성 로직 추가
        setShowModal(false);
    };

    return (
        <SpaceAllWrap>
            <div className="spaceTop">
              <h2>스페이스</h2>
            <button className="create-btn" onClick={handleCreateClick}>
                <GoPlus />새 스페이스 생성
            </button>
            </div>

            <div className="space-list">
                <Link to='/projectlist'>
                {spaces.map((space:spaceall) => (
                    <div key={space.id} className="space-item">
                        <div className={`color-box ${space.color}`}></div>
                        <div className="space-info">
                            <h3>{space.name}</h3>
                            <p>{space.email}</p>
                        </div>
                    </div>
                ))}
                </Link>
            </div>

            {showModal && (
                <SpaceModal 
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                />
            )}

        </SpaceAllWrap>
    );
};

export default SpaceAll;