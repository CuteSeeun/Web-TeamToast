//칸반 보드

// import React from 'react';
// import styled from 'styled-components';
// // import Column from './Column';
// import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가

// const BoardContainer = styled.div`
//   position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
//   display: flex;
//   flex-direction: column;
//   padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
//   overflow: hidden; /* BoardContainer에서 스크롤 막기 */
// `;

// const BoardHeader = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: flex-start;
//   padding: 20px;
// `;

// const BoardTitle = styled.h1`
//   font-size: 24px;
//   font-weight: bold;
// `;

// const Breadcrumb = styled.div`
//   font-size: 14px;
//   color: #6c757d;
//   margin-top: 8px; /* 제목과의 간격 */
// `;

// const Filters = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
//   margin-bottom: 0px; /* BoardMain과 간격을 줄이려면 이 값을 줄이세요 근데 여기서 더 간격을 줄이고 싶다면 BoradMain의 마진 탑을 줄이면 된다.*/

//   & > label {
//     display: flex;
//     align-items: center;
//     margin-right: 20px;
//     font-size: 14px;
//     cursor: pointer;

//     svg {
//       margin-left: 5px; /* 텍스트와 아이콘 간격 */
//     }
//   }
// `;

// const BoardMain = styled.div`
//   display: flex;
//   flex: 1;
//   flex-wrap: nowrap; /* 줄바꿈 허용하지 않음 */
//   margin-left: 18px; /* 왼쪽 여백을 주고 싶다면 margin-left를 사용하세요 */
//   margin-top: 0px; /* 필요하다면 위쪽 여백을 제거하세요 */
  
//   // overflow-x: auto; /* 필요하면 스크롤 추가 */
//   overflow-y: hidden; /* 세로 스크롤 방지 */ /*근데 이걸 해야 가로 스크롤이 생김..*/
//   // width: 100%; /* 부모 컨테이너 크기에 맞춤 */
// `;

// const SprintCompleteButton = styled.button`
//   position: absolute;
//   top: 100px;
//   right: 20px;
//   padding: 10px 10px;
//   background-color: #038C8C;
//   color: #fff;
//   font-size: 14px;
//   // font-weight: bold;
//   border: none;
//   border-radius: 10px;
//   cursor: pointer;
//   margin-top : 30px;
//   // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 

//   &:hover {
//     background-color: #026b6b;
//   }

//   &:active {
//     transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
//   }
// `;

// const DashboardBoard: React.FC = () => {
//   return (
//     <BoardContainer>
//       {/* 상단 헤더 */}
//       <BoardHeader>
//         {/* 제목 */}
//         <BoardTitle>대시보드</BoardTitle>
//         {/* 네비게이션 텍스트 */}
//         <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 대시보드</Breadcrumb>
//           <Filters>
//             <label>담당자 <FaChevronDown /></label>
//             <label>유형 <FaChevronDown /></label>
//             <label>우선순위 <FaChevronDown /></label>
//           </Filters>
//           <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
//       </BoardHeader>
//       {/* 메인 칸반 보드 */}
//       {/* <BoardMain>
//         <Column title="백로그" tasks={[]} />
//         <Column title="진행 중" tasks={['이슈 1', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2' ]} />
//         <Column title="개발 완료" tasks={['이슈 3', '이슈 4']} />
//         <Column title="QA 완료" tasks={['이슈 5']} />
//       </BoardMain> */}
//     </BoardContainer>
//   );
// };

// export default DashboardBoard;


import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import Draggable from 'react-draggable';

// 스타일 정의
const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  overflow: hidden;
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

const DashboardSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
`;

const ChartContainer = styled.div`
width: 100%; /* 그래프의 크기에 맞게 자동으로 조정 */
  // max-width: 550px; /* 최대 크기를 지정하여 박스 내부에 제한 */
  width: 48%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TimelineContainer = styled.div`
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

// const CustomXAxis = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 10px;
//   font-size: 14px;
//   color: #6c757d;
// `;

// const CustomTimelineBar = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 10px 0;

//   .label {
//     width: 120px;
//     text-align: right;
//     margin-right: 10px;
//     font-size: 14px;
//     color: #333;
//   }

//   .bar {
//     height: 30px;
//     border-radius: 15px;
//     background-color: #56CCF2;
//     position: relative;
//     transition: 0.3s;

//     &:hover {
//       background-color: #2F80ED;
//     }

//     .tooltip {
//       position: absolute;
//       top: -30px;
//       left: 50%;
//       transform: translateX(-50%);
//       background: #000;
//       color: #fff;
//       padding: 5px 10px;
//       border-radius: 5px;
//       font-size: 12px;
//       opacity: 0;
//       pointer-events: none;
//       transition: 0.3s;
//     }

//     &:hover .tooltip {
//       opacity: 1;
//     }
//   }
// `;


// 데이터 타입 정의
type TimelineBar = {
  id: number;
  name: string;
  start: number;
  end: number;
};

// 차트 데이터
const timelineData: TimelineBar[] = [
  { id: 1, name: '스프린트 1', start: 10, end: 30 },
  { id: 2, name: '스프린트 2', start: 35, end: 70 },
  { id: 3, name: '스프린트 3', start: 80, end: 95 },
];

