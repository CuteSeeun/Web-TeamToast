//보드의 각 이슈 (태스크)
import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
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

  width: 100%; /* 부모 요소의 너비를 사용 */

  svg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  p {
    margin-left: 10px; /* 아이콘과 담당자 이름 사이의 간격 */
    font-size: 14px;
    color: #555; /* 선택: 텍스트 색상 */

    text-align: right; /* 텍스트 오른쪽 정렬 */
    margin-left: auto; /* 자동 여백으로 오른쪽 끝으로 이동 */
  }
`;

const Task: React.FC<{
  isid: number;
  title: string;
  index: number;
  columnId: ColumnKey
  type?: 'task' | 'bug';
  manager?: string | null; // manager 필드 추가
  style?: React.CSSProperties;
}> = ({ isid, title, index, columnId, type, manager }) => {

  const navigate = useNavigate(); // useNavigate 사용
  const handleTaskClick = () => { navigate(`/issue/${isid}`); }; // isid를 포함하여 IssueDetail 페이지로 이동

  const [, dragRef] = useDrag({
    type: "TASK",
    item: { isid, title, index, fromColumn: columnId, type }, // 드래그 중 전달할 데이터
    //여기서 fromColumn 값이 ColumnKey 타입으로 정확히 전달
    collect: (monitor) => {
      if (monitor.isDragging()) {
        console.log(`Dragging Task: ${title}`); // 드래그 시작 시 title 출력
      }
    },
  });

  return (
    <TaskContainer ref={dragRef} id={`task-${isid}`} onClick={handleTaskClick}>
      <TaskTitle>{title}</TaskTitle>
      <IconContainer>
        {type === 'task' && <IssueTaskIcon />}
        {type === 'bug' && <IssueBugIcon />}
        <span>{type === 'task' ? '작업' : '버그'}</span>
        {manager && <p>{manager}</p>}
      </IconContainer>
    </TaskContainer>
  );
};

export default Task;