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
  margin-top: 8px; // 아이콘과 제목 사이 간격
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
  type?: 'task' | 'bug'; // 아이콘 타입을 추가
  style?: React.CSSProperties; // style 속성을 선택적으로 추가
}> = ({ id, title, index, columnId, type }) => {
  const [, dragRef] = useDrag({
    type: "TASK",
    item: { fromColumn: columnId, index }, // 드래그 중 전달할 데이터
    //여기서 fromColumn 값이 ColumnKey 타입으로 정확히 전달

  });

  return (
    <TaskContainer ref={dragRef} id={id}>
      <TaskTitle>{title}</TaskTitle>
      {/* 조건부 렌더링으로 아이콘 추가 */}
      <IconContainer>
        {type === 'task' && <IssueTaskIcon />}
        {type === 'bug' && <IssueBugIcon />}
        <span>{type === 'task' ? '작업' : '버그'}</span>
      </IconContainer>
    </TaskContainer>
  );
};

export default Task;
