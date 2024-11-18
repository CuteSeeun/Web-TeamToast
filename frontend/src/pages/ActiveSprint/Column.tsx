//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React from 'react';
import styled from 'styled-components';
import Task from './Task';

const ColumnContainer = styled.div`
  flex: 1;
  background: #F2F2F2;
  border-radius: 8px;
  padding: 10px;
  margin-right: 20px;
  margin-bottom: 30px; /* 하단 간격 추가 */
  min-width: 150px;
  max-width: 220px; /* 최대 너비 설정 */

  max-height: 400px; /* 컬럼의 최대 높이 설정 */
  overflow-y: auto; /* 내부 콘텐츠 스크롤 허용 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 선택사항: 스크롤 시 디자인 */
`;

const ColumnTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Column: React.FC<{ title: string; tasks: string[] }> = ({ title, tasks }) => {
  return (
    <ColumnContainer>
      <ColumnTitle>{title}</ColumnTitle>
      {tasks.map((task, index) => (
        <Task key={index} title={task} />
      ))}
    </ColumnContainer>
  );
};

export default Column;
