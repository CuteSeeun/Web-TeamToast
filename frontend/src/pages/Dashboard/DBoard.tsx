import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { FcLeave } from 'react-icons/fc';
import { useRecoilValue } from 'recoil';
import { issuesByStatusState, issuesByManagerAndStatusState } from '../../recoil/atoms/issueAtoms'; // issuesByStatusState 셀렉터를 가져오는 경로 확인 필요
import { enabledSprintsState } from '../../recoil/atoms/sprintAtoms';
import { differenceInDays, format } from 'date-fns';
import {HashLoader} from 'react-spinners';

// 스타일 정의
const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  overflow: hidden;
  /* background: pink; */
  width:100%;

  background: linear-gradient(180deg, #FFFFFF, #81C5C5);
  /* background: linear-gradient(180deg, #81C5C5, #BFE3E3, #FFFFFF); */
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


// Chart.js 요소 등록 (컴포넌트 외부에서 실행)
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend);

const DBoard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const pname = sessionStorage.getItem('pname');
  const issuesByStatus = useRecoilValue(issuesByStatusState);
  const issuesByManagerAndStatus = useRecoilValue(issuesByManagerAndStatusState);
  const enabledSprints = useRecoilValue(enabledSprintsState);
  const sprintDetails = enabledSprints[0];// 필요한 필드만 추출

  // 컴포넌트 내부에서
  const startDate = new Date(sprintDetails.startdate);
  const endDate = new Date(sprintDetails.enddate);
  const today = new Date();
  const remainingDays = differenceInDays(endDate, today);
  const formattedStartDate = format(startDate, 'yyyy.MM.dd');
  const formattedEndDate = format(endDate, 'yyyy.MM.dd');

  // 2초 후 로딩 상태 종료 (추가)
        useEffect(() => {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);
    
            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
        }, []);


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


  // Chart.js 데이터와 옵션 정의
  //이슈 진행 상태 _ 파이 차트 : 활성스프린트의 이슈를 status로 분류
  const pieData = {
    labels: ['백로그', '진행 중', '개발 완료', 'QA 완료'],
    datasets: [
      {
        label: '이슈 진행 상태',
        data: [
          issuesByStatus.backlog.length, //백로그
          issuesByStatus.working.length, //진행중
          issuesByStatus.dev.length, //개발완료
          issuesByStatus.qa.length, //QA완료
        ],
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
  const labels = Object.keys(issuesByManagerAndStatus);
  const datasets = [
    {
      label: '백로그',
      data: labels.map((manager) => issuesByManagerAndStatus[manager]?.['백로그'] || 0),
      // backgroundColor: '#E63946',
      // backgroundColor: '#64B2B2',
      backgroundColor: '#9B72CF',
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
    {
      label: '진행 중',
      data: labels.map((manager) => issuesByManagerAndStatus[manager]?.['작업중'] || 0),
      // backgroundColor: '#F1FAEE',
      // backgroundColor: '#A8DADC',
      backgroundColor: '#FF729F',
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
    {
      label: '개발 완료',
      data: labels.map((manager) => issuesByManagerAndStatus[manager]?.['개발완료'] || 0),
      // backgroundColor: '#A8DADC',
      // backgroundColor: '#F1FAEE',
      backgroundColor: '#FDBA74',
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
    {
      label: 'QA 완료',
      data: labels.map((manager) => issuesByManagerAndStatus[manager]?.['QA완료'] || 0),
      // backgroundColor: '#457B9D',
      // backgroundColor: '#457B9D',
      backgroundColor: '#4ABFF7',
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
  ];
  const stackedBarData = { //<차트 라이브러리>
    // labels: ['팀원 1', '팀원 2', '팀원 3', '팀원 4'], // x축 레이블
    // datasets: [
    //   {
    //     label: '백로그',
    //     data: [5, 6, 8, 2], // 데이터 값
    //     backgroundColor: '#E63946',
    //     // stack: 'Group 1', // 그룹 1

    //     barPercentage: 0.5, // 막대 두께
    //   categoryPercentage: 0.8, // 카테고리 너비
    //   },
    //   {
    //     label: '진행 중',
    //     data: [8, 7, 10, 5],
    //     backgroundColor: '#F1FAEE',
    //     // stack: 'Group 1', // 그룹 1
    //     barPercentage: 0.5,
    //   categoryPercentage: 0.8,
    //   },
    //   {
    //     label: '개발 완료',
    //     data: [10, 15, 20, 8],
    //     backgroundColor: '#A8DADC',
    //     // stack: 'Group 2', // 그룹 2
    //     barPercentage: 0.5,
    //   categoryPercentage: 0.8,
    //   },
    //   {
    //     label: 'QA 완료',
    //     data: [2, 3, 5, 2],
    //     backgroundColor: '#457B9D',
    //     // stack: 'Group 2', // 그룹 2
    //     barPercentage: 0.5,
    //   categoryPercentage: 0.8,
    //   },
    // ],
    labels, // 담당자 이름 리스트
    datasets,
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
        text: '담당자',
      },
    },
    scales: {
      x: {
        stacked: true,
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

  console.log('labels:', labels);
  console.log('datasets:', datasets);
  console.log('issuesByManagerAndStatus:', issuesByManagerAndStatus);
  console.log('labels:', labels);

  // 로딩 상태에 따른 조건부 렌더링
        if (loading) {
            return (
                <BoardContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <HashLoader color="#36d7b7" />
                </BoardContainer>
            );
        }

  return (
    <BoardContainer>
      <BoardHeader>{/* 헤더 */}
        <BoardTitle>대시보드</BoardTitle>
        <Breadcrumb>프로젝트 &gt; {pname} &gt; 대시보드</Breadcrumb>
      </BoardHeader>

      {enabledSprints.length === 0 ? ( // 스프린트가 없을 경우
        <p>활성 스프린트가 없습니다.</p>
      ) : (
        <>
          <DashboardSection>{/*차트라이브러리*/}
            <ChartContainer>{/* 이슈 진행 상태 */}
              <h3>이슈 진행 상태</h3>
              <Pie data={pieData} options={options} />
            </ChartContainer>
            <ChartContainer>{/* 담당자 진행 상태 */}
              <h3>팀원별 이슈 현황 상태</h3>
              <Bar data={stackedBarData} options={stackedBarOptions} />
            </ChartContainer>
          </DashboardSection>

          <ActiveSprintSection>{/*활성스프린트 설명*/}
            <InfoCard>
              <h4>{sprintDetails.spname}</h4>
              <p>목표 : {sprintDetails.goal}</p>
              <br />
              <Datediv><FcLeave /><h4>남은 기간</h4></Datediv>
              <span>{remainingDays}일</span>
              <p>시작일 : {formattedStartDate}</p>
              <p>마감일 : {formattedEndDate}</p>
            </InfoCard>
          </ActiveSprintSection>
        </>
      )}

    </BoardContainer>
  );
};

export default DBoard;
