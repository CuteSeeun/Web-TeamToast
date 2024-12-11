//보드의 각 이슈 (태스크)
import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { ReactComponent as IssueTaskIcon } from '../../assets/icons/Issue-Task.svg';
import { ReactComponent as IssueBugIcon } from '../../assets/icons/Issue-Bug.svg';

type ColumnKey = 'backlog' | 'inProgress' | 'done' | 'qa';

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
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px; 
  svg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`;

const Task: React.FC<{
  id: string;
  title: string;
  index: number;
  columnId: ColumnKey
  type?: 'task' | 'bug'; 
  style?: React.CSSProperties; 
}> = ({ id, title, index, columnId, type }) => {
  
  const [, dragRef] = useDrag({
    type: "TASK",
    item: { id, title, index, fromColumn: columnId, type }, // 드래그 중 전달할 데이터
    //여기서 fromColumn 값이 ColumnKey 타입으로 정확히 전달
    collect: (monitor) => {
      if (monitor.isDragging()) {
        console.log(`Dragging Task: ${title}`); // 드래그 시작 시 title 출력
      }
    },
  });

  return (
    <TaskContainer ref={dragRef} id={id}>
      <TaskTitle>{title}</TaskTitle>
      <IconContainer>
        {type === 'task' && <IssueTaskIcon />}
        {type === 'bug' && <IssueBugIcon />}
        <span>{type === 'task' ? '작업' : '버그'}</span>
      </IconContainer>
    </TaskContainer>
  );
};

export default Task;