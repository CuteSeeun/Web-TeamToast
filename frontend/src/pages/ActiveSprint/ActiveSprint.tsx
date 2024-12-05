// pages/ActiveSprint.tsx
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import SBoard from './SBoard';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';



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
  const { pid } = useParams<{ pid: string }>();
  
  return (
    <PageContainer>
      <ContentContainer>
        <Sidebar />
        <SBoard />
      </ContentContainer>
    </PageContainer>
  );
  // return (
  //   <Layout>
  //     <Board />
  //   </Layout>
  // );
};

export default ActiveSprint;
