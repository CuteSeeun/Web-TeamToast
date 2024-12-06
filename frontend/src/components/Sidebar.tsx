//좌측 사이드바
//세은

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTasks, FaChartPie, FaClipboardList, FaComments, FaUsers } from 'react-icons/fa';
import { CreateIssueModal } from './CreateIssueModal';
import { useRecoilState } from 'recoil';
import { issueListState, backlogState, Issue, Type } from '../recoil/atoms/issueAtoms';
import AccessToken from '../pages/Login/AccessToken';
import useCurrentProject from '../hooks/useCurrentProject';
import { sprintState } from '../recoil/atoms/sprintAtoms'; // 임시 추가

const SidebarContainer = styled.div`
  width: 240px;
  /* height: 600px; */
  /* height: 100vh; */
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  min-width: 180px;
`;

const TopSection = styled.div`
  padding: 0 20px;
`;

const BottomSection = styled.div`
  padding: 0 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  text-align: center;
`;

const AddIssueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
  border: 2px solid #038C8C;
  border-radius: 5px;
  background-color: #fff;
  color: #038C8C;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #e6f4f4;
  }
`;

const MenuItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.active ? '#ffffff' : '#4d4d4d')};
  text-decoration: none; /* Link 기본 스타일 제거 */
  background-color: ${(props) => (props.active ? '#E6F4F4' : 'transparent')};
  border-radius: 5px;

  svg {
    margin-right: 10px;
    font-size: 16px;
    color: ${(props) => (props.active ? '#038C8C' : '#4d4d4d')};
  }

  &:hover {
    background-color: #e6f4f4;
    color: #038C8C;

    svg {
      color: #038C8C;
    }
  }
`;


const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 모달창 상태 관련 스테이트
  const [sprints, setSprints] = useRecoilState(sprintState);
  const [issues, setIssues] = useRecoilState(issueListState);
  const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);
  const {currentProject, isLoading} = useCurrentProject();
  
  const spaceId = currentProject?.space_id; // `space_id`를 바로 사용
  const projectId = currentProject?.pid;

  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) {
      console.error('프로젝트 정보를 알 수 없습니다.');
      return;
    };
    getSprint(projectId); // 임시 추가 (스프린트 목록을 활성스프린트에서 가져온다면 삭제)
  }, []);


  // ====================================================================
  // 스프린트 가져오는 함수 (스프린트 목록을 활성스프린트에서 가져온다면 삭제)
  const getSprint = async (pid: number) => {
    if(!pid) {
      console.error('pid가 없습니다.');
      navigate('/space');
      return;
    };

    try {
      const { data } = await AccessToken.get(`http://localhost:3001/sprint/${pid}`);
      let parsedData = Array.isArray(data) ? data : JSON.parse(data);
  
      if (Array.isArray(parsedData)) {
        setSprints(parsedData); // 상태 업데이트
      } else {
        console.error('Parsed data is not an array:', parsedData);
      }
    } catch (err) {
      console.error('Error fetching sprints:', err);
    }
  };
  
  useEffect(() => {
    console.log('Updated sprints:', sprints);
  }, [sprints]);
  // ====================================================================


  // 이슈리스트 확인 함수
  const issuelist = () => {
    backlog.forEach(issue => {
      console.log(`[Backlog] Issue ID: ${issue.isid}, Title: ${issue.title}`);
    });
    const keys = Object.keys(issues).map(Number); // 숫자 키 배열 생성

    if (keys.length === 0) {
      console.log('Issues 객체가 비어 있습니다.');
      return;
    };

    for (const key of keys) {
      const issuelist = issues[key];
          // 배열인지 확인
      if (!Array.isArray(issuelist)) {
        console.warn(`Key ${key}에 대한 데이터가 유효하지 않습니다.`, issuelist);
        continue; // 반복문 건너뛰기
      }

      console.log(`Key: ${key}`);
      for (const issue of issuelist) {
        console.log(`[${key}] Issue ID: ${issue.isid}, Title: ${issue.title}`);
      };
    };
  };


  const openModal = () => {
    issuelist(); // 이슈 잘 들어왔는지 확인용
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // 자식 컴포넌트에서 props를 받아 서버에 데이터 전송
  const handleSubmit = async (issue: Issue, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
  
      const issuePromise = AccessToken.post(
        `http://localhost:3001/issues/new/${spaceId}/${projectId}`,
        issue
      );
  
      const fileUploadPromise = files.length > 0
        ? AccessToken.post('http://localhost:3001/upload/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : Promise.resolve(); // 파일이 없으면 성공으로 간주
  
      // 병렬 처리
      const [issueResponse, fileResponse] = await Promise.all([issuePromise, fileUploadPromise]);


      const newIssue: Issue = issueResponse.data;
  
      console.log('이슈 생성 성공:', issueResponse.data);
      if (files.length > 0) console.log('파일 업로드 성공:', fileResponse?.data);

    // 이슈 데이터 업데이트
    if (newIssue.sprint_id) {
      // sprint_id가 있는 경우 issues 상태 업데이트
      setIssues((prevIssues) => {
        const sprintId = newIssue.sprint_id!;
        const updatedSprintIssues = prevIssues[sprintId]
          ? [...prevIssues[sprintId], newIssue]
          : [newIssue];

        return {
          ...prevIssues,
          [sprintId]: updatedSprintIssues,
        };
      });
    } else {
      // sprint_id가 없는 경우 backlog 상태 업데이트
      setBacklog((prevBacklog) => [...prevBacklog, newIssue]);
    }
    } catch (err) {
      console.error('이슈 생성 또는 파일 업로드 실패:', err);
    }
  };
  
  if (isLoading) {
    return <div>로딩 중...</div>; // 상태가 동기화되기 전 로딩 표시
  }

  return (
    <SidebarContainer>

      <TopSection>{/* 상단 메뉴 */}
        <AddIssueButton onClick={(e) => {openModal()}}><FaPlus />새 이슈</AddIssueButton> {/* 새 이슈 버튼 */}

        {/* 메뉴 항목 */}
        <MenuItem to={`/activesprint/${projectId}`} active><FaTasks />활성 스프린트</MenuItem>
        <MenuItem to={`/dashboard/${projectId}`}><FaChartPie />대시보드</MenuItem>
        <MenuItem to={`/backlog/${projectId}`}><FaClipboardList />백로그</MenuItem>
        <MenuItem to={`/issuelist/${projectId}`}><FaClipboardList />이슈 목록</MenuItem>
        <MenuItem to={'/chat'}><FaComments />채팅</MenuItem>

      </TopSection>

      {/* 하단 메뉴 */}
      <BottomSection>
        <MenuItem to="/invite"><FaUsers />팀원 초대하기</MenuItem>
      </BottomSection>

      <CreateIssueModal
      isOpen={isOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      />

    </SidebarContainer>
  );
};

export default Sidebar;