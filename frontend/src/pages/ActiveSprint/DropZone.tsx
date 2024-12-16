import React from "react";
import styled from "styled-components";
import { useDrop } from "react-dnd";

const DropZone = styled.div<{ isOver: boolean }>`
  height: 5px;
  margin: 5px 0;
  background-color: ${({ isOver }) => (isOver ? "green" : "transparent")};
  transition: background-color 0.2s ease;
`;

type DropZoneProps = {
    index: number;
    columnId: string;
    // type: 'task' | 'bug',
    //   onMoveTask: (dragIndex: number, hoverIndex: number) => void;
    // onHoverTask: (dragIndex: number, hoverIndex: number) => void;
    onDropTask: (dragIndex: number, hoverIndex: number | null, fromColumn: string, 
                toColumn: string, isDropZone: boolean ,type: 'task' | 'bug',  ) => void;
};

const DropZoneComponent: React.FC<DropZoneProps> = ({
    index, columnId, onDropTask, 
}) => {
    const [{ isOver }, dropRef] = useDrop({
        accept: "TASK",
        drop: (item: { index: number; fromColumn: string, title: string; type: 'task' | 'bug',  }) => {
            onDropTask(item.index, index, item.fromColumn, columnId, true, item.type );
            
          },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return <DropZone ref={dropRef} isOver={isOver} />;
};

export default DropZoneComponent;

//드랍존에서 호버를 없앰 : 드래그해서 태스크들 위로 지나가면 막 상태값이 바뀌는건지
//ui의 값이 자꾸 바뀌고 드랍 영역에 중간 삽입할 때 빈 박스 생겨서 없애버림 