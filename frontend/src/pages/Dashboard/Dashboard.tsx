// pages/ActiveSprint.tsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import DBoard from './DBoard';

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ActiveSprint: React.FC = () => {
  return (
      <ContentContainer>
        <Sidebar />
        <DBoard />
      </ContentContainer>
  );
};

export default ActiveSprint;
