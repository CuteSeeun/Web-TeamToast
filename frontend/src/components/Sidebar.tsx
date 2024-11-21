//좌측 사이드바
//세은

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTasks, FaChartPie, FaClipboardList, FaComments, FaUsers } from 'react-icons/fa';

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
  return (
    <SidebarContainer>

      <TopSection>{/* 상단 메뉴 */}
        <AddIssueButton><FaPlus />새 이슈</AddIssueButton> {/* 새 이슈 버튼 */}

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

    </SidebarContainer>
  );
};

export default Sidebar;