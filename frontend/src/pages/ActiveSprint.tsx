// pages/ActiveSprint.tsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Board from '../components/Board';
import Header from '../components/Header';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ActiveSprint: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <Sidebar />
        <Board />
      </ContentContainer>
    </PageContainer>
  );
};

export default ActiveSprint;
