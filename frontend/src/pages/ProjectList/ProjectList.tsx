import React, { useEffect, useState } from 'react';
import { ProjectListWrap } from './ProjectStyle';
import { GoPlus } from "react-icons/go";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ProjectModal from './ProjectModal';
import { Link } from 'react-router-dom';
import { toSvg } from "jdenticon";
import axios from "axios";

interface Project {
    pid: number;
    pname: string;
    description: string;
    // image: string;
}

interface ModalState {
    isOpen: boolean;
    type: 'create' | 'edit' | 'delete' | null;
    projectId?: number;
}



const ProjectList = () => {
    const [isAdmin] = useState<boolean>(true); // 로그인 여부 스테이트, 실제로는 로그인 상태에서 가져와야 함
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 번호 스테이트
    const itemsPerPage = 10; // 한 페이지에 들어갈 아이템 개수
    const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null }); // 모달창 상태 관련 스테이트
    const [projects, setProjects] = useState<Project[]>([]); // 현재 스페이스 안에 있는 프로젝트 리스트를 저장하는 스테이트
    const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 스테이트

    // 임시 데이터
    // const projects: Project[] = Array.from({ length: 30 }, (_, i) => ({
    //     id: i + 1,
    //     name: `프로젝트 이름 ${i + 1}`,
    //     description: `프로젝트 설명 ${i + 1}+4시간전 완료됨`,
    //     image: '/api/placeholder/40/40'
    // }));

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const getProjList = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        const { data } = await axios.get('http://localhost:3001/projects/all/1'); // 실제 sid를 받아오도록 수정 필요
        if (data.length !== 0) {
          setProjects(data);
        };
      } catch (err) {
        console.error(`프로젝트를 받아오는 중 에러 발생: ${err}`);
      } finally {
        setIsLoading(false); // 로딩 종료
      };
    };
    getProjList();
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행


    // 프로젝트 이미지 자동 생성 함수 (입력한 데이터에 따라 자동 생성되며, 같은 값을 입력한다면 이미지가 바뀌지 않음)
    const projImage = (project: Project) => {
      // 다른 스페이스에 같은 이름의 프로젝트가 있을 경우 이미지가 겹치는 것을 방지
      const svgString = toSvg(( project.pname + project.pid ), 32);
      return (
        <div
          dangerouslySetInnerHTML={{ __html: svgString }}
          style={{ width: 32, height: 32, overflow: "hidden", borderRadius: "3px" }}
        ></div>
      )
    };
    

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

    // 생성 / 수정 모달
    const handleSubmit = async ( name: string, description: string ) => {
      if (modal.type === 'create') {
        // 생성 API 호출
        try {
          setIsLoading(true); // 로딩 시작
          const { data } = await axios.post(`http://localhost:3001/projects/new/1`, {
            pname: name,
            description: description,
          }); // 실제 sid를 받아오도록 수정 필요

          console.log(`생성 완료: ${ data.pname }, ${ data.description }`);

          // projects 목록 업데이트
          setProjects([...projects, data]);
        } catch (err) {
          console.error(`프로젝트를 받아오는 중 에러 발생: ${err}`);
        } finally {
          setIsLoading(false); // 로딩 종료
        };
      } else if (modal.type === 'edit' && modal.projectId) {
        // 수정 API 호출
        try {
          setIsLoading(true); // 로딩 시작
          const { data } = await axios.put(`http://localhost:3001/projects/modify/1/${modal.projectId}`, {
            pname: name,
            description: description,
          }); // 실제 sid를 받아오도록 수정 필요

          console.log(`수정 완료: ${ data.pname }, ${ data.description }`);

          // 기존 프로젝트 목록에서 수정된 항목 업데이트
          setProjects(projects.map(project => 
            project.pid === modal.projectId ? { ...project, pname: name, description: description } : project
          ));
        } catch (err) {
          console.error(`프로젝트를 받아오는 중 에러 발생: ${err}`);
        } finally {
          setIsLoading(false); // 로딩 종료
        };
      };
      closeModal();
    };

    // 삭제 모달
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
            const project = projects.find(p => p.pid === modal.projectId);
            if (project) {
                return {
                    name: project.pname,
                    description: project.description
                };
            }
        }
        return undefined;
    };

    // 프로젝트 이름 목록 (중복 체크용)
    const existingNames = projects.map(p => p.pname);


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
              <tr key={project.pid}>
                <td>
                  <Link to='/activesprint'>
                    <div className="project-info">
                      {projImage(project)}
                      {project.pname}
                    </div>
                  </Link>
                </td>
                <td>{project.description}</td>
                  {isAdmin && (
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => openModal('edit', project.pid)}><FiEdit2 /></button>
                        <button onClick={() => openModal('delete', project.pid)}><FiTrash2 /></button>
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