//백로그, 진행중, 개발 완료, QA완료 컬럼
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import Task from './Task';

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
`;
//컬럼의 제목 표시
const ColumnTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

type ColumnKey = 'backlog' | 'inProgress' | 'done' | 'qa';

// `isOver` 상태를 기반으로 ColumnContainer(컬럼) 테두리 색상 변경
// const borderColor = isOver ? "green" : "transparent";

//소스 코드
const Column = ({ title, tasks, columnId, moveTask }) => {
  const [, dropRef] = useDrop({
    accept: 'TASK', // Task만 드롭 가능
    drop: (item: { id: string; sourceColumn: string; index: number }) => {
      if (item.sourceColumn !== columnId) {
        moveTask(item.sourceColumn, columnId, item.index, tasks.length);
        item.sourceColumn = columnId; // 드롭 이후 sourceColumn 업데이트
        item.index = tasks.length; // 새로운 인덱스 업데이트
      }
    },
  }); 



const Column: React.FC = () => {

  // 이슈 생성하기 버튼
  const handleAddIssue = () => {
    console.log(`Add new issue to column: ${columnId}`);
    // 여기에 새로운 이슈 생성 로직 추가
  };


  return (
    <ColumnContainer ref={dropRef} style={{ border: `2px solid ${borderColor}` }}>
      <ColumnTitle>
        {title} ({tasks.length})
      </ColumnTitle>
      {/* {
        tasks.map((task, index) => (
          <React.Fragment key={index}>
            <Task id={`task-${index}`} title={task.title}
              index={index} columnId={columnId} type={task.type} />
          </React.Fragment>
        ))
      } */}
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          type={task.type}
          columnId={columnId}
          index={index}
          moveTask={moveTask}
        />
      ))}

      {/* 백로그 컬럼에 이슈생성 버튼 */}
      {columnId === "backlog" && (
        <button style={{
          marginTop: '10px', width: '100%', padding: '10px',
          backgroundColor: '#038C8C', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'
        }}
          onClick={handleAddIssue} > + 이슈 생성하기 </button>
      )}

    </ColumnContainer>
  );
};


export default Column;
