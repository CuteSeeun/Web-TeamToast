//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React from 'react';
import styled from 'styled-components';
import Task from './Task';

const ColumnContainer = styled.div`
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  margin-right: 20px;
  min-width: 250px;
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
