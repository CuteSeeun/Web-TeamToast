import React, { useState } from 'react';
import { ProjectListWrap } from './ProjectStyle';
import { GoPlus } from "react-icons/go";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ProjectModal from './ProjectModal';
import { Link } from 'react-router-dom';

interface Project {
    id: number;
    name: string;
    description: string;
    image: string;
}

interface ModalState {
    isOpen: boolean;
    type: 'create' | 'edit' | 'delete' | null;
    projectId?: number;
}



const ProjectList = () => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdmin] = useState<boolean>(true); // 실제로는 로그인 상태에서 가져와야 함
    const itemsPerPage = 10;
    const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

    // 임시 데이터
    const projects: Project[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `프로젝트 이름 ${i + 1}`,
        description: `프로젝트 설명 ${i + 1}+4시간전 완료됨`,
        image: '/api/placeholder/40/40'
    }));

    // 페이지네이션 계산
    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

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

     // 모달 관련 핸들러
     const openModal = (type: 'create' | 'edit' | 'delete', projectId?: number) => {
        setModal({ isOpen: true, type, projectId });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null });
    };

    const handleSubmit = (name: string, description: string) => {
        if (modal.type === 'create') {
            // 생성 API 호출
            console.log('생성:', { name, description });
        } else if (modal.type === 'edit') {
            // 수정 API 호출
            console.log('수정:', { id: modal.projectId, name, description });
        }
        closeModal();
    };

    const handleDelete = () => {
        if (modal.projectId) {
            // 삭제 API 호출
            console.log('삭제:', modal.projectId);
        }
        closeModal();
    };

    // 현재 편집중인 프로젝트 데이터 가져오기
    const getProjectData = () => {
        if (modal.projectId) {
            const project = projects.find(p => p.id === modal.projectId);
            if (project) {
                return {
                    name: project.name,
                    description: project.description
                };
            }
        }
        return undefined;
    };

    // 프로젝트 이름 목록 (중복 체크용)
    const existingNames = projects.map(p => p.name);


    return (
        <ProjectListWrap>
           <div className="project-header">
                <h2>프로젝트</h2>
            </div>

            <div className="table-container">
            {isAdmin && (   
                <button className="create-btn" onClick={() => openModal('create')}>
                    <GoPlus /> 새 프로젝트 생성
                </button>
            )}
            </div>
            

            <table className="project-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>설명</th>
                        {isAdmin && <th>작업</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((project) => (
                        <tr key={project.id}>
                            <td>
                                <Link to='/activesprint'>
                                <div className="project-info">
                                    <img src={project.image} alt={project.name} />
                                    {project.name}
                                </div>
                                </Link>
                            </td>
                            <td>{project.description}</td>
                            {isAdmin && (
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => openModal('edit', project.id)}><FiEdit2 /></button>
                                        <button onClick={() => openModal('delete', project.id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

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

            <ProjectModal
                type={modal.type || 'create'}
                isOpen={modal.isOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                projectData={getProjectData()}
                existingNames={existingNames}
            />

        </ProjectListWrap>
    );
};

export default ProjectList;