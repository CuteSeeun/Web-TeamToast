import React, { useState } from 'react';
import { TeamMaWrap } from './teamStyle';
import { FiTrash2, FiChevronDown } from "react-icons/fi";
import { GoPlus } from "react-icons/go";


interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string;
}

const members: Member[] = [
    { id: 1, name: '사용자 1', email: 'useremail1@example.com', role: '관리자', image: '/api/placeholder/40/40' },
    { id: 2, name: '사용자 2', email: 'useremail2@example.com', role: '관리자', image: '/api/placeholder/40/40' },
    { id: 3, name: '사용자 3', email: 'useremail3@example.com', role: '관리자', image: '/api/placeholder/40/40' },
    { id: 4, name: '사용자 4', email: 'useremail4@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 5, name: '사용자 5', email: 'useremail5@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 6, name: '사용자 6', email: 'useremail6@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 7, name: '사용자 7', email: 'useremail7@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 8, name: '사용자 8', email: 'useremail8@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 9, name: '사용자 9', email: 'useremail9@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 10, name: '사용자 10', email: 'useremail10@example.com', role: '팀원', image: '/api/placeholder/40/40' },
    { id: 11, name: '사용자 11', email: 'useremail11@example.com', role: '팀원', image: '/api/placeholder/40/40' },
];

const TeamMa = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdmin] = useState<boolean>(true);
    const itemsPerPage = 10;

    // 페이지네이션 계산
    const totalPages = Math.ceil(members.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 페이지네이션 버튼 생성
    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    return (
        <TeamMaWrap>
            <div className="header-area">
                <div className="title-area">
                    <h2>팀원 목록</h2>
                    {isAdmin && (
                        <button className="add-member-btn">
                            <GoPlus /> 사용자 초대
                        </button>
                    )}
                </div>
            </div>
            
            <div className="member-list">
                {currentMembers.map(member => (
                    <div key={member.id} className="member-item">
                        <img src={member.image} alt={member.name} />
                        <div className="info">
                            <span className="name">{member.name}</span>
                            <span className="email">{member.email}</span>
                        </div>
                        <div className="action-buttons">
                            <div className="role-wrapper">
                                <span>{member.role}</span>
                                {isAdmin && (
                                    <button className="auth-button">
                                        <FiChevronDown />
                                    </button>
                                )}
                            </div>
                            {isAdmin && (
                                <button className="delete-button">
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    {renderPaginationButtons()}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            )}
        </TeamMaWrap>
    );
};

export default TeamMa;