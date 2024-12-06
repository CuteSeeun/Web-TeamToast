import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Sidebar from '../../components/Sidebar';
import { issueListState, Issue } from '../../recoil/atoms/issueAtoms';
import IDBoard from './IDBoard';
import axios from 'axios';
import { ContentContainer, PageContainer } from './issueStyle';

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 id 값 추출
  console.log('URL에서 추출한 id:', id);

  const setIssues = useSetRecoilState(issueListState);

  useEffect(() => {
    const projectid = 1;
    const fetchIssue = async () => {
      try {
        console.log('Fetching issue with id:', id);
        const response = await axios.get(`/sissue/detail/${projectid}/${id}`);
        console.log('Fetched issue data:', response.data);

        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.error('Fetched data is empty or not an array:', response.data);
          return;
        }

        const issuesData: Issue[] = response.data;
        console.log('Parsed issuesData:', issuesData);

        issuesData.forEach((issueData) => {
          setIssues((prevIssues) => {
            const sprintId = issueData.sprint_id || 0;
            return {
              ...prevIssues,
              [sprintId]: [
                ...(prevIssues[sprintId] || []).filter(issue => issue.isid !== issueData.isid),
                issueData
              ],
            };
          });
        });
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchIssue();
  }, [id, setIssues]);

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
