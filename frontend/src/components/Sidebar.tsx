//좌측 사이드바
//세은

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTasks, FaChartPie, FaClipboardList, FaComments, FaUsers } from 'react-icons/fa';
import { CreateIssueModal } from './CreateIssueModal';
// import { Issue } from '../types/issueTypes';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectIdState } from '../recoil/atoms/projectAtoms';
import { spaceIdState } from '../recoil/atoms/spaceAtoms';
import { issueListState, backlogState, Issue, Type } from '../recoil/atoms/issueAtoms';
import AccessToken from '../pages/Login/AccessToken';

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
  const spaceId = useRecoilValue(spaceIdState);
  const projectId = useRecoilValue(projectIdState);
  const [issues, setIssues] = useRecoilState(issueListState);
  const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);

  
  const openModal = () => {
    console.log(issues);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // 자식 컴포넌트에서 props를 받아 서버에 데이터 전송
  const handleSubmit = async (issue: Issue, files: File[]) => {
    try {
      // 1. 파일 업로드
      let uploadedFileNames: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
  
        const uploadResponse = await AccessToken.post('http://localhost:3001/upload/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        uploadedFileNames = uploadResponse.data.fileUrls.map((url: string) => url.split('/').pop());
        console.log('파일 업로드 성공:', uploadedFileNames);
      }
  
      // 2. 이슈 데이터 전송
      const sid = spaceId; // 임시로 sid 지정
      if (!spaceId || projectId === 0) {
        console.error('유효하지 않은 Space ID 또는 Project ID');
        return;
      };
  
      const issueForBackend: Issue = {
        ...issue,
        file: uploadedFileNames,
      };
      const { data } = await AccessToken.post(
        `http://localhost:3001/issues/new/${sid}/${projectId}`,
        issueForBackend);
        
        if (data) {
          const issuesData: Issue = {
            ...data,
            manager:
              typeof data.manager === "object" && data.manager !== null
                ? data.manager.manager
                : data.manager || "담당자 없음",
            type: Type[data.type as keyof typeof Type] || "작업",
          };
        
          console.log("원본 데이터:", data);
          console.log("수정된 데이터:", issuesData);
        
          const sprintId = issuesData.sprint_id;
        
          if (sprintId === 0 || sprintId === null || sprintId === undefined) {
            // Backlog로 추가
            setBacklog((prevBacklog) => [...prevBacklog, issuesData]);
          } else {
            // Issues로 추가
            setIssues((prevIssues) => {
              const updatedSprintIssues = prevIssues[sprintId]
                ? [...prevIssues[sprintId], issuesData]
                : [issuesData];
        
              return {
                ...prevIssues,
                [sprintId]: updatedSprintIssues,
              };
            });
          }
        }

        console.log(`issues: ${issues}`);
        console.log(`backlog: ${backlog}`);
        
        

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('서버 응답 오류:', err.response.data); // 서버에서 보낸 메시지
        } else {
          console.error('네트워크 또는 기타 오류:', err.message);
        };
      } else {
        console.error('알 수 없는 오류:', err);
      };
    } finally {
      closeModal();
    };
  };

  return (
    <SidebarContainer>

      <TopSection>{/* 상단 메뉴 */}
        <AddIssueButton onClick={(e) => {openModal()}}><FaPlus />새 이슈</AddIssueButton> {/* 새 이슈 버튼 */}

        {/* 메뉴 항목 */}
        <MenuItem to="/activesprint" active><FaTasks />활성 스프린트</MenuItem>
        <MenuItem to="/dashboard"><FaChartPie />대시보드</MenuItem>
        <MenuItem to="/backlog"><FaClipboardList />백로그</MenuItem>
        <MenuItem to="/issuelist"><FaClipboardList />이슈 목록</MenuItem>
        <MenuItem to="/chat"><FaComments />채팅</MenuItem>

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