// pages/ActiveSprint.tsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import CBoard from './CBoard';

// const PageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100vh;
// `;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Chat: React.FC = () => {
  return (
      <ContentContainer>
        <Sidebar />
        <CBoard />
      </ContentContainer>
  );
};

export default Chat;
