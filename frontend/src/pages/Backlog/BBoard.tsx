//백로그 보드

import React from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { BsThreeDots } from 'react-icons/bs'; // 수평 점 메뉴 아이콘

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



const SprintBox = styled.div`
  background-color: #f2f2f2;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: calc(100% - 60px); /* 양쪽 30px 간격 */
  max-width: 1200px; /* 최대 너비 제한 */
`;

const SprintHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SprintName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const SprintPeriod = styled.p`
  font-size: 14px;
  color: #6c757d;
`;

const SprintControls = styled.div`
  display: flex;
  align-items: center;

  button {
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;

    &:hover {
      background-color: #026b6b;
    }

    &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
    }
  }

  .menu-icon {
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;

    &:hover {
      color: #333;
    }
  }
`;

const IssueTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    background-color: #e9ecef;
    text-align: left;
    padding: 8px;
    font-size: 14px;
    font-weight: bold;
    color: #495057;
  }

  td {
    padding: 8px;
    border-bottom: 1px solid #dee2e6;
    font-size: 14px;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const AddIssueLink = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #4D4D4D;
  cursor: pointer;

  &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
  }
`;

const AddSprint = styled.button`
background-color: #fff;
border: 1px solid #dee2e6;
border-radius: 5px;
padding: 10px 20px;
cursor: pointer;
font-size: 14px;
color: #495057;
margin-right: 10px;

&:hover {
    background-color: #026b6b;
    color: #fff;
}

&:active {
    transform: translateY(2px);
}
`;


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

const BBoard: React.FC = () => {
    return (
        <BoardContainer>

            <BoardHeader>{/* 상단 헤더 */}
                <BoardTitle>백로그</BoardTitle>{/* 제목 */}
                <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 백로그</Breadcrumb>{/* 네비게이션 텍스트 */}
                <Filters>
                    <label>담당자 <FaChevronDown /></label>
                    <label>유형 <FaChevronDown /></label>
                    <label>상태 <FaChevronDown /></label>
                    <label>우선순위 <FaChevronDown /></label>
                </Filters>
            </BoardHeader>

            {/* 스프린트 박스 */}
            <SprintBox>
                <SprintHeader>
                    <div>
                        <SprintName>스프린트 이름 1</SprintName>
                        <SprintPeriod>스프린트 기간 (년. 월. 일 ~ 년. 월. 일)</SprintPeriod>
                    </div>
                    <SprintControls>
                        <button>스프린트 시작</button>
                        <BsThreeDots className="menu-icon" />
                    </SprintControls>
                </SprintHeader>
                <IssueTable>
                    <thead>
                        <tr>
                            <th>이슈</th>
                            <th>작업 상태</th>
                            <th>우선순위</th>
                            <th>담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>이슈 이름 1</td>
                            <td style={{ color: '#f0ad4e' }}>작업 중</td>
                            <td>높음</td>
                            <td>
                                <img
                                    src="https://via.placeholder.com/24"
                                    alt="담당자"
                                    style={{ borderRadius: '50%' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>이슈 이름 2</td>
                            <td style={{ color: '#5cb85c' }}>QA 완료</td>
                            <td>보통</td>
                            <td>
                                <img
                                    src="https://via.placeholder.com/24"
                                    alt="담당자"
                                    style={{ borderRadius: '50%' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>이슈 이름 3</td>
                            <td style={{ color: '#5bc0de' }}>개발 완료</td>
                            <td>보통</td>
                            <td>
                                <img
                                    src="https://via.placeholder.com/24"
                                    alt="담당자"
                                    style={{ borderRadius: '50%' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>이슈 이름 4</td>
                            <td style={{ color: '#d9534f' }}>개발 완료</td>
                            <td>긴급</td>
                            <td>
                                <img
                                    src="https://via.placeholder.com/24"
                                    alt="담당자"
                                    style={{ borderRadius: '50%' }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </IssueTable>
                <AddIssueLink>+ 이슈 추가하기</AddIssueLink>
            </SprintBox>

            {/* 두 번째 스프린트 박스 */}
            <SprintBox>
                <SprintHeader>
                    <div>
                        <SprintName>스프린트 이름 2</SprintName>
                        <SprintPeriod>스프린트 기간 (월. 일 ~ 월. 일)</SprintPeriod>
                    </div>
                    <SprintControls>
                        <button>스프린트 시작</button>
                        <BsThreeDots className="menu-icon" />
                    </SprintControls>
                </SprintHeader>
                <IssueTable>
                    <thead>
                        <tr>
                            <th>이슈</th>
                            <th>작업 상태</th>
                            <th>우선순위</th>
                            <th>담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d' }}>
                                이슈를 이 영역으로 끌어와 스프린트를 채우세요.
                            </td>
                        </tr>
                    </tbody>
                </IssueTable>
                <AddIssueLink>+ 이슈 추가하기</AddIssueLink>
            </SprintBox>


            {/* 스프린트 생성 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <AddSprint>스프린트 생성</AddSprint>
            </div>
            {/* 백로그 박스 */}
            <SprintBox>
                <SprintHeader>
                    <div>
                        <SprintName>백로그</SprintName>
                    </div>
                </SprintHeader>
                <IssueTable>
                    <thead>
                        <tr>
                            <th>이슈</th>
                            <th>작업 상태</th>
                            <th>우선순위</th>
                            <th>담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>이슈 이름 1</td>
                            <td style={{ color: '#d9534f' }}>백로그</td>
                            <td>높음</td>
                            <td>
                                <img
                                    src="https://via.placeholder.com/24"
                                    alt="담당자"
                                    style={{ borderRadius: '50%' }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </IssueTable>
                <AddIssueLink>+ 이슈 추가하기</AddIssueLink>
            </SprintBox>
        </BoardContainer >
    );
};

export default BBoard;

