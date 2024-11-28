//보드의 각 이슈 (태스크)
import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';

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

const Task: React.FC<{ 
  id: string;
  title: string; 
  index: number; 
  columnId: ColumnKey 
  style?: React.CSSProperties; // style 속성을 선택적으로 추가
}> = ({id, title,index,columnId}) => {
  const [, dragRef] = useDrag({
    type: "TASK",
    item: { fromColumn: columnId, index }, // 드래그 중 전달할 데이터
    //여기서 fromColumn 값이 ColumnKey 타입으로 정확히 전달

  });

  return (
    <TaskContainer ref={dragRef} id={id}>
      <TaskTitle>{title}</TaskTitle>
    </TaskContainer>
  );
};

export default Task;
