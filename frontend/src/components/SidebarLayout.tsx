import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
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
