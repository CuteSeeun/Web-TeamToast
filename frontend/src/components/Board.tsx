// //칸반 보드

// import React from 'react';
// import styled from 'styled-components';
// import Column from './Column';

// const BoardContainer = styled.div`
//   display: flex;
//   padding: 20px;
// `;

// const Board: React.FC = () => {
//   return (
//     <BoardContainer>
//       <Column title="백로그" tasks={[]} />
//       <Column title="진행 중" tasks={['이슈 1', '이슈 2']} />
//       <Column title="개발 완료" tasks={['이슈 3', '이슈 4']} />
//       <Column title="QA 완료" tasks={['이슈 5']} />
//     </BoardContainer>
//   );
// };

// export default Board;


//---------------------------------------------------------------------------

// import React from 'react';
// import styled from 'styled-components';
// import Column from './Column';

// const BoardContainer = styled.div`
//   position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
//   display: flex;
//   flex-direction: column;
// `;

// const BoardHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px;
// `;

// const BoardTitle = styled.h1`
//   font-size: 24px;
//   font-weight: bold;
// `;

// const Filters = styled.div`
//   display: flex;
//   align-items: center;

//   & > select {
//     margin-left: 10px;
//     padding: 5px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//   }
// `;

// const BoardMain = styled.div`
//   display: flex;
//   padding: 20px;
// `;

// const SprintCompleteButton = styled.button`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   padding: 10px 20px;
//   background-color: #038C8C;
//   color: #fff;
//   font-size: 14px;
//   font-weight: bold;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;

//   &:hover {
//     background-color: #026b6b;
//   }
// `;

// const Board: React.FC = () => {
//   return (
//     <BoardContainer>
//       {/* 상단 헤더 */}
//       <BoardHeader>
//         <BoardTitle>활성 스프린트</BoardTitle>
//         <Filters>
//           <label>담당자</label>
//           <label>유형</label>
//           <label>우선순위</label>
//         </Filters>
//       </BoardHeader>

//       {/* 메인 칸반 보드 */}
//       <BoardMain>
//         <Column title="백로그" tasks={[]} />
//         <Column title="진행 중" tasks={['이슈 1', '이슈 2']} />
//         <Column title="개발 완료" tasks={['이슈 3', '이슈 4']} />
//         <Column title="QA 완료" tasks={['이슈 5']} />
//       </BoardMain>

//       {/* 스프린트 완료 버튼 */}
//       <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
//     </BoardContainer>
//   );
// };

// export default Board;



import React from 'react';
import styled from 'styled-components';
import Column from './Column';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
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
// & > label {
//   margin-right: 20px;
//   font-size: 14px;
//   font-weight: bold;
//   cursor: pointer;
// }

const BoardMain = styled.div`
  display: flex;
  margin-left: 18px; /* 왼쪽 여백을 주고 싶다면 margin-left를 사용하세요 */
  margin-top: 0px; /* 필요하다면 위쪽 여백을 제거하세요 */
`;

const SprintCompleteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #038C8C;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #026b6b;
  }
`;

const Board: React.FC = () => {
  return (
    <BoardContainer>
      {/* 상단 헤더 */}
      <BoardHeader>
        {/* 제목 */}
        <BoardTitle>활성 스프린트</BoardTitle>
        {/* 네비게이션 텍스트 */}
        <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 활성 스프린트</Breadcrumb>
        {/* 필터 */}
        <Filters>
          <label>담당자 <FaChevronDown /></label>
          <label>유형 <FaChevronDown /></label>
          <label>우선순위 <FaChevronDown /></label>
        </Filters>
      </BoardHeader>

      {/* 메인 칸반 보드 */}
      <BoardMain>
        <Column title="백로그" tasks={[]} />
        <Column title="진행 중" tasks={['이슈 1', '이슈 2']} />
        <Column title="개발 완료" tasks={['이슈 3', '이슈 4']} />
        <Column title="QA 완료" tasks={['이슈 5']} />
      </BoardMain>

      {/* 스프린트 완료 버튼 */}
      <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
    </BoardContainer>
  );
};

export default Board;

