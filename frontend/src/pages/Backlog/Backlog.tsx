// pages/Backlog.tsx// pages/ActiveSprint.tsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import BBoard from './BBoard';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* height: 100vh; */
  /* background: pink; */
  /* flex: 1; */

`;

const Backlog: React.FC = () => {
  return (
    
     <PageContainer>
      <Sidebar />
      <BBoard />
     </PageContainer>
    
  );
};

export default Backlog;
