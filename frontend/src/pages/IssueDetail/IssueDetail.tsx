import React from 'react';
import Sidebar from '../../components/Sidebar';
import { ContentContainer, PageContainer } from './issueStyle';
import IDBoard from './IDBoard';

const IssueDetail: React.FC = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <Sidebar />
        <IDBoard />
      </ContentContainer>
    </PageContainer>
  );
};

export default IssueDetail;
