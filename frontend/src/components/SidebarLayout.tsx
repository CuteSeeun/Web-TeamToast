import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; /* 세로와 가로 스크롤 막기 */
  /* height: 100vh; */
`;

const SidebarLayout: React.FC = () => {
  return (
    <ContentContainer>
      <Sidebar />
      <Outlet />
    </ContentContainer>
  );
};

export default SidebarLayout;
