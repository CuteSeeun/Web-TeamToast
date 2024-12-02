// pages/Backlog.tsx// pages/ActiveSprint.tsx
import React from 'react';
import { PageContainer } from './backlogstyle';
import Sidebar from '../../components/Sidebar';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import BBoard from './BBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



const Backlog: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <PageContainer>
        <Sidebar />
        <BBoard />
      </PageContainer>
    </DndProvider>
  );
};

export default Backlog;
