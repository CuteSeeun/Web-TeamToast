//칸반 보드

import React, { useState } from 'react';
import styled from 'styled-components';
import Column from './Column';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type ColumnKey = 'backlog' | 'inProgress' | 'done' | 'qa';

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
  overflow: hidden; /* BoardContainer에서 스크롤 막기 */
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
`;

const BoardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 8px; /* 제목과의 간격 */
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
  margin-bottom: 0px; /* BoardMain과 간격을 줄이려면 이 값을 줄이세요 근데 여기서 더 간격을 줄이고 싶다면 BoradMain의 마진 탑을 줄이면 된다.*/

  & > label {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;

    svg {
      margin-left: 5px; /* 텍스트와 아이콘 간격 */
    }
  }
`;

const BoardMain = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap; /* 줄바꿈 허용하지 않음 */
  margin-left: 18px; /* 왼쪽 여백을 주고 싶다면 margin-left를 사용하세요 */
  margin-top: 0px; /* 필요하다면 위쪽 여백을 제거하세요 */
  
  // overflow-x: auto; /* 필요하면 스크롤 추가 */
  overflow-y: hidden; /* 세로 스크롤 방지 */ /*근데 이걸 해야 가로 스크롤이 생김..*/
  // width: 100%; /* 부모 컨테이너 크기에 맞춤 */
`;

const SprintCompleteButton = styled.button`

  position: absolute;
  top: 100px;
  right: 20px;
  padding: 10px 10px;
  background-color: #038C8C;
  color: #fff;
  font-size: 14px;
  // font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 

  &:hover {
    background-color: #026b6b;
  }

  &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
  }
`;


const SBoard: React.FC = () => {

  //columns 상태는 컬럼과 그 안에 태스크 목록을 저장한다
  const [columns, setColumns] = useState<{
    //타입 지정
    backlog: { id: string; title: string; type: 'task' | 'bug' }[]; 
    inProgress: { id: string; title: string; type: 'task' | 'bug' }[]; 
    done: { id: string; title: string; type: 'task' | 'bug' }[]; 
    qa: { id: string; title: string; type: 'task' | 'bug' }[];
  }>({
    //태스크 목록 초기 상태 (이는 아톰에서 받아올거임)
    backlog: [
      { id: "1", title: "이슈 이름 1", type: "task" }
    ],
    inProgress: [
      { id: "2", title: "이슈 이름 2", type: "bug" },
      { id: "3", title: "이슈 이름 3", type: "bug" }
    ],
    done: [
      { id: "4", title: "이슈 이름 4", type: "task" }
    ],
    qa: [
      { id: "5", title: "이슈 이름 5", type: "bug" }
    ],
  });


  //태스크를 원래 컬럼에서 제거하고 새로운 컬럼에 삽입 후 상태를 업데이트하는 함수
  //컬럼 간 이동 및 같은 컬럼 내 삽입을 모두 처리한다. 
  const moveTask = (fromColumn: ColumnKey, toColumn: ColumnKey,
                    fromIndex: number, toIndex: number
  ) => {
    // // 유효성 검증 추가
    // //fromColumn과 toColumn이 columns 객체의 유효한 키인지 확인
    // if (!columns[fromColumn] || !columns[toColumn]) {
    //   alert(`Invalid column keys: ${fromColumn}, ${toColumn}`);
    // }

    // //같은 컬럼 내에서 이동
    // if (fromColumn === toColumn) {
    //   const updatedColumn = [...columns[fromColumn]];
    //   const [movedTask] = updatedColumn.splice(fromIndex, 1); // 기존 위치에서 제거
    //   updatedColumn.splice(toIndex, 0, movedTask); // 새 위치에 삽입

    //   setColumns({
    //     ...columns,
    //     [fromColumn]: updatedColumn, // 같은 컬럼 업데이트
    //   });
    // } else {
    // // 다른 컬럼으로 이동
    //   const fromTasks = [...columns[fromColumn]];
    //   const [movedTask] = fromTasks.splice(fromIndex, 1); // 원래 컬럼에서 제거
    //   const toTasks = [...columns[toColumn]];
    //   toTasks.splice(toIndex, 0, movedTask); // 새 컬럼에 삽입

    //   setColumns({
    //     ...columns,
    //     [fromColumn]: fromTasks, // 원래 컬럼 업데이트
    //     [toColumn]: toTasks, // 대상 컬럼 업데이트
    //   });
    // }
    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };
  
      // 드래그된 태스크를 원래 위치에서 제거
      const [movedTask] = updatedColumns[fromColumn].splice(fromIndex, 1);
  
      // 드롭된 위치에 태스크 삽입
      updatedColumns[toColumn].splice(toIndex, 0, movedTask);
  
      return updatedColumns;
    });
  };


  return (
    <>
      <BoardContainer>
        {/* 상단 헤더 */}
        <BoardHeader>
          {/* 제목 */}
          <BoardTitle>활성 스프린트</BoardTitle>
          {/* 네비게이션 텍스트 */}
          <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 활성 스프린트</Breadcrumb>
          <Filters>
            <label>담당자 <FaChevronDown /></label>
            <label>유형 <FaChevronDown /></label>
            <label>우선순위 <FaChevronDown /></label>
          </Filters>
          <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
        </BoardHeader>

        <DndProvider backend={HTML5Backend}>
          <BoardMain>
            <Column title="백로그" tasks={columns.backlog} columnId="backlog" onMoveTask={moveTask}/>
            <Column title="진행 중" tasks={columns.inProgress} columnId="inProgress" onMoveTask={moveTask} />
            <Column title="개발 완료" tasks={columns.done} columnId="done" onMoveTask={moveTask} />
            <Column title="QA 완료" tasks={columns.qa} columnId="qa" onMoveTask={moveTask} />
          </BoardMain>
        </DndProvider>
      </BoardContainer>
    </>
  );
};

export default SBoard;