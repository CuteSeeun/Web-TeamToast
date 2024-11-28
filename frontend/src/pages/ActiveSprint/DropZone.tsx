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
    //   onMoveTask: (dragIndex: number, hoverIndex: number) => void;
    // onHoverTask: (dragIndex: number, hoverIndex: number) => void;
    onDropTask: (dragIndex: number, hoverIndex: number, fromColumn: string) => void;
};

const DropZoneComponent: React.FC<DropZoneProps> = ({
    index, columnId, onDropTask,
}) => {
    const [{ isOver }, dropRef] = useDrop({
        accept: "TASK",
        // hover: (item: { index: number; fromColumn: string }) => {
        //     //   if (item.fromColumn === columnId && item.index === index) return;
        //     //   onMoveTask(item.index, index); // 드롭 영역 기준으로 태스크 이동
        //     //   item.index = index; // 드래그 상태 업데이트
        //     // 같은 위치에 드래그 중이면 아무 작업도 하지 않음
        //     if (item.index === index && item.fromColumn === columnId) return;

        //     // 태스크 중간 삽입 처리
        //     onHoverTask(item.index, index);
        //     // item.index = index; // 드래그 상태 업데이트
        // },
        drop: (item: { index: number; fromColumn: string }) => {
            // 중간 삽입 최종 처리
            onDropTask(item.index, index, item.fromColumn);
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
