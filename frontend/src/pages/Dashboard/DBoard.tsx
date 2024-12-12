import React, { useState } from 'react';
import styled from 'styled-components';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Cell, Legend } from 'recharts';
import Draggable from 'react-draggable';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { FcLeave } from 'react-icons/fc';

import { useRecoilValue } from 'recoil';
import { allIssuesState } from '../../recoil/atoms/issueAtoms';

// 스타일 정의
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
const DashboardSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
  /* background: red; */
`;
const ActiveSprintSection = styled.div`
display: flex;
justify-content: space-between;
margin-top: 20px;
gap: 20px;
`;
const ChartContainer = styled.div`
width: 100%; /* 그래프의 크기에 맞게 자동으로 조정 */
  max-width: 700px; /* 최대 크기를 지정하여 박스 내부에 제한 */
  width: 100%;

  height: 500px; /* 높이 증가 */

  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* background:yellow; */
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
const Datediv = styled.div`
display: flex; /* Flexbox 사용 */
/* align-items: center;  */
 gap:3px;
`;

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


// Chart.js 요소 등록 (컴포넌트 외부에서 실행)
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend);

const DBoard: React.FC = () => {
  const pname = sessionStorage.getItem('pname');
  const [bars, setBars] = useState(timelineData);

  const totalDays = 100; // 캘린더 총 기간
  const todayPosition = 50; // 현재 날짜 위치 (%)

  // 드래그 핸들러
  // const handleDrag = (e: any, data: any, id: number, isResize: 'start' | 'end') => {
  //   setBars((prevBars) =>
  //     prevBars.map((bar) => bar.id === id ? {
  //           ...bar,
  //           [isResize]:
  //             isResize === 'start'
  //               ? Math.max(Math.min(bar.start + data.deltaX * 0.1, bar.end - 5), 0)
  //               : Math.max(bar.start + 5, bar.end + data.deltaX * 0.1),
  //         } : bar
  //     )
  //   );
  // };


  // Chart.js 데이터와 옵션 정의 _ 파이 차트 : 활성스프린트의 이슈를 status로 분류
  const pieData = {
    labels: ['백로그', '진행 중', '개발 완료', 'QA 완료'],
    datasets: [
      {
        label: '이슈 진행 상태',
        data: [10, 20, 30, 15],
        backgroundColor: ['#FF6384', '#FFCD56', '#4BC0C0', '#36A2EB'],
        hoverOffset: 4,
        borderWidth: 1,
      },
    ],
  };
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Chart.js에서 허용되는 값
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  //팀원별 이슈 현황 _ 막대 차트 : 활성스프린트의 이슈를 팀원으로 분류, status로 분류
  const stackedBarData = {
    labels: ['팀원 1', '팀원 2', '팀원 3', '팀원 4'], // x축 레이블
    datasets: [
      {
        label: '백로그',
        data: [5, 6, 8, 2], // 데이터 값
        backgroundColor: '#E63946',
        // stack: 'Group 1', // 그룹 1

        barPercentage: 0.5, // 막대 두께
      categoryPercentage: 0.8, // 카테고리 너비
      },
      {
        label: '진행 중',
        data: [8, 7, 10, 5],
        backgroundColor: '#F1FAEE',
        // stack: 'Group 1', // 그룹 1
        barPercentage: 0.5,
      categoryPercentage: 0.8,
      },
      {
        label: '개발 완료',
        data: [10, 15, 20, 8],
        backgroundColor: '#A8DADC',
        // stack: 'Group 2', // 그룹 2
        barPercentage: 0.5,
      categoryPercentage: 0.8,
      },
      {
        label: 'QA 완료',
        data: [2, 3, 5, 2],
        backgroundColor: '#457B9D',
        // stack: 'Group 2', // 그룹 2
        barPercentage: 0.5,
      categoryPercentage: 0.8,
      },
    ],
  };
  const stackedBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      title: {
        display: true,
        text: '팀원별 이슈 현황 상태',
      },
    },
    scales: {
      x: {
        stacked: true, // x축 그룹 스택 활성화
        // barPercentage: 0.8, // 막대 두께 설정 (0.1 ~ 1.0)
        // categoryPercentage: 0.8, // 카테고리(그룹) 너비 설정
        ticks: {
          maxRotation: 0, // 텍스트 회전 제거
          minRotation: 0,
        },
      },
      y: {
        stacked: true, // y축 그룹 스택 활성화
        beginAtZero: true,
      },
    },
  };

  return (
    <BoardContainer>
      <BoardHeader>{/* 헤더 */}
        <BoardTitle>대시보드</BoardTitle>
        <Breadcrumb>프로젝트 &gt; {pname} &gt; 대시보드</Breadcrumb>
      </BoardHeader>

      <DashboardSection>{/*차트라이브러리*/}
        <ChartContainer>{/* 이슈 진행 상태 */}
          <h3>이슈 진행 상태</h3>
          {/* <PieChart width={300} height={300}> */}
          {/* <Pie data={issueProgressData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {issueProgressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart> */}

          <Pie data={pieData} options={options} />
        </ChartContainer>

        <ChartContainer>
          <h3>팀원별 이슈 현황 상태</h3>
          {/* <BarChart width={500} height={300} data={teamIssueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="backlog" stackId="a" fill="#FFA84A" />
            <Bar dataKey="progress" stackId="a" fill="#FB67CA" />
            <Bar dataKey="complete" stackId="a" fill="#9B88ED" />
            <Bar dataKey="qa" stackId="a" fill="#5ED3E4" />
          </BarChart> */}
          <Bar data={stackedBarData} options={stackedBarOptions} />
        </ChartContainer>

      </DashboardSection>

      <ActiveSprintSection>{/*활성스프린트 설명*/}
          <InfoCard>
            <h4>네비게이션바 디자인팀과 개발팀 협업</h4>
            <p>색상 수정 및 애니메이션 기능 수정</p>
            <br/>
            <Datediv><FcLeave /><h4>남은 기간</h4></Datediv>
            <span>5일</span>
            <p>시작일 : 2024.10.5</p>
            <p>마감일 : 2024.12.15</p>

          </InfoCard>
          
      </ActiveSprintSection>

      <TimelineContainer>{/*간트차트*/}
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
            // onDrag={(e, data) => handleDrag(e, data, bar.id, 'start')}
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
            // onDrag={(e, data) => handleDrag(e, data, bar.id, 'end')}
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

    </BoardContainer>
  );
};

export default DBoard;
