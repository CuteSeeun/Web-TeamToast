// pages/Backlog.tsx// pages/ActiveSprint.tsx
import React from 'react';
import { PageContainer } from './backlogstyle';
import Sidebar from '../../components/Sidebar';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import BBoard from './BBoard';



const Backlog: React.FC = () => {
  return (

    <PageContainer>
      <Sidebar />
      <BBoard />
    </PageContainer>

  );
};

export default Backlog;
