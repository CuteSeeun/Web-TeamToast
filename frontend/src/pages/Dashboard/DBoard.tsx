//

import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import Draggable from 'react-draggable';
import { useRecoilValue } from 'recoil';
import { allIssuesState } from '../../recoil/atoms/issueAtoms';

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

const ActiveSprintSection = styled.div`
display: flex;
justify-content: space-between;
margin-top: 20px;
gap: 20px;
`;

const ChartContainer = styled.div`
width: 100%; /* 그래프의 크기에 맞게 자동으로 조정 */
  max-width: 550px; /* 최대 크기를 지정하여 박스 내부에 제한 */
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

const InfoContainer = styled.div`
/* width: 48%; */
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoCard = styled.div`
/* width: 48%; */
  flex: 1;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h4 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #555;
  }

  span {
    font-size: 32px;
    font-weight: bold;
    color: #000;
  }
`;


// 데이터 타입 정의
type TimelineBar = {
  id: number;
  name: string;
  start: number;
  end: number;
};

// 간트차트 스프린트 더미 데이터
const timelineData: TimelineBar[] = [
  { id: 1, name: '스프린트 1', start: 10, end: 30 },
  { id: 2, name: '스프린트 2', start: 35, end: 70 },
  { id: 3, name: '스프린트 3', start: 80, end: 95 },
];
//이슈 진행 상태 더미 데이터 
const issueProgressData = [
  { name: '백로그', value: 10, color: '#F2994A' },
  { name: '진행 중', value: 20, color: '#56CCF2' },
  { name: '개발 완료', value: 30, color: '#27AE60' },
  { name: 'QA 완료', value: 15, color: '#9B51E0' },
];
//팀원별 이슈 현황 상태 
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

      <ActiveSprintSection>
        <InfoContainer>
          <InfoCard>
            <h4>활성 스프린트명 spname</h4>
            <p>목표 goal</p>
          </InfoCard>
          <InfoCard>
            <h4>남은 기간</h4>
            <span>enddate-현재</span>
            <p>전체 기간 들어갈 자리입니다.</p>
          </InfoCard>
        </InfoContainer>
      </ActiveSprintSection>


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
