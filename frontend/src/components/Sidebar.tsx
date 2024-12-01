//좌측 사이드바
//세은

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTasks, FaChartPie, FaClipboardList, FaComments, FaUsers } from 'react-icons/fa';
import { CreateIssueModal } from './CreateIssueModal';
import { Issue } from '../types/issueTypes';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { currentProjectState } from '../recoil/atoms/projectAtoms';

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
  const currentProject = useRecoilValue(currentProjectState);

// 백엔드로 보낼 Issue 인터페이스 형식
interface IssueForBackend extends Omit<Issue, 'status' | 'type' | 'priority'> {
  status: string; // 한글
  type: string; // 한글
  priority: string; // 한글
}

// status 한글로 변환
const statusMap: Record<string, string> = {
  backlog: '백로그',
  working: '작업중',
  dev: '개발완료',
  QA: 'QA완료',
};

// type 한글로 변환
const typeMap: Record<string, string> = {
  process: '작업',
  bug: '버그',
};

// priority 한글로 변환
const priorityMap: Record<string, string> = {
  high: '높음',
  normal: '보통',
  low: '낮음',
};

const transformIssueForDatabase = (issue: Issue): IssueForBackend => ({
  ...issue,
  status: statusMap[issue.status] as '백로그' | '작업중' | '개발완료' | 'QA완료',
  type: typeMap[issue.type] as '작업' | '버그',
  priority: priorityMap[issue.priority] as '높음' | '보통' | '낮음',
});

  
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  
  // 자식 컴포넌트에서 props를 받아 서버에 데이터 전송
  const handleSubmit = async (issue: Issue) => {
    try {   
      console.log(`모달에서 데이터 받음: ${issue.title}`);   
      const pid = currentProject.pid || 1; // 프로젝트 id 임시 지정
      if(currentProject.pid === 0) {
        console.log('프로젝트 정보를 알 수 없습니다.');
        return;
      };
      const issueForBackend = transformIssueForDatabase(issue);
      const { data } = await axios.post(`http://localhost:3001/issues/new/${pid}`, issueForBackend);
      console.log(`생성 완료: 제목: ${data.title}, 유형: ${data.type}, 상태: ${data.status}, 우선순위: ${data.priority}`);
    } catch (err ) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('서버 응답 오류:', err.response.data); // 서버에서 보낸 메시지
        } else {
          console.error('네트워크 또는 기타 오류:', err.message);
        };
      } else {
        console.error('알 수 없는 오류:', err);
      };
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