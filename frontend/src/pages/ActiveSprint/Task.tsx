//보드의 각 이슈 (태스크)
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components';
import { ReactComponent as IssueTaskIcon } from '../../assets/icons/Issue-Task.svg';
import { ReactComponent as IssueBugIcon } from '../../assets/icons/Issue-Bug.svg';

type ColumnKey = 'backlog' | 'inProgress' | 'done' | 'qa';
interface TaskProps {
  id: number;
  text: string;
  index: number;
  columnId: number;
  moveTask: (
    fromColumnId: number,
    toColumnId: number,
    dragIndex: number,
    hoverIndex: number,
    task: DragItem
  ) => void;
}
interface DragItem {
  id: number;
  index: number;
  sourceColumn: number;
  text: string; // 추가
}

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
  svg { width: 20px; height: 20px; margin-right: 5px; }
`;
export const ItemTypes = {
  TASK: 'TASK',
};


// const Task: React.FC = ({ id, title, type, columnId, index, moveTask }) => {

//   const ref = useRef<HTMLDivElement>(null);


//   const [, dragRef] = useDrag({
//     type: 'TASK',
//     item: { id, sourceColumn: columnId, index },
//   });

//   const [, dropRef] = useDrop({
//     accept: 'TASK',
//     hover: (item: { id: string; sourceColumn: string; index: number }) => {
//       if (item.index === index && item.sourceColumn === columnId) {
//         return;
//       }
//       moveTask(columnId, columnId, item.index, index); // 같은 컬럼 내에서 순서 변경
//       item.index = index; // 인덱스 업데이트
//     },
//   });

//   dragRef(dropRef(ref));


//   return (
//     // <TaskContainer ref={dragRef} id={id}>
//     //   <TaskTitle>{title}</TaskTitle>
//     //   <IconContainer>
//     //     {type === 'task' && <IssueTaskIcon />}
//     //     {type === 'bug' && <IssueBugIcon />}
//     //     <span>{type === 'task' ? '작업' : '버그'}</span>
//     //   </IconContainer>
//     // </TaskContainer>
//     <TaskContainer ref={ref}>
//       <p>{title}</p>
//       <small>{type}</small>
//     </TaskContainer>
//   );
// };

// const Task = ({ id, text, index, columnId, moveTask }) => {
//   const ref = useRef(null);

//   const [, dragRef] = useDrag({
//     type: 'TASK',
//     item: { id, index, sourceColumn: columnId },
//   });

//   const [, dropRef] = useDrop({
//     accept: 'TASK',
//     hover: (item) => {
//       if (item.index !== index || item.sourceColumn !== columnId) {
//         moveTask(columnId, columnId, item.index, index, item);
//         item.index = index;
//       }
//     },
//   });

//   dragRef(dropRef(ref));

//   return <TaskContainer ref={ref}>{text}</TaskContainer>;
// };

const Task: React.FC<TaskProps> = ({ id, text, index, columnId, moveTask }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Drag 설정
  const [, dragRef] = useDrag<DragItem>({
    type: 'TASK',
    item: { id, index, sourceColumn: columnId, text },
  });

  // Drop 설정
  const [, dropRef] = useDrop<DragItem>({
    accept: 'TASK',
    hover: (item) => {
      // 같은 위치에서는 아무 작업도 하지 않음
      if (item.index === index && item.sourceColumn === columnId) {
        return;
      }

      // 이동 작업 수행
      moveTask(item.sourceColumn, columnId, item.index, index, item);

      // 드래그된 아이템의 index를 업데이트
      item.index = index;
    },
  });

  // Drag와 Drop을 ref에 연결
  dragRef(dropRef(ref));

  return <TaskContainer ref={ref}>{text}</TaskContainer>;
};

export default Task;