const issueProgressData = [
  { name: '백로그', value: 10, color: '#F2994A' },
  { name: '진행 중', value: 20, color: '#56CCF2' },
  { name: '개발 완료', value: 30, color: '#27AE60' },
  { name: 'QA 완료', value: 15, color: '#9B51E0' },
];

const teamIssueData = [
  { name: '김정연', backlog: 5, progress: 8, complete: 10, qa: 2 },
  { name: '김현진', backlog: 6, progress: 7, complete: 15, qa: 3 },
  { name: '조하영', backlog: 8, progress: 10, complete: 20, qa: 5 },
  { name: '최세은', backlog: 2, progress: 5, complete: 8, qa: 2 },
];

const DBoard: React.FC = () => {
  const [bars, setBars] = useState(timelineData);

  const totalDays = 100; // 캘린더 총 기간
  const todayPosition = 50; // 현재 날짜 위치 (%)

  // 드래그 핸들러
  const handleDrag = (e: any, data: any, id: number, isResize: 'start' | 'end') => {
    setBars((prevBars) =>
      prevBars.map((bar) =>
        bar.id === id
          ? {
              ...bar,
              [isResize]:
                isResize === 'start'
                  ? Math.max(Math.min(bar.start + data.deltaX * 0.1, bar.end - 5), 0)
                  : Math.max(bar.start + 5, bar.end + data.deltaX * 0.1),
            }
          : bar
      )
    );
  };

  return (
    <BoardContainer>
      {/* 헤더 */}
      <BoardHeader>
        <BoardTitle>대시보드</BoardTitle>
        <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 대시보드</Breadcrumb>
      </BoardHeader>

      {/* 타임라인 */}
      {/* <TimelineContainer>
        <h3>타임라인</h3>
        <BarChart width={600} height={300} data={timelineData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="start" stackId="a" fill="#56CCF2" />
          <Bar dataKey="end" stackId="a" fill="#2F80ED" />
        </BarChart>
      </TimelineContainer> */}

      {/* <TimelineContainer>
      <h3>타임라인</h3>
      <div>
        {timelineData.map((item) => (
          <CustomTimelineBar key={item.name}>
            <div className="label">{item.name}</div>
            <div
              className="bar"
              style={{
                width: `${((item.end - item.start) / totalDays) * 100}%`,
                marginLeft: `${(item.start / totalDays) * 100}%`,
              }}
            >
              <span className="tooltip">{`Start: ${item.start}, End: ${item.end}`}</span>
            </div>
          </CustomTimelineBar>
        ))}
      </div>
      <CustomXAxis>
        <span>0일</span>
        <span>100일</span>
        <span>200일</span>
        <span>300일</span>
      </CustomXAxis>
    </TimelineContainer> */}


<TimelineContainer>
      <h3>타임라인</h3>
      {/* 캘린더 그리드 */}
      <CalendarGrid>
        {[...Array(totalDays / 10)].map((_, index) => (
          <Day key={index}>{index * 10}일</Day>
        ))}
      </CalendarGrid>

      {/* 현재 날짜 라인 */}
      <TodayLine position={todayPosition} />

      {/* 타임라인 바 */}
      {bars.map((bar, index) => (
        <CustomTimelineBar key={bar.id}>
          <div className="label">{bar.name}</div>
          <Draggable
            axis="x"
            bounds="parent"
            position={{
              x: (bar.start / totalDays) * 100,
              y: 0,
            }}
            onDrag={(e, data) => handleDrag(e, data, bar.id, 'start')}
          >
            <div
              className="bar"
              style={{
                width: `${((bar.end - bar.start) / totalDays) * 100}%`,
                left: `${(bar.start / totalDays) * 100}%`,
              }}
            ></div>
          </Draggable>

          <Draggable
            axis="x"
            bounds="parent"
            position={{
              x: (bar.end / totalDays) * 100,
              y: 0,
            }}
            onDrag={(e, data) => handleDrag(e, data, bar.id, 'end')}
          >
            <div
              className="bar"
              style={{
                width: '10px',
                height: '30px',
                backgroundColor: '#333',
                position: 'absolute',
                right: '-5px',
                top: '0',
                cursor: 'col-resize',
              }}
            ></div>
          </Draggable>
        </CustomTimelineBar>
      ))}
    </TimelineContainer>


      {/* 차트 섹션 */}
      <DashboardSection>
        {/* 이슈 진행 상태 */}
        <ChartContainer>
          <h3>이슈 진행 상태</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={issueProgressData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {issueProgressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>

        {/* 팀원별 이슈 현황 */}
        <ChartContainer>
          <h3>팀원별 이슈 현황 상태</h3>
          <BarChart width={500} height={300} data={teamIssueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="backlog" stackId="a" fill="#FFA84A" />
            <Bar dataKey="progress" stackId="a" fill="#FB67CA" />
            <Bar dataKey="complete" stackId="a" fill="#9B88ED" />
            <Bar dataKey="qa" stackId="a" fill="#5ED3E4" />
          </BarChart>
        </ChartContainer>
      </DashboardSection>
    </BoardContainer>
  );
};

export default DBoard;
