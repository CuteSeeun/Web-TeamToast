// 프로젝트 목록 페이지

import React, { useEffect, useState } from 'react';
import { ProjectListWrap } from './ProjectStyle';
import { GoPlus } from "react-icons/go";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ProjectModal from './ProjectModal';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toSvg } from "jdenticon";
import { Project } from '../../types/projectTypes';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { projectListState, currentProjectState } from '../../recoil/atoms/projectAtoms';
import { ReactComponent as ProjectAlert } from '../../assets/images/proejctAlert.svg';
import AccessToken from '../Login/AccessToken';

interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  projectId?: number;
}

const ProjectList = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // 기본값은 false로 설정
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 번호를 저장
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null }); // 생성 수정 삭제 모달을 열거나 닫을때
  const [projects, setProjects] = useRecoilState<Project[]>(projectListState); // 현재 스페이스의 프로젝트 리스트를 저장
  const [isReady, setIsReady] = useState(false);//api로 데이터 가져오는 동안 "로딩중"메시지 표시
  const setCurrentProject = useSetRecoilState(currentProjectState); //선택한 프로젝트 이름 ,설명
  const itemsPerPage = 10; // 한 페이지에 들어갈 아이템 개수
  // 페이지네이션 계산
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  // 프로젝트 이름 목록 (중복 체크용)
  const existingNames = projects.map(p => p.pname);//프로젝트 이름 리스트를 저장
  const navigate = useNavigate();
  const { sid } = useParams<{ sid: string }>() || { sid: '' };//url의 sid를 가져옴
  const [hasError, setHasError] = useState(false); // 에러 상태 관리

  //세션스토리지에서 userRole가져오기
  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole'); // 로컬 스토리지에서 사용자 역할 가져오기
    if (userRole === 'top_manager' || userRole === 'manager') {
      setIsAdmin(true); // 관리자라면 true로 설정
    } else {
      setIsAdmin(false); // 관리자가 아니면 false로 설정 (안전 처리)
    }
  }, []);



  //sid로 프로젝트 pid, pname, 설명 가져옴   <- url에서 sid가져와서 pid,pname을 가져오는 것인가?
  useEffect(() => {
    if (!sid) {
      alert('스페이스 id가 없음');
    };
    const getProjList = async () => {
      try {
        const { data } = await AccessToken.get(`/projects/all/${sid}`);
        console.log("Response from API:", data);
        setProjects(data || []);
        setHasError(false); // 에러 상태 설정
      } catch (err) {
        console.error(`프로젝트를 받아오는 중 에러 발생: ${err}`);
        renderProjectAlert(isAdmin, openModal); // 바로 경고 메시지 반환
        setHasError(true); // 에러 상태 설정
      } finally {
        setIsReady(true); // 로딩 완료
      }
    };
    getProjList();
  }, [sid, navigate]); // spaceId가 변경될 때마다 실행


  // 프로젝트 이미지 자동 생성 함수 (입력한 데이터에 따라 자동 생성되며, 같은 값을 입력한다면 이미지가 바뀌지 않음)
  const projImage = (project: Project) => {
    // 다른 스페이스에 같은 이름의 프로젝트가 있을 경우 이미지가 겹치는 것을 방지
    const svgString = toSvg((project.pname + project.pid), 32);
    return React.createElement('div', {
      dangerouslySetInnerHTML: { __html: svgString },
      style: { width: 32, height: 32, overflow: "hidden", borderRadius: "3px" },
    });
  };

  // 페이지 변경
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
    };
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

  // 생성,수정 모달
  const handleSubmit = async (name: string, description: string) => {
    try {
      if (modal.type === 'create') {
        // 생성 API 호출
        const { data } = await AccessToken.post(`/projects/new/${sid}`, {
          pname: name,
          description: description,
        });
        console.log(`생성 완료: ${data.pname}, ${data.description}`);

        // projects 목록 업데이트
        setProjects([...projects, data]);
      } else if (modal.type === 'edit' && modal.projectId) {
        // 수정 API 호출
        const { data } = await AccessToken.put(`/projects/modify/${sid}/${modal.projectId}`, {
          pname: name,
          description: description
        });
        console.log(`수정 완료: ${data.pname}, ${data.description}`);

        // projects 목록 업데이트
        setProjects(projects.map(project =>
          project.pid === modal.projectId ? { ...project, pname: name, description: description } : project
        ));
      };
    } catch (err) {
      console.error(`API 호출 중 오류 발생: ${err}`);
    } finally {
      closeModal(); // 모달 닫기
    }
  };

  // 삭제 모달
  const handleDelete = async () => {
    if (modal.projectId) {
      // 삭제 API 호출
      console.log('삭제:', modal.projectId);
      try {
        await AccessToken.delete(`/projects/delete/${sid}/${modal.projectId}`, {

        }); // sid 임시로 1로 지정, 수정 필요

        // 프로젝트 목록 스테이트에서 삭제한 프로젝트 제외
        const newProjects = projects.filter(project => project.pid !== modal.projectId);
        setProjects(newProjects);

        // 현재 페이지가 범위를 벗어나지 않도록 수정 [현진]
        if (newProjects.length <= (currentPage - 1) * itemsPerPage) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }

      } catch (err) {
        console.error(`프로젝트를 삭제하는 중 에러 발생: ${err}`);
      };
    };
    closeModal();
  };

  // 클릭한 스페이스의 프로젝트의 pname과 description 가져오기. projects 상태에 업데이트
  const getProjectData = () => {
    if (modal.projectId) {
      const proj = projects.find(p => p.pid === modal.projectId);
      if (proj) {
        return {
          pname: proj.pname,
          description: proj.description
        };
      };
    };
    return undefined;
  };

  // 특정 프로젝트를 클릭했을 떄 호출
  const saveCurrentProject = (pid: number) => {
    // projects에서 해당하는 프로젝트 찾기
    const selectedProject = projects.find((project) => project.pid === pid);
    if (selectedProject) {
      setCurrentProject(selectedProject); // Recoil 상태 업데이트
      sessionStorage.setItem('pid', pid.toString()); // 세션 스토리지에 pid 저장
      sessionStorage.setItem('pname', selectedProject.pname); //클릭한 프로젝트의 pname을 세션에 저장
    } else {
      console.log(`${pid}에 해당하는 프로젝트를 프로젝트 목록에서 찾을 수 없습니다.`);
    };
  };

  //클릭한 스페이스의 프로젝트 목록이 없다면
  const renderProjectAlert = (isAdmin: boolean, openModal: (type: 'create' | 'edit' | 'delete') => void) => {
    return (
      <ProjectListWrap>
      <div className='project-alert-container'>
        <div className='project-alert-wrap'>
          <ProjectAlert className='alert-svg' />
          {isAdmin ? (
            <p>현재 생성된 프로젝트가 없습니다. <br /> 새 프로젝트를 생성해 주세요.</p>
          ) : (
            <p>현재 생성된 프로젝트가 없습니다. <br /> 관리자에게 문의해 주세요.</p>
          )}
          <button className="create-btn" onClick={() => openModal('create')}>
            <GoPlus /> 새 프로젝트 생성
          </button>
         
        </div>
      </div>
      </ProjectListWrap>
    );
  };

  if (hasError) {
    return renderProjectAlert(isAdmin, openModal);
  }


  return (
    <ProjectListWrap>
      <div className="project-header">
        <h2>프로젝트</h2>
      </div> 
      {projects.length !== 0 && <div className="table-container">
        {isAdmin && (
          <button className="create-btn" onClick={() => openModal('create')}>
            <GoPlus /> 새 프로젝트 생성
          </button>
        )}
      </div>}

      {projects.length !== 0 ? (
        <>
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
                    <Link to={`/activesprint/${project.pid}`} onClick={(e) => {
                      saveCurrentProject(project.pid);

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
        </>) : (
        // <>
        //   <div className='project-alert-container'>
        //     <div className='project-alert-wrap'>
        //       <ProjectAlert className='alert-svg' />
        //       {isAdmin ? <p>현재 생성된 프로젝트가 없습니다. <br /> 새 프로젝트를 생성해 주세요.</p> : <p>현재 생성된 프로젝트가 없습니다. <br /> 관리자에게 문의해 주세요.</p>}
        //       <button className="create-btn" onClick={() => openModal('create')}>
        //         <GoPlus /> 새 프로젝트 생성
        //       </button>
        //     </div>
        //   </div>
        // </>
        renderProjectAlert(isAdmin, openModal)
      )
      }

      <ProjectModal type={modal.type || 'create'} isOpen={modal.isOpen}
        onClose={closeModal} onSubmit={handleSubmit}
        onDelete={handleDelete} projectData={getProjectData()}
        existingNames={existingNames}
      />
    </ProjectListWrap>
  );
};

export default ProjectList;