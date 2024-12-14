import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRecoilValue } from 'recoil';
import { sprintBasicInfoState } from '../../recoil/atoms/sprintAtoms';
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";


// Task 타입 확장
interface CustomTask extends Task {
  styles?: {
    progressColor?: string;
    progressSelectedColor?: string;
    backgroundColor?: string;
    barCornerRadius?: number; // 커스텀 속성 추가
    barHeight?: number; // 커스텀 속성 추가
  };
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  overflow: hidden;
  /* background: pink; */
  width:100%;
`;
const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const TimelineContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-x: scroll;
`;
const CalendarGrid = styled.div`
  display: flex;
  position: relative;
  height: 50px;
  border-bottom: 1px solid #ccc;
`;
const Day = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #666;
  border-right: 1px solid #eee;
`;
const TodayLine = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ position }) => position}%;
  width: 2px;
  background: red;
  z-index: 10;
`;
const CustomTimelineBar = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0;

  .label {
    width: 120px;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color: #333;
  }

  .bar {
    height: 30px;
    border-radius: 15px;
    background-color: #56CCF2;
    position: absolute;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #2F80ED;
    }
  }
`;

type TimelineBar = {
  id: number;
  name: string;
  start: number;
  end: number;
};

const Timeline: React.FC = () => {
  const sprintBasicInfo = useRecoilValue(sprintBasicInfoState);
  const pname = sessionStorage.getItem('pname');
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  // Gantt 차트 더미 데이터
  // const tasks: CustomTask[] = [
  //   {
  //     start: new Date(2023, 10, 1), // 시작 날짜
  //     end: new Date(2023, 10, 10), // 종료 날짜
  //     name: "스프린트 1",
  //     id: "Task 1",
  //     type: "task",
  //     progress: 50, // 진행률
  //     styles: {
  //       progressColor: "#81C5C5", // 진행률 색상
  //       progressSelectedColor: "#038C8C", // 선택된 진행률 색상
  //       backgroundColor: "#f3f3f3", // 태스크 배경색
  //       barCornerRadius: 10, // 태스크 바의 둥근 모서리
  //       barHeight: 8, // 태스크 바의 높이
  //     },
  //   },
  //   {
  //     start: new Date(2023, 10, 11),
  //     end: new Date(2023, 10, 20),
  //     name: "스프린트 2",
  //     id: "Task 2",
  //     type: "task",
  //     progress: 30,
  //     styles: {
  //       progressColor: "#81C5C5", // 진행률 색상
  //       progressSelectedColor: "#038C8C", // 선택된 진행률 색상
  //       backgroundColor: "#f3f3f3", // 태스크 배경색
  //       barCornerRadius: 10, // 태스크 바의 둥근 모서리
  //       barHeight: 8, // 태스크 바의 높이
  //     },
  //   },
  //   {
  //     start: new Date(2023, 10, 21),
  //     end: new Date(2023, 10, 30),
  //     name: "스프린트 3",
  //     id: "Task 3",
  //     type: "task",
  //     progress: 80,
  //     styles: {
  //       progressColor: "#81C5C5", // 진행률 색상
  //       progressSelectedColor: "#038C8C", // 선택된 진행률 색상
  //       backgroundColor: "#f3f3f3", // 태스크 배경색
  //       barCornerRadius: 10, // 태스크 바의 둥근 모서리
  //       barHeight: 8, // 태스크 바의 높이
  //     },
  //   },
  // ];
  const tasks: CustomTask[] = sprintBasicInfo.map((sprint, index) => ({
    start: new Date(sprint.startdate), // 시작 날짜
    end: new Date(sprint.enddate), // 종료 날짜
    name: sprint.spname, // 스프린트 이름
    id: `Task ${index + 1}`, // ID 생성
    type: "task", // 태스크 타입
    progress: 10, // 기본 진행률
    styles: {
      progressColor: "#81C5C5", // 진행률 색상
      progressSelectedColor: "#038C8C", // 선택된 진행률 색상
      backgroundColor: "#f3f3f3", // 태스크 배경색
      barCornerRadius: 10, // 태스크 바의 둥근 모서리
      barHeight: 8, // 태스크 바의 높이
    },
  }));


  return (
    <BoardContainer>
      <BoardHeader>{/* 헤더 */}
        <BoardTitle>타임라인</BoardTitle>
        <Breadcrumb>프로젝트 &gt; {pname} &gt; 대시보드</Breadcrumb>
      </BoardHeader>

    <TimelineContainer>

      <Gantt
          tasks={tasks} // Gantt에 표시할 태스크
          viewMode={view} // 현재 뷰 모드

          onDateChange={(task) => console.log("Date changed:", task)} // 날짜 변경 이벤트
          onProgressChange={(task) => console.log("Progress changed:", task)} // 진행률 변경 이벤트
          onDoubleClick={(task) => alert(`Task ${task.name} was double-clicked.`)} // 더블 클릭 이벤트
          onSelect={(task, isSelected) =>
            console.log(`Task ${task.name} is ${isSelected ? "selected" : "unselected"}.`)
          } // 태스크 선택 이벤트

          listCellWidth={"80px"} // 좌측 태스크 리스트 폭
          columnWidth={60} // 열 폭
          ganttHeight={200} // 간트 차트 높이
        />
    </TimelineContainer>

    </BoardContainer>
  );
};

export default Timeline;