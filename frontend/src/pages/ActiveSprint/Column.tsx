//각 컬럼 : 백로그, 진행중, 개발 완료, QA완료

import React, {useState} from 'react';
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

const Column: React.FC<{
  title: string; 
  tasks: Task[]; 
  columnId: ColumnKey;
  onMoveTask: (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number
  ) => void;
}> = ({ title, tasks, columnId, onMoveTask}) => {

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
      // if (dragIndex !== hoverIndex) {
      //   onMoveTask(fromColumn as ColumnKey, toColumn as ColumnKey, dragIndex, hoverIndex);
      // }
      // 같은 컬럼 내에서 Task의 위치를 변경
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


  // const [dataFromChild, setDataFromChild] = useState<'task' | 'bug'>('task');

  // // 자식이 호출할 콜백 함수
  // const typeCallback = (data: 'task' | 'bug') => {
  //   console.log('Received from child - type :', data);
  //   setDataFromChild(data); // 부모의 state를 업데이트
  // };


  // `isOver` 상태를 기반으로 ColumnContainer(컬럼) 테두리 색상 변경
  const borderColor = isOver ? "green" : "transparent";

  // type Task = { id: string; title: string; type: 'task' | 'bug' };
  return (
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
          <DropZoneComponent index={index} columnId={columnId}  onDropTask={handleDropTask} />
          <Task id={`task-${index}`} title={task.title}
            index={index} columnId={columnId} type={task.type} />

          {/* <DropZoneComponent index={tasks.length} columnId={columnId} onDropTask={handleDropTask}/> */}
        </React.Fragment>
      ))}
      {/* <DropZoneComponent index={tasks.length} columnId={columnId}  onDropTask={handleDropTask} /> */}
    </ColumnContainer>
  );
};


export default Column;
