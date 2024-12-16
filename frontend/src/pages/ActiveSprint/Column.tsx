//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React, { useState } from 'react';
import styled from 'styled-components';
import Task from './Task';
// import DropZoneComponent from './DropZone';
// import { useDrop } from 'react-dnd';
import { Issue } from '../../recoil/atoms/issueAtoms';
import SpringList from 'react-spring-dnd';

type ColumnKey = "backlog" | "inProgress" | "done" | "qa";
type TaskType = Pick<Issue, 'isid' | 'title' | 'type' | 'manager'>;


//각 컬럼보드
const ColumnContainer = styled.div`
  flex: 1;
  background: #F2F2F2;
  border-radius: 8px;
  padding: 10px;
  margin-right: 20px;
  margin-bottom: 50px; /* 하단 간격 추가 */
  min-width: 150px;
  width: 300px; 

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
// interface ColumnProps {
//   title: string;
//   tasks: Task[];
//   columnId: ColumnKey;
//   onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number) => void;
//   onAddIssue: () => void; // 상위로부터 받는 콜백
// }


// const Column: React.FC<ColumnProps> = ({ title, tasks, columnId, onMoveTask, onAddIssue }) => {

//   const [{ isOver }, dropRef] = useDrop({
//     accept: "TASK",
//     drop: (item: { fromColumn: ColumnKey; index: number; type: 'task' | 'bug' }, monitor) => {
//     //   handleDropTask(item.index, null, item.fromColumn, columnId, false, item.type); // 드랍존이 아님
//     //   // typeCallback(Task.type);
//     // },

//     const hoverBoundingRect = monitor.getClientOffset(); // 마우스 위치 가져오기
//     const hoverIndex = tasks.findIndex((_, idx) => {
//       const taskElement = document.getElementById(`task-${idx}`);
//       if (!taskElement || !hoverBoundingRect) return false;
//       const taskRect = taskElement.getBoundingClientRect();
//       return (
//         hoverBoundingRect.y > taskRect.top && hoverBoundingRect.y < taskRect.bottom
//       );
//     });

//     handleDropTask(item.index, hoverIndex, item.fromColumn, columnId, true, item.type);
//   },

//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   });

//   //어느 곳에 드랍되었는지를 판별하는 함수
//   const handleDropTask = (dragIndex: number,
//     hoverIndex: number | null,
//     fromColumn: string,
//     toColumn: string,
//     isDropZone: boolean,
//     type: 'task' | 'bug'
//   ) => {
//     setTimeout(() => {
//       if (fromColumn === toColumn) {
//         if (isDropZone) {
//           if (dragIndex !== hoverIndex && hoverIndex !== null) {
//             onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
//           }
//         } else {
//           onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, tasks.length);
//         }
//       } else {
//         // onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
//         if (isDropZone) {
//           if (hoverIndex !== null) {
//             onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
//           }
//         } else {
//           // 드랍존이 아닌 곳에 드랍 -> 컬럼 변경, 마지막으로 이동
//           onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, tasks.length);
//         }
//       }
//     }, 0); // 상태 변경을 0ms 뒤로 지연
//   };


interface ColumnProps {
  title: string;
  tasks: TaskType[];

  columnId: ColumnKey; // columnId 추가
  // onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number) => void;
  onMoveTask: (taskId: number, targetColumnId: ColumnKey) => void;
  onReorder: (newOrder: TaskType[]) => void; // 여기에 타입 추가
  onAddIssue: () => void;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, columnId, onMoveTask, onReorder, onAddIssue }) => {
  // SpringList에 전달할 배열과 드래그 핸들러
  // const onDragEnd = (fromIndex: number, toIndex: number) => {
  //   if (fromIndex !== toIndex) {
  //     const updatedTasks = [...tasks];
  //     const [movedTask] = updatedTasks.splice(fromIndex, 1);
  //     updatedTasks.splice(toIndex, 0, movedTask);

  //     console.log('Updated Task Order:', updatedTasks);
  //     // 여기서 상태 업데이트 함수를 호출하면 됨.
  //   }
  // };

  // const onDragEnd = (orderList: number[]) => {
  //   const updatedTasks = orderList.map((index) => tasks[index]);
  //   console.log('Updated Task Order:', updatedTasks);
  
  //   // 여기서 상태를 업데이트하는 로직 추가
  // };


  // `isOver` 상태를 기반으로 ColumnContainer(컬럼) 테두리 색상 변경
  // const borderColor = isOver ? "green" : "transparent";

  // 드래그 종료 이벤트 핸들러
  // const handleDragEnd = (fromIndex: number, toIndex: number) => {
  //   if (fromIndex !== toIndex) {
  //     const updatedTasks = [...tasks];
  //     const [movedTask] = updatedTasks.splice(fromIndex, 1);
  //     updatedTasks.splice(toIndex, 0, movedTask);
  //     onReorder(updatedTasks);
  //   }
  // };
  const handleDragEnd = (orderList: number[]) => {
    const updatedTasks = orderList.map((index) => tasks[index]); // orderList에 따라 tasks 재배열
    onReorder(updatedTasks);
  };

  return (
    // <ColumnContainer ref={dropRef} style={{ border: `2px solid ${borderColor}` }}>
    //   <ColumnTitle>{title} ({tasks.length})</ColumnTitle>
    //   <SpringList>
    //   {tasks.map((task, index) => (
    //     <React.Fragment key={task.isid}>
    //       {/* <DropZoneComponent index={index} columnId={columnId} onDropTask={handleDropTask} /> */}
    //       <Task
    //         isid={task.isid}
    //         title={task.title}
    //         index={index}
    //         columnId={columnId}
    //         type={task.type === '작업' ? 'task' : 'bug'} // 여기서 매핑
    //         manager={task.manager ?? undefined} // manager가 null일 수 있으니 ??
    //       />
    //     </React.Fragment>
    //   ))}
    //   </SpringList>

    //   <AddIssueButton className="add-issue-button" onClick={onAddIssue}>+ 이슈 생성하기</AddIssueButton>
    // </ColumnContainer>
    <ColumnContainer>
      <ColumnTitle>{title} ({tasks.length})</ColumnTitle>

      {/* SpringList를 사용하여 드래그 가능한 리스트 구현 */}
      {/* <SpringList onDragEnd={onDragEnd}> */}
      {/* <SpringList> */}
      <SpringList onDragEnd={handleDragEnd}>
        {tasks.map((task, index) => (
          <Task
            key={task.isid}
            isid={task.isid}
            title={task.title}
            index={index}
            columnId="backlog"
            type={task.type === '작업' ? 'task' : 'bug'}
            manager={task.manager ?? undefined}
          />
        ))}
      </SpringList>

      <AddIssueButton className="add-issue-button" onClick={onAddIssue}>
        + 이슈 생성하기
      </AddIssueButton>
    </ColumnContainer>
  );
};


export default Column;