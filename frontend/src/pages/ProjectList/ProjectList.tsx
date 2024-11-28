import React, { useEffect, useState } from 'react';
import { ProjectListWrap } from './ProjectStyle';
import { GoPlus } from "react-icons/go";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ProjectModal from './ProjectModal';
import { Link } from 'react-router-dom';
import { toSvg } from "jdenticon";
import axios from "axios";
import { Project } from '../../types/projectTypes';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentProjectState } from '../../recoil/atoms/projectAtoms';
import { Issue, issueListState } from '../../recoil/atoms/issueAtoms';

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
    const setCurrentProject = useSetRecoilState(currentProjectState);
    const setIssueList = useSetRecoilState(issueListState);

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
      if (type === 'edit' || type === 'delete') {
        // 수정 모드, 삭제 모드에서 projectId를 사용
        setModal({ isOpen: true, type, projectId });
    } else {
        // 생성 모드
        setModal({ isOpen: true, type });
    }
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null });
    };

    // 생성 / 수정 모달
    const handleSubmit = async ( name: string, description: string ) => {
      try {
        setIsLoading(true); // 로딩 시작
        if (modal.type === 'create') {
            // 생성 API 호출
            const { data } = await axios.post(`http://localhost:3001/projects/new/1`, {
                pname: name,
                description: description,
            });
            console.log(`생성 완료: ${data.pname}, ${data.description}`);

            // projects 목록 업데이트
            setProjects([...projects, data]);
        } else if (modal.type === 'edit' && modal.projectId) {
          // 수정 API 호출
          const { data } = await axios.put(`http://localhost:3001/projects/modify/1/${modal.projectId}`, {
            pname: name,
            description: description,
          });
          console.log(`수정 완료: ${data.pname}, ${data.description}`);

          // projects 목록 업데이트
          setProjects(projects.map(project => 
            project.pid === modal.projectId ? { ...project, pname: name, description: description } : project
          ));
        }
      } catch (err) {
        console.error(`API 호출 중 오류 발생: ${err}`);
      } finally {
         setIsLoading(false); // 로딩 종료
        closeModal(); // 모달 닫기
      }
    };

    // 삭제 모달
    const handleDelete = async () => {
        if (modal.projectId) {
            // 삭제 API 호출
            console.log('삭제:', modal.projectId);
          try {
            await axios.delete(`http://localhost:3001/projects/delete/${modal.projectId}`);

            // 프로젝트 목록 스테이트에서 삭제한 프로젝트 제외
            const newProjects = projects.filter(project => project.pid !== modal.projectId);
            setProjects(newProjects);

          } catch (err) {
            console.error(`프로젝트를 삭제하는 중 에러 발생: ${err}`);
          };
        };
        closeModal();
    };

    // 현재 편집중인 프로젝트 데이터 가져오기
    const getProjectData = () => {
        if (modal.projectId) {
            const proj = projects.find(p => p.pid === modal.projectId);
            if (proj) {
                return {
                    pname: proj.pname,
                    description: proj.description
                };
            }
        }
        return undefined;
    };

    // 클릭한 프로젝트의 데이터를 저장하는 함수
    const saveProjectData = ( pid: number ) => {
      // projects에서 해당하는 프로젝트 찾기
      const selectedProject = projects.find((project) => project.pid === pid);
      if (selectedProject) {
        setCurrentProject(selectedProject); // Recoil 상태 업데이트
      } else {
        console.log(`${pid}에 해당하는 프로젝트를 프로젝트 목록에서 찾을 수 없습니다.`);
      };
    };

    // 클릭한 프로젝트의 이슈 목록 저장하기
    const saveIssuesData = async ( pid: number ) => {
      // projects에서 해당하는 프로젝트 찾기
      const selectedProject = projects.find((project) => project.pid === pid);

      // 프로젝트가 없으면 return
      if (!selectedProject) {
        console.error(`프로젝트를 찾을 수 없습니다: ${pid}`);
        return;
      };

      try {
        // 이슈 데이터 get 요청
        const { data } = await axios.get(`http://localhost:3001/issues/all/${pid}`);
        if (data) {
          // issueList에 받아온 이슈 데이터 넣기
          setIssueList(data);
        };
      } catch (err) {
        console.error(`이슈를 받아오는 중 에러 발생: ${err}`);
      };
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
                  <Link to='/activesprint' onClick={(e) => {
                    saveProjectData(project.pid);
                    saveIssuesData(project.pid);
                    }}>
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