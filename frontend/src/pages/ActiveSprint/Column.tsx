//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React from 'react';
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
`;

//컬럼의 제목 표시
const ColumnTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

//hover와 drop 이벤트에서 Task 데이터와 상태를 동기화. hover에서 task위치가 실시간으로 변경되도록 수정한다. 
const Column: React.FC<{
  //컴포넌트 선언
  title: string; tasks: Task[]; columnId: ColumnKey; // string 타입 대신 ColumnKey 타입을 사용
  onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey,
               fromIndex: number, toIndex: number
  ) => void;
}> = ({ title, tasks, columnId, onMoveTask }) => {


  // const [hoverIndex, setHoverIndex] = useState<number | null>(null); // hoverIndex를 상태로 관리

  // const [{ isOver }, dropRef] = useDrop({
  //   //타입 정의
  //   accept: "TASK", // 드래그 가능한 타입

  //   //드롭 영역의 상태를 추적한다
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),

  //   //드래그 중에 드롭 영역 위에서 아이템이 호버링할 때 호출 
  //   hover: (item: { fromColumn: ColumnKey; index: number; hoverIndex?: number }, monitor) => {


  //   },

  //   //아이템이 드롭되었을 때 호출된다. 
  //   drop: (item: { fromColumn: ColumnKey; index: number; hoverIndex?: number }) => {
  //     const dragIndex = item.index;//드래그 시작 위치의 인덱스
  //     const dropIndex = tasks.length; // 드롭된 위치를 배열의 마지막으로 설정
  //     // const dropIndex = item.hoverIndex ?? tasks.length; // hoverIndex가 없으면 마지막 위치로 이동
  //     onMoveTask(item.fromColumn, columnId, dragIndex, dropIndex);//상태 업데이트
  //     // onMoveTask(item.fromColumn, columnId, item.index, dropIndex);
  //   },
  // });

  // // `isOver` 상태를 기반으로 테두리 색상 변경
  // const borderColor = isOver ? "green" : "transparent";

  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop: (item: { fromColumn: ColumnKey; index: number }) => {
      // 다른 컬럼 간 이동 처리
      if (item.fromColumn !== columnId) {
        onMoveTask(item.fromColumn, columnId, item.index, tasks.length);
      }
    },

    //드롭 영역의 상태를 추적한다
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // const handleHoverTask = (dragIndex: number, hoverIndex: number) => {
  //   // 같은 컬럼 내 태스크 중간 삽입 처리
  //   // onMoveTask(columnId, columnId, dragIndex, hoverIndex);
  // };
  const handleDropTask = (dragIndex: number, hoverIndex: number, fromColumn: string
  ) => {// 드롭 시 상태 최종 업데이트
    // onMoveTask(fromColumn as ColumnKey, columnId, dragIndex, hoverIndex);
    if (fromColumn === columnId) {
      // 같은 컬럼 내에서 태스크 이동 처리
      if (dragIndex !== hoverIndex) {
        onMoveTask(columnId, columnId, dragIndex, hoverIndex);
      }
    } else {
      // 다른 컬럼에서 태스크 이동 처리
      onMoveTask(fromColumn as ColumnKey, columnId, dragIndex, hoverIndex);
    }
  };

  // `isOver` 상태를 기반으로 테두리 색상 변경
  const borderColor = isOver ? "green" : "transparent";

  return (
    // style={{ border: `2px solid ${borderColor}` }}
    <ColumnContainer ref={dropRef} style={{ border: `2px solid ${borderColor}` }}>
      <ColumnTitle>
        {title} ({tasks.length})
      </ColumnTitle>
      {tasks.map((task, index) => (
        //   <Task key={index} id={`task-${index}`} title={task}
        //     index={index} columnId={columnId}
        //      /> 
        // ))}
        //     <React.Fragment key={index}>
        //       <DropZoneComponent index={index} columnId={columnId} onMoveTask={handleMoveTask} />
        //       <Task id={`task-${index}`} // id 추가
        //             title={task} index={index} columnId={columnId} />
        //     </React.Fragment>
        //   ))}
        //   <DropZoneComponent index={tasks.length} columnId={columnId} onMoveTask={handleMoveTask} />

        <React.Fragment key={index}>
          <DropZoneComponent index={index} columnId={columnId} onDropTask={handleDropTask}/>
          <Task id={`task-${index}`} title={task.title}
                index={index} columnId={columnId} type={task.type} />
        </React.Fragment>
      ))}
      <DropZoneComponent index={tasks.length} columnId={columnId} onDropTask={handleDropTask}/>
    </ColumnContainer>
  );
};


export default Column;
