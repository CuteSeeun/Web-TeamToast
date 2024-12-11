//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
import DropZoneComponent from './DropZone';
import { useDrop } from 'react-dnd';

type ColumnKey = "backlog" | "inProgress" | "done" | "qa";
type Task = { id: string; title: string; type: 'task' | 'bug' };

//각 컬럼보드
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

  /* 호버 시 AddIssueButton 노출 */
  &:hover .add-issue-button {
    display: block;
  }
`;
//컬럼의 제목 표시
const ColumnTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;
//이슈 생성 버튼
const AddIssueButton = styled.button`
  display: none; /* 기본적으로 숨김 */
  /* width: 100%; */
  /* background: #038C8C; */
  /* color: #fff; */
  background: none;
  border: none;
  color: #4d4d4d;
  /* border-radius: 8px; */
  padding: 0px;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  text-align: center; 
  width: 100%; /* 버튼을 가로 전체 사용 */
  &:hover {
    /* background-color: #026b6b; */
    color: black;
  }
  &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
  }
`;
interface ColumnProps {
  title: string;
  tasks: Task[];
  columnId: ColumnKey;
  onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number) => void;
  onAddIssue: () => void; // 상위로부터 받는 콜백
}

// const Column: React.FC<{
//   title: string; tasks: Task[]; columnId: ColumnKey; onAddIssue;
//   onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number) => void;
// }> = ({ title, tasks, columnId, onMoveTask }) => {
  const Column: React.FC<ColumnProps> = ({ title, tasks, columnId, onMoveTask, onAddIssue }) => {

  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop: (item: { fromColumn: ColumnKey; index: number; type: 'task' | 'bug' }) => {
      handleDropTask(item.index, null, item.fromColumn, columnId, false, item.type); // 드랍존이 아님
      // typeCallback(Task.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });


  //어느 곳에 드랍되었는지를 판별하는 함수
  const handleDropTask = (dragIndex: number,
    hoverIndex: number | null,
    fromColumn: string,
    toColumn: string,
    isDropZone: boolean,
    type: 'task' | 'bug'
  ) => {
    setTimeout(() => {
      if (fromColumn === toColumn) {
        if (isDropZone) {
          if (dragIndex !== hoverIndex && hoverIndex !== null) {
            onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
          }
        } else {
          onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, tasks.length);
        }
      } else {
        // onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
        if (isDropZone) {
          if (hoverIndex !== null) {
            onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
          }
        } else {
          // 드랍존이 아닌 곳에 드랍 -> 컬럼 변경, 마지막으로 이동
          onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, tasks.length);
        }
      }
    }, 0); // 상태 변경을 0ms 뒤로 지연
  };

  // `isOver` 상태를 기반으로 ColumnContainer(컬럼) 테두리 색상 변경
  const borderColor = isOver ? "green" : "transparent";

  return (
    <ColumnContainer ref={dropRef} style={{ border: `2px solid ${borderColor}` }}>
      <ColumnTitle>
        {title} ({tasks.length})
      </ColumnTitle>
      {tasks.map((task, index) => (
        <React.Fragment key={index}>
          <DropZoneComponent index={index} columnId={columnId} onDropTask={handleDropTask} />
          <Task id={`task-${index}`} title={task.title}
            index={index} columnId={columnId} type={task.type} />
        </React.Fragment>
      ))}

<AddIssueButton className="add-issue-button" onClick={onAddIssue}>+ 이슈 생성하기</AddIssueButton>
    </ColumnContainer>
  );
};


export default Column;