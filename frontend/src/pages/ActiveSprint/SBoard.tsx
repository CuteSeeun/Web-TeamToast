//칸반 보드

import React from 'react';
import styled from 'styled-components';
import Column from './Column';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
  overflow: hidden; /* BoardContainer에서 스크롤 막기 */
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
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

const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
  margin-bottom: 0px; /* BoardMain과 간격을 줄이려면 이 값을 줄이세요 근데 여기서 더 간격을 줄이고 싶다면 BoradMain의 마진 탑을 줄이면 된다.*/

  & > label {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;

    svg {
      margin-left: 5px; /* 텍스트와 아이콘 간격 */
    }
  }
`;

const BoardMain = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap; /* 줄바꿈 허용하지 않음 */
  margin-left: 18px; /* 왼쪽 여백을 주고 싶다면 margin-left를 사용하세요 */
  margin-top: 0px; /* 필요하다면 위쪽 여백을 제거하세요 */
  
  // overflow-x: auto; /* 필요하면 스크롤 추가 */
  overflow-y: hidden; /* 세로 스크롤 방지 */ /*근데 이걸 해야 가로 스크롤이 생김..*/
  // width: 100%; /* 부모 컨테이너 크기에 맞춤 */
`;

const SprintCompleteButton = styled.button`
  position: absolute;
  top: 100px;
  right: 20px;
  padding: 10px 10px;
  background-color: #038C8C;
  color: #fff;
  font-size: 14px;
  // font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top : 30px;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 

  &:hover {
    background-color: #026b6b;
  }

  &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
  }
`;

const SBoard: React.FC = () => {
  return (
    <BoardContainer>
      {/* 상단 헤더 */}
      <BoardHeader>
        {/* 제목 */}
        <BoardTitle>활성 스프린트</BoardTitle>
        {/* 네비게이션 텍스트 */}
        <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 활성 스프린트</Breadcrumb>
          <Filters>
            <label>담당자 <FaChevronDown /></label>
            <label>유형 <FaChevronDown /></label>
          </Filters>
          <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
      </BoardHeader>
      {/* 메인 칸반 보드 */}
      <BoardMain>
        <Column title="백로그" tasks={[]} />
        <Column title="진행 중" tasks={['이슈 1', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2', '이슈 2' ]} />
        <Column title="개발 완료" tasks={['이슈 3', '이슈 4']} />
        <Column title="QA 완료" tasks={['이슈 5']} />
      </BoardMain>
    </BoardContainer>
  );
};

export default SBoard;

