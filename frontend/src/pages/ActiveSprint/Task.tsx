//보드의 각 이슈 (태스크)

import React from 'react';
import styled from 'styled-components';

const TaskContainer = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TaskTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 8px;
`;

const Task: React.FC<{ title: string }> = ({ title }) => {
  return (
    <TaskContainer>
      <TaskTitle>{title}</TaskTitle>
    </TaskContainer>
  );
};

export default Task;
